import 'express-async-errors';
import { Logger } from 'winston';
import { winstonLogger } from "@nitinthakurdev/jobber-package"
import { config } from '@notifications/config';
import { Application } from 'express';
import http from "http";
import { healthRoute } from '@notifications/routes';
import { checkElasticSearchConnection } from '@notifications/elasticSearch';




const SERVER_PORT: number = 4001;
const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, "Notification service", 'debug');


export const start = (app: Application): void => {
    startServer(app);
    app.use('/',healthRoute())
    startQueues();
    startElasticSearch();
};


async function startQueues(): Promise<void> {

};


async function startElasticSearch(): Promise<void> {
checkElasticSearchConnection();
};

function startServer(app: Application): void {
    try {
        const httpserver: http.Server = new http.Server(app);
        log.info(`worker with pid:${process.pid} on notification server has started `);
        httpserver.listen(SERVER_PORT, () => {
            log.info(`Notification service running on port ${SERVER_PORT}`)
        })
    } catch (error) {
        log.log('error', "notification service startServer() method", error)
    }
}



