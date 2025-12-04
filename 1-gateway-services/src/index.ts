import express, { Express } from "express";
import { GatewayServer } from "@gateway/server";


// -------------- initlize my server here ------------------
class Application {
    public initServer():void{
        const app:Express = express();
        const server:GatewayServer = new GatewayServer(app);
        server.start();
    };
};


const application:Application = new Application();
application.initServer();