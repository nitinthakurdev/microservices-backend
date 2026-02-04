import { Application, Request, Response } from "express";
import { authRouter } from "./routes/auth";
// import { verifyGatewayRequest } from "@nitinthakurdev/jobber-package";


export const AppRoutes = (app:Application):void => {
    app.get("/health",(_req:Request,res:Response) => res.send("server is health and ok"));
    app.use("/api/v1/auth",authRouter())
}