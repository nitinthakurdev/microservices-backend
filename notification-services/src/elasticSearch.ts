import {Client} from "@elastic/elasticsearch";
import { winstonLogger } from "@nitinthakurdev/jobber-package";
import { config } from "@notifications/config";
import { Logger } from "winston";

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, "ElasticSearch in Notification Services", 'debug');


const elasticSearchClient = new Client({
    node:config.ELASTIC_SEARCH_URL,
});

export const checkElasticSearchConnection = async () :Promise<void> => {
    let isConnected = false;
    do{
        try {
            const health = await elasticSearchClient.cluster.health({});
            log.info(`Notifictaion service Elasticsearch health Status - ${health.status}`);
            isConnected = true
        } catch (error) {
            log.error("Elasticsearch connection failed. retrying connection ..........");
            log.log("error","Notification service checkElasticSearchConnection() method",error)
        }
    }while(!isConnected)
}


