import { env } from "process";
import { sign } from "jsonwebtoken";
import { createHash } from "crypto";
import axios from "axios";
const { JiraConnection, users } = require("../database/models/index");
const baseURL = `https://${env["JIRA_INSTANCE"]}`;

interface Issue {
    fields: {
        assignee: {
            accountId: string
        } | null,
        customfield_10016: number | null
    }
}

interface AccountData {
    accountId: string
}

export async function onInstalledCallback(url: string, clientKey: string, sharedSecret: string) {
    await JiraConnection.create({
        url,
        clientKey,
        sharedSecret
    });
}

function createJiraToken(method: string, basePath: string, queryParams: string): string {
    return `JWT ${sign({ qsh: createHash("sha256").update(`${method}&${basePath}&${queryParams}`).digest("hex") }, env["JIRA_SECRET"]!, {
        issuer: "tech.mindfinances.payrolljira",
        expiresIn: "30m"
    })}`;
}

export async function fetchStoryPointsOfPeriod(startDate: Date, endDate: Date) {
    const method = "GET";
    const basePath = "/rest/api/3/search";
    const queryParams = `fields=assignee%2Ccustomfield_10016&jql=created%3E%3D%22${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate()}%22%20AND%20created%3C%3D%22${endDate.getFullYear()}-${endDate.getMonth() + 1}-${endDate.getDate()}%22%20AND%20status%3DDone&maxResults=1000`;

    const issuesList = (await axios.get(`${basePath}?${queryParams}`, {
        headers: {
            Authorization: createJiraToken(method, basePath, queryParams)
        },
        baseURL
    })).data.issues;

    const userPoints: {[key: string]: number} = {};
    issuesList.forEach((issue: Issue) => {
        if (issue.fields.assignee) {
            userPoints[issue.fields.assignee.accountId] = (userPoints[issue.fields.assignee.accountId] ?? 0) + (issue.fields.customfield_10016 ?? 0);
        }
    });

    const payrollUserPoints: {[key: number]: number} = {};
    for (const entry of Object.entries(userPoints)) {
        const payrollUser = await users.findOne({where:{atlassianId: entry[0]}});

        if (payrollUser) {
            payrollUserPoints[payrollUser.id] = entry[1];
        }
    }
    return payrollUserPoints;
}

export async function linkJiraAccountByUserId(userId: number) {
    const method = "GET";
    const basePath = "/rest/api/3/user/search";

    const userData = await users.findByPk(userId);

    if (userData === null) {
        throw "Not found in payroll";
    }

    const queryParams = `query=${(userData.email as string).replace("@", "%40")}`;

    const jiraAccountsData: AccountData[] = (await axios.get(`${basePath}?${queryParams}`, {
        headers: {
            Authorization: createJiraToken(method, basePath, queryParams)
        },
        baseURL
    })).data;

    if (jiraAccountsData.length === 0) {
        throw "Not found in Jira";
    }

    if (jiraAccountsData.length > 1) {
        throw "Multiple users with same email";
    }

    await users.update({atlassianId: jiraAccountsData[0].accountId}, {where: {id: userId}});
}
