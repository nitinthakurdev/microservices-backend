import { Logger } from "winston";
import {CustomError, IErrorResponse, winstonLogger} from "@nitinthakurdev/jobber-package";
import { Application, json, NextFunction, Request, Response, urlencoded } from "express";
import cookieSession from "cookie-session";
import helmet from "helmet";
import hpp from "hpp";
import cors from "cors";
import compression from "compression";
import { StatusCodes } from "http-status-codes";
import http from "http";
import { config } from "@gateway/config";
import { elasticSearch } from "@gateway/elasticSearch";
import { AppRoutes } from "./routes";
import { axiosAuthInstance } from "@gateway/services/api/auth.service";


const SERVER_PORT = 4000;
const log:Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`,"GatewayService","debug");


export class GatewayServer {
    // ---------------- create a instance i use in my class only ------------------
    private app:Application;

    constructor(app:Application){
        this.app = app;
    }

    // ----------------- call outside the function to run the application ------------------
    public start ():void{
        this.securityMiddleware(this.app);
        this.standardMiddleware(this.app);
        this.routesMiddleware(this.app);
        this.startElasticSearch();
        this.errorHandler(this.app);
        this.startServer(this.app);
    };

    // --------------------- security middleware handle all the security -------------------
    private securityMiddleware(app:Application):void{
        app.set("trust proxy",1);
        app.use(cookieSession({
            name:"session",
            keys:[`${config.SECRET_KEY_ONE}`,`${config.SECRET_KEY_TWO}`],
            maxAge:24 * 7 * 3600000,
            secure: config.NODE_ENV !== "development",
        }));
        app.use(hpp());
        app.use(helmet());
        app.use(cors({
            origin:config.CLIENT_URL,
            credentials:true,
            methods:['GET','POST','PUT','PATCH','OPTIONS']
        }));
        app.use((req:Request,_res:Response,next:NextFunction)=>{
            if(req.session?.jwt){
                axiosAuthInstance.defaults.headers["Authorization"] = `Bearer ${req.session?.jwt}`
            }
            next()
        })
    }

    // --------------------- standard middleware handle all the express default middleware they are nessusery to run an applicatin -----------------------
    private standardMiddleware (app:Application):void{
        app.use(compression());
        app.use(json({limit:"200mb"}));
        app.use(urlencoded({extended:true,limit:"200mb"}));
    };

    // ---------------------- create an route middleware all routes pass into this middleware ----------------------------------
    private routesMiddleware(app:Application):void{
        AppRoutes(app)
    };

    // ----------------------- create a function to connect the app into elasticsearch ----------------------
    private startElasticSearch():void{
        elasticSearch.CheckElasticConnection();
    }

    // ------------------------- create an error handler to handle all the error ------------------------
    private errorHandler(app:Application):void{
        app.use("/",(req:Request,res:Response,next:NextFunction) => {
            const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
            log.log('error',`${fullUrl} endpoint does not exist`,'');
            res.status(StatusCodes.NOT_FOUND).json({
                message:"the endpoint is not exist",
                url:fullUrl
            })
            next();
        });

        app.use((err:IErrorResponse ,_req:Request,res:Response,next:NextFunction) => {
            log.log('error',`GatewayService ${err.commingFrom}`,err);
            if(err instanceof CustomError){
                res.status(err.statusCodes).json(err.serializeError())
            };
            next();
        })
    }

    // ------------------------ start server is mainly create for socket connection --------------------
    private async startServer(app:Application):Promise<void>{
        try {

            const httpServer:http.Server = new http.Server(app);
            this.startHttpServer(httpServer);
            
        } catch (error) {
            log.log('error',"GatewayServer startServer() method error",error);
        }
    };

    // ------------------------ start http server is start my app -------------------------
    private async startHttpServer(httpServer:http.Server):Promise<void>{
        try {
            log.info(`Server start with process id ${process.pid}`);
            httpServer.listen(SERVER_PORT,()=>{
                log.info(`Server is running on port : ${SERVER_PORT}`);
            })
        } catch (error) {
            log.log('error',"GatewayServer startHttpServer() method error",error);
        }
    }
} 
