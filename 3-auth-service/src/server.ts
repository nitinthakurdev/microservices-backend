import { winstonLogger } from "@nitinthakurdev/jobber-package";
import { Logger } from "winston";
import { config } from "./config";
import { Application } from "express";
import hpp from "hpp";
import helmet from "helmet";
import cors from "cors";


const SERVER_PORT = 4002;
const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'AuthService', 'debug');


export  function start (app:Application):void {
securityMiddleware(app)
};

function securityMiddleware (app:Application) {
    app.set("trust proxy",1);
    app.use(hpp());
    app.use(helmet());
    app.use(cors({
        origin:config.API_GATEWAY_URL,
        credentials:true,
        methods:["POST","GET","PUT","PATCH","DELETE","OPTIONS"]
    }))
}