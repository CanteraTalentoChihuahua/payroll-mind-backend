import app from "./app"
import db from "./database/database";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    db.sync()
    console.log(`Listening in port ${PORT}...`);
});
