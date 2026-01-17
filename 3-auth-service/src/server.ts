import { Application, json, NextFunction, Request, Response, urlencoded } from "express";
import hpp from "hpp";
import helmet from "helmet";
import cors from "cors";
import { verify } from "jsonwebtoken";
import compression from "compression";
import http from "http";
import { Logger } from "winston";
import { CustomError, IAuthPayload, IErrorResponse, winstonLogger } from "@nitinthakurdev/jobber-package";

// ----------------------- all local imports here --------------------
import { config } from "@auth/config";
import { checkElasticSearchConnection } from "@auth/elasticSearch";
import { AppRoutes } from "@auth/routes";

// -------------------------------------- contant data set here ------------------------------
const SERVER_PORT = 4002;
const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'AuthService', 'debug');


// ------------------------ public function call outside the file and handle all that things ------------------------------
export function start(app: Application): void {
    securityMiddleware(app);
    standardMiddleware(app);
    routesMiddleware(app);
    startQueues();
    startElasticSearch();
    authErrorHandler(app);
    startServer(app);
};

// -------------------------- security middleware here all the security stuf here ---------------------------------
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

// ------------------------------- nessusery middleware to run that server ----------------------------------------
function standardMiddleware(app: Application): void {
    app.use(compression());
    app.use(json({ limit: "50mb" }));
    app.use(urlencoded({ extended: true, limit: "50mb" }));
};

// ------------------------------- routes middleware is handle the routing ---------------------------------------
function routesMiddleware(app: Application): void {
    AppRoutes(app);
};

// ------------------------------ this is function is used for reqbitmq for queues ----------------------------------
async function startQueues(): Promise<void> {

};

// ------------------------------- the elastic search function to connect my service to elastic search ------------------
function startElasticSearch(): void {
    checkElasticSearchConnection()
};

// ------------------------------ this auth error handler to handle errors ------------------------------
function authErrorHandler (app:Application):void {

     app.use((err:IErrorResponse ,_req:Request,res:Response,next:NextFunction) => {
            log.log('error',`GatewayService ${err.commingFrom}`,err);
            if(err instanceof CustomError){
                res.status(err.statusCodes).json(err.serializeError())
            };
            next();
        })


};

// ------------------------------ start server function to start the server ---------------------------
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
};



