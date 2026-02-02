import express,{Express} from "express";
// ---------- local imports -------------
import { start } from "@auth/server";
import { dbConnection } from "@auth/database";
import { config } from "@auth/config";

// initilize server here 
const initServer = ():void => {
    config.cloudnaryConfig();
    const app:Express = express();
    dbConnection()
    start(app);
} 

initServer();