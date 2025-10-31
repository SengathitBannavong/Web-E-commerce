import dotenv from "dotenv";
import express from 'express';
import { connectDB } from "./config/database.js";
import { user_router } from "./routes/user_route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const URL = process.env.DATABASE_URL;

app.use(express.json());
app.get('/', (req, res) => {
    res.send('Hello from Express (ES Module)!');
});

app.use("/users", user_router);

connectDB(URL).then(async() => {
    app.listen(PORT, () => console.log(`server running on port ${PORT}`));
});




