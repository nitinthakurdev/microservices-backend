import { HealthController } from "@gateway/controller/health";
import { Router } from "express";


class HealthRouter {
    private routes:Router;
    constructor(){
        this.routes =Router();
    }

    public healthRoute():Router{
        this.routes.get("/health",HealthController.prototype.health)
        return this.routes;
    }
}

export const healthRoute:HealthRouter = new HealthRouter();