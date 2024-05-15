import express, { Request, Response } from "express";
import { PackageEntity } from "../../entity/PackageEntity";
import { AppDataSource } from "../../database/dataSource";
import { jwt } from "../../app";
import { authenticateJWT } from "../../middlewares/authorization";
import { LessThan } from "typeorm";

const router = express.Router();
const createdAt = new Date().toISOString();
const updatedAt = new Date().toISOString();

// Middleware to parse incoming JSON data
router.use(express.json());

// Function to update package status every 2 minutes
let cron = require('node-cron');
cron.schedule('* */2 * * * *', async() => {
    const packages = await AppDataSource.manager.find(PackageEntity, {
        where: {
          status: "pending",
          pickup_date: LessThan(new Date()),
        },
      });
    
      for (const current_package of packages) {
        current_package.status = "in_transit";
        await AppDataSource.manager.save(current_package);
      }
});
// async function updatePackageStatus() {
  
// }

// // Start updating package status every 2 minutes
// setInterval(updatePackageStatus, 120000); // 120000 is 2 minutes in milliseconds

const verifyToken = (req: any, res: Response, next: Function) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send("Unauthorized");
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId; // Attach decoded user ID to the request object
    next();
  } catch (error) {
    return res.status(401).send("Unauthorized");
  }
};

// Route for creating a new package
router.all("/", authenticateJWT, async (req: Request, res: Response) => {
    if (req.method === "POST") {
        const { package_name } = req.body;
  const userId = req.user;
  await AppDataSource.manager.insert(PackageEntity, {
    name: package_name,
    created_at: createdAt,
    updated_at: updatedAt,
    status: "pending",
    pickup_date: new Date("2024-05-30"),
    user: req.user,
  });
  res.send({ message: `${package_name} booked successfully` });
    }else if (req.method == "GET"){
        const packages = await AppDataSource.manager.find(PackageEntity, {
            where:{
                user: req.user
            }
        })
        res.status(200).json({

        })
    }
  
});


export default router;
