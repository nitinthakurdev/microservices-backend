import { winstonLogger } from "@nitinthakurdev/jobber-package";
import { Logger } from "winston";
import {config} from "@auth/config"
import { Channel } from "amqplib";
import { createConnection } from "@auth/queues/Connection";

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, "AuthQueueProducer", 'debug');

export async function publicDirectMessage (channel:Channel,exchangeName:string,routingKey:string,message:string,logMessage:string):Promise<void> {
try {
    if(!channel){
        channel = await createConnection() as Channel;
    }
    await channel.assertExchange(exchangeName,'direct');
    channel.publish(exchangeName,routingKey,Buffer.from(message));
    log.info(logMessage)
} catch (error) {
    log.error("error","AuthService provider publicDirectMessage() method error : ",error)
}
}
