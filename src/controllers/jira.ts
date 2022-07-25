const { JiraConnection } = require("../database/models/index");

export async function onInstalledCallback(url: string, clientKey: string, sharedSecret: string) {
    await JiraConnection.create({
        url,
        clientKey,
        sharedSecret
    });
}
