import { winstonLogger } from "@nitinthakurdev/jobber-package";
import { config } from "@notifications/config";
import client , {Channel,Connection} from "amqplib";
import { Logger } from "winston";

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, "NotificationQueueConnection", 'debug');


export const createConnection = async () :Promise<Channel | undefined> => {
    try {
        const connection:Connection = await client.connect(`${config.RABBITMQ_ENDPOINT}`);
        // const Channel:Channel = await connection
    } catch (error) {
        log.log("error","notification service createConnection() method ",error);
        return undefined;
    }
}






