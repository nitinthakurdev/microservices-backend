import { winstonLogger } from "@nitinthakurdev/jobber-package";
import { config } from "@notifications/config";
import client , {Channel,ChannelModel} from "amqplib";
import { Logger } from "winston";

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, "NotificationQueueConnection", 'debug');


export const createConnection = async () :Promise<Channel | undefined> => {
    try {
        const connect:ChannelModel = await client.connect(`${config.RABBITMQ_ENDPOINT}`);
        const Channel:Channel = await connect.createChannel();
        log.info("Notification service connected to queue successfully");
        closeConnection(Channel,connect);
        return Channel;
    } catch (error) {
        log.log("error","notification service createConnection() method ",error);
        return undefined;
    }
};


function closeConnection (Channel:Channel,connection:ChannelModel):void {
    process.once('SIGINT' , async () => {
        await Channel.close();
        await connection.close();
    })
}






