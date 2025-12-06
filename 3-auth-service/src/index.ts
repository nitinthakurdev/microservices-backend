import express,{Express} from "express";
import { start } from "@auth/server";

const initServer = ():void => {
    const app:Express = express();
    start(app);
} 

initServer();