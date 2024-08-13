import express from "express";
import "dotenv/config";
import ejs from "ejs";
const app = express();
const PORT = process.env.PORT || 7000;
import path from 'path';
import { fileURLToPath } from "url";
import { sendMail } from "./config/mail.js";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// * Set View engine
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "./views"));
app.get("/", async (req, res) => {
    const html = await ejs.renderFile(__dirname + `/views/emails/welcome.ejs`, { name: "Sujit Kumar" });
    await sendMail("sujit678kic@gmail.com", "Test SMTP", html);
    return res.json({ msg: "Email send successfully!" });
});
app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
