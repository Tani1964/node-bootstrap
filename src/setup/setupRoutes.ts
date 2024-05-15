import { Application } from "express";
import { authenticateJWT } from "../middlewares/authorization";
import packageRoutes from "../routes/controllers/packageRoutes";
import userRoutes from "../routes/controllers/userRoutes";
import healthCheckRoute from "../routes/healthCheckRoute";


export default function setupRoutes(app: Application): void {
  app.use("/api/v1/health", healthCheckRoute);
  app.use("/api/v1/users", userRoutes);
  app.use("/api/v1/packages", packageRoutes);
}
