import { Application } from "express";
import { healthRoute } from "@gateway/routes/health";
import { authRoutes } from "@gateway/routes/auth";


const BASE_PATH = "/api/gateway/v1"

export const AppRoutes = (app:Application) => {
    app.use("",healthRoute.healthRoute());
    app.use(BASE_PATH,authRoutes.routes())
}