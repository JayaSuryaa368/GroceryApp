import express from "express"
import cors from "cors";
import userRoutes from "../routes/userRoutes.js";
import storeRoutes from "../routes/storeRoutes.js"
import testRoutes from "../routes/testRoutes.js"
import loginRoute from "../routes/authRoutes.js"
import productRoute from "../routes/productRoutes.js"

const app = express();

app.use(cors());

app.use(express.json());

app.get("/health",(req,res)=>{
    res.status(201).send({success:true,message:"App is working"})
})

app.get("/checkserver",(req,res)=>{
    res.status(201).send({
        message:"Server is running good"
    })
})



app.use((req, res, next) => {
    console.log(`Incoming Request: ${req.method} ${req.url}`);
    next();
});

app.use("/api/groceryapp",userRoutes);

app.use("/api/groceryapp",storeRoutes);

app.use("/api/groceryapp",testRoutes);

app.use("/api/groceryapp",loginRoute);
console.log("--above")
app.use("/api/groceryapp",productRoute)
console.log("--above")

app.listen(5000, "0.0.0.0", () => {
  console.log("Server is listening on all interfaces");
});
export default app;