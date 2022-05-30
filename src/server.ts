// @ts-ignore
import db from "./database/models/index"
import app from "./app"

const PORT = process.env.PORT || 3000;

db.sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Listening in port ${PORT}...`);
    });
})
