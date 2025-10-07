import express , { Application } from "express";
import { start } from "@notifications/server";

function initServer () {
    const app:Application = express()
    start(app);
};

initServer()




