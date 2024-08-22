import express ,{Application ,Request ,Response} from "express"
import "dotenv/config"
import ejs from "ejs";
import { limiter } from "./config/rateLimit.js";
import fileUpload from "express-fileupload"
import cors from "cors"
const app:Application=express()
const PORT= process.env.PORT||7000
import { emailQueue, emailQueueName } from "./jobs/EmailJob.js";
import path from 'path'
import {fileURLToPath} from "url"
import Routes from "./routes/index.js";
const __dirname=path.dirname(fileURLToPath(import.meta.url))


app.use(express.json())
app.use(cors());
app.use(express.urlencoded({extended:false}))
app.use(limiter);
app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:'/tmp/'
}))
app.use(express.static("public"));

// * Set View engine
app.set("view engine","ejs")
app.set("views",path.resolve(__dirname,"./views"));

//* Routes
app.use(Routes);
 
app.get("/",async(req:Request,res:Response)=>{
    const html=await ejs.renderFile(__dirname+`/views/emails/welcome.ejs`,{name:"Sujit Kumar"})
    // await sendMail("sujit678kic@gmail.com","Test SMTP",html)
    await emailQueue.add(emailQueueName,{to:"sujit678kic@gmail.com",subject:"Testing queue email",body:html});
    return res.json({msg:"Email send successfully!"});
});

// Queues
import "./jobs/index.js";


app.listen(PORT,()=>console.log(`Server is running on PORT ${PORT}`));