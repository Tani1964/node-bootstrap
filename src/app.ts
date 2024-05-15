import cors from "cors";
import express from "express";
import setupRoutes from "./setup/setupRoutes";
import setupMiddlewares from "./setup/setupMiddlewares";

const app = express();
app.use(express.json());
app.use(cors());

export const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET

export const generateAccessToken = (data:Object) => {
    return jwt.sign(data, secretKey, { expiresIn: '30m' }); // Set expiry time (optional)
  }



setupMiddlewares(app);
setupRoutes(app);

export default app;
