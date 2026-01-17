import express,{Express} from "express";
// ---------- local imports -------------
import { start } from "@auth/server";
import { dbConnection } from "@auth/database";

// initilize server here 
const initServer = ():void => {
    const app:Express = express();
    dbConnection()
    start(app);
} 

initServer();