import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import userRouter from "./routes/user.js";
import { errorLogger } from "./middleware/log.js";
import log from "./middleware/log.js";
import chatFormRouter from "./routes/chat.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());
app.use(log);
app.use('/api/users', userRouter);
app.use('/api/chat', chatFormRouter);


const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB")
    }catch(error){
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
};

connectDB();

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use(errorLogger);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


