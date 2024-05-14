import express, { type Request, type Response } from "express";
import { PackageEntity } from "../../entity/PackageEntity";

const router = express.Router();

router.all("/", (req: Request, res: Response) =>{
    if (req.method == "GET"){
        res.send(`
        <form method="POST">
          <label for="package_name">Package name:</label>
          <input type="text" id="package_name" name="package_name"><br><br>
          <input type="submit" value="Submit">
        </form>
      `)
    }else if(req.method == "POST"){
        const {package_name} = req.body
        
        res.send({
            message: `${package_name} booked successfully`
        })
    }
})
router.all("/track", (req: Request, res: Response) =>{
    if (req.method == "GET"){
        res.send({message : "package"})
    }else if(req.method == "POST"){

    }
})

export default router;