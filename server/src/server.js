import app from "./app.js";
import connectDB from "../config/db.js"
import dotenv from 'dotenv';

dotenv.config();

connectDB();

const port=process.env.PORT;

app.listen(port,()=>{
    console.log("App is listening to port "+port);
})