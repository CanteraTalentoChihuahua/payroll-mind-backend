import express from "express";

const router = express.Router();

router.get("/payroll/:id", async (req, res) => {
    // Query user -- get salary

    // Query incomes-users

    // Query outcomes-users

    // Sum total

    // Build final object (id, name, amount for each entry ; sum total)

    // Send final JSON 
    const successful = false;

    if (!successful) {
        res.status(400).send("An error occured.");
    }

    const payrollObject = {
        "incomes": {},
        "outcomes": {},
        "salary": {},
        "sum_total": {}
    };

    res.status(200).send(payrollObject);
});

