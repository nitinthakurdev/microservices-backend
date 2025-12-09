import express,{Express} from "express";
// ---------- local imports -------------
import { start } from "@auth/server";

// initilize server here 
const initServer = ():void => {
    const app:Express = express();
    start(app);
} 

initServer();