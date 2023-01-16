import cookieParser from "cookie-parser";
import cors from "cors";
import * as dotenv from 'dotenv';
import express from "express";
import morgan from "morgan";
import auth from './controllers/authcontroller.js';


if (process.env.NODE_ENV !== "production") {
  dotenv.config()
}

const PORT = process.env.PORT || 8000;
const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(morgan("dev"));

//routes for the user API
app.use('/api/auth', auth);


//listening to server connection
app.listen(PORT, () => console.log(`Server is connected on ${PORT}`));
