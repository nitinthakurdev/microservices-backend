import { Application, Request, Response } from "express";


export const AppRoutes = (app:Application):void => {
    app.get("/health",(_req:Request,res:Response) => res.send("server is health and ok"))
}