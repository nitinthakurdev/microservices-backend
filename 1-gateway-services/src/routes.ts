import { Application } from "express";
import { healthRoute } from "@gateway/routes/health";


export const AppRoutes = (app:Application) => {
    app.use("",healthRoute.healthRoute())
}