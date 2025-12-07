import { CustomError, IAuthPayload, IErrorResponse, winstonLogger } from "@nitinthakurdev/jobber-package";
import { Logger } from "winston";
import { config } from "./config";
import { Application, json, NextFunction, Request, Response, urlencoded } from "express";
import hpp from "hpp";
import helmet from "helmet";
import cors from "cors";
import { verify } from "jsonwebtoken";
import compression from "compression";
import { checkElasticSearchConnection } from "@auth/elasticSearch";
import http from "http";


const SERVER_PORT = 4002;
const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'AuthService', 'debug');


export function start(app: Application): void {
    securityMiddleware(app);
    standardMiddleware(app);
    routesMiddleware(app);
    startQueues();
    startElasticSearch();
    authErrorHandler(app);
    startServer(app);
};

function securityMiddleware(app: Application): void {
    app.set("trust proxy", 1);
    app.use(hpp());
    app.use(helmet());
    app.use(cors({
        origin: config.API_GATEWAY_URL,
        credentials: true,
        methods: ["POST", "GET", "PUT", "PATCH", "DELETE", "OPTIONS"]
    }));
    app.use((req: Request, _res: Response, next: NextFunction) => {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(" ")[1];
            const payload = verify(token, config.GATEWAY_JWT_TOKEN!) as IAuthPayload;
            req.currentUser = payload;
        };
        next()
    })
};

function standardMiddleware(app: Application): void {
    app.use(compression());
    app.use(json({ limit: "50mb" }));
    app.use(urlencoded({ extended: true, limit: "50mb" }));
};

function routesMiddleware(app: Application): void {
    console.log(app);
};

async function startQueues(): Promise<void> {

};

function startElasticSearch(): void {
    checkElasticSearchConnection()
};

function authErrorHandler (app:Application):void {

     app.use((err:IErrorResponse ,_req:Request,res:Response,next:NextFunction) => {
            log.log('error',`GatewayService ${err.commingFrom}`,err);
            if(err instanceof CustomError){
                res.status(err.statusCodes).json(err.serializeError())
            };
            next();
        })


};

function startServer(app:Application):void {
    try {
        const httpServer:http.Server = new http.Server(app);
        log.info(`Auth server started with process id : ${process.pid}`);
        httpServer.listen(SERVER_PORT,()=>{
            log.info(`Auth server is up and running on port : ${SERVER_PORT} `)
        })

    } catch (error) {
        log.log("error","AuthService startServer() error",error)
    }
}



