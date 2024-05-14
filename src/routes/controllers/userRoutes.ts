import express, { type Request, type Response } from "express";
import { UserEntity } from "../../entity/UserEntity";
import {AppDataSource} from "../../database/dataSource"


const router = express.Router();
const created_At = new Date();
const updated_At = new Date();

router.all("/login", async (req: Request, res: Response) => {
  if (req.method === "GET") {
    // Handle GET request for login page
    res.send(`
          <form method="POST">
            <label for="username">Username:</label>
            <input type="text" id="username" name="username"><br><br>
            <label for="password">Password:</label>
            <input type="password" id="password" name="password"><br><br>
            <input type="submit" value="Submit">
          </form>
        `);
  } else if (req.method === "POST") {
    // Handle POST request for login form submission
    const { username, password } = req.body;
    const user = await AppDataSource.manager.findOne(UserEntity, {
            where: {
                name : username,
                password: password
            }
        })

    if (!user) {
      res.status(401).send("Invalid username or password");
    } else {
      res.send({
        username: username,
        password: password,
      });
    }
  }
});

// Combine GET and POST requests for the '/signup' route
router.all("/signup", async(req: Request, res: Response) => {
  if (req.method === "GET") {
    // Handle GET request for signup page
    res.send(`
        <form method="POST">
          <label for="username">Username:</label>
          <input type="text" id="username" name="username"><br><br>
          
          <label for="email">Email:</label>
          <input type="email" id="email" name="email"><br><br>
          
          <label for="phone">Phone Number:</label>
          <input type="tel" id="phone" name="phone"><br><br>
          
          <label for="password">Password:</label>
          <input type="password" id="password" name="password"><br><br>
          
          <input type="submit" value="Submit">
        </form>
      `);
  } else if (req.method === "POST") {
    // Handle POST request for signup form submission
    const { username, email, phone, password } = req.body;
    await AppDataSource.manager.insert(UserEntity,{
        name: username,
        email,
        password,
        created_at: created_At.toISOString(),
        updated_at: updated_At.toISOString()
    })
    const user = await AppDataSource.manager.findOne(UserEntity, {
        where: {
            name : username
        }
    })

    res.send(`${user?.name} signed up successful! \n user details: ${user}`);
  }
});

export default router;