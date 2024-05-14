import { Application } from "express";
import healthCheckRoute from "../routes/healthCheckRoute";
import userRoutes from "../routes/controllers/userRoutes";
import packageRoutes from "../routes/controllers/packageRoutes";


export default function setupRoutes(app: Application): void {
  app.use("/api/v1/health", healthCheckRoute);
  app.use("/api/v1/users", userRoutes);
  app.use("/api/v1/packages", packageRoutes);
}
