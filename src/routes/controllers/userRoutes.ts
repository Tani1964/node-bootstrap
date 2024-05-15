import { JWTUser } from './../../types/jwtUser.d';
import express, { type Request, type Response } from "express";
import { UserEntity } from "../../entity/UserEntity";
import {AppDataSource} from "../../database/dataSource"
import { generateAccessToken } from '../../app';
import { authenticateJWT } from '../../middlewares/authorization';

const bcrypt = require('bcrypt');
const router = express.Router();
const created_At = new Date();
const updated_At = new Date();
let user;



// Function to hash a password
async function hashPassword(password:String) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch (error) {
        console.log(error);
    }
}

// Function to verify a password
async function verifyPassword(password:String, hashedPassword:String) {
    try {
        const isMatch = await bcrypt.compare(password, hashedPassword);
        return isMatch;
    } catch (error) {
        console.log(error);
    }
}

  

router.post("/login", async (req: Request, res: Response) => {

    // Handle POST request for login form submission
    const { username, password } = req.body;
    const hashedPassword = await hashPassword(password);
    const user = await AppDataSource.manager.findOne(UserEntity, {
            where: {
                name : username,
                password: password
            }
        })


    if (!user || await verifyPassword(user.password, hashedPassword) == false) {
      res.status(401).send("Invalid username or password..");
    } else {
    //   req.session.save(user.id)
        generateAccessToken( {userId:user.id})
      res.status(201).json({
        username: username,
        password: password,
      });
    }
  
});

// Combine GET and POST requests for the '/signup' route
router.post("/signup", async(req: Request, res: Response) => {
 
    // Handle POST request for signup form submission
    const { username, email, phone, password } = req.body;
    const hashedPassword = await hashPassword(password);

    await AppDataSource.manager.insert(UserEntity,{
        name: username,
        email,
        password: hashedPassword,
        created_at: created_At.toISOString(),
        updated_at: updated_At.toISOString()
    })
    user = await AppDataSource.manager.findOne(UserEntity, {
        where: {
            name : username,
            password: password
        }
    })

    return res.status(201).json({
        message: `${user?.name} signed up successful! `,
        user
    });
  
});

export default router;
