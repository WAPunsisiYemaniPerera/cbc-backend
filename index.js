import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import itemRouter from './routes/itemRouter.js';
import userRouter from './routes/userRouter.js';
import productRouter from './routes/productRouter.js';
import verifyJWT from './middleware/auth.js';
import orderRouter from './routes/orderRouter.js';
import cors from 'cors';
import dotenv from'dotenv';
//load dotenv
dotenv.config()

const app = express();

app.use(cors()) //can get the requests from any url

//mongodb+srv://admin:123@cluster0.3dtdct3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
mongoose.connect(process.env.MONGO_URL).then(
    ()=>{
        console.log("Connected to the database.");
    }
).catch(
    ()=>{
        console.log("Connection failed!");
    }
)

app.use(bodyParser.json());
app.use(verifyJWT)

app.use("/api/item",itemRouter);
app.use("/api/user",userRouter);
app.use("/api/product",productRouter);
app.use("/api/order",orderRouter)


app.listen(3005,()=>{
    console.log("Server is running on port 3005");
})