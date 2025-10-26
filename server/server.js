import dotenv from "dotenv";
import express from 'express';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello from Express (ES Module)!');
});

app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});
