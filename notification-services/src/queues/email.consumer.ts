import { IEmailLocals, winstonLogger } from "@nitinthakurdev/jobber-package";
import { Channel, ConsumeMessage } from "amqplib";
import { Logger } from "winston";
import { createConnection } from "@notifications/queues/Connection";
import { config } from "@notifications/config";
import { sendEmail } from "@notifications/queues/mail.transport";


const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, "NotificationEmailConsumer", 'debug');


export const consumeAuthEmailMessages = async (channel: Channel): Promise<void> => {
    try {
        if (!channel) {
            channel = await createConnection() as Channel;
        }

        const exchangeName = "email-notification";
        const routingKey = "auth-email";
        const queueName = "auth-email-queue";
        await channel.assertExchange(exchangeName, "direct");
        const notificationQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: false });
        await channel.bindQueue(notificationQueue.queue, exchangeName, routingKey);
        channel.consume(notificationQueue.queue, async (msg: ConsumeMessage | null) => {
            const { receiverEmail, username, verifyLink, resetLink, template } = JSON.parse(msg!.content.toString());
            const locals: IEmailLocals = {
                appLink: `${config.CLIENT_URL}`,
                appIcon: "https://storage.googleapis.com/microservice-media/media/Logo%20for%20Independent%20Pro.png",
                username,
                resetLink,
                verifyLink
            };

            // send emails 
            sendEmail(template, receiverEmail, locals);

            // acknowledge
            channel.ack(msg!);
        });


    } catch (error) {
        log.log("error", "NotificationServices error consumeAuthEmailMessages() method", error);

    }
}


export const consumeOrderEmailMessages = async (channel: Channel): Promise<void> => {
    try {
        if (!channel) {
            channel = await createConnection() as Channel;
        }

        const exchangeName = "order-notification";
        const routingKey = "order-email";
        const queueName = "order-email-queue";
        await channel.assertExchange(exchangeName, "direct");
        const notificationQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: false });
        await channel.bindQueue(notificationQueue.queue, exchangeName, routingKey);
        channel.consume(notificationQueue.queue, async (msg: ConsumeMessage | null) => {
            const {
                receiverEmail,
                username,
                template,
                sender,
                offerLink,
                amount,
                buyerUsername,
                sellerUsername,
                title,
                description,
                deliveryDays,
                orderId,
                orderDue,
                requirements,
                orderUrl,
                originalDate,
                newDate,
                reason,
                subject,
                header,
                type,
                message,
                serviceFee,
                total
            } = JSON.parse(msg!.content.toString());

            const locals: IEmailLocals = {
                appLink: `${config.CLIENT_URL}`,
                appIcon: 'https://storage.googleapis.com/microservice-media/media/Logo%20for%20Independent%20Pro.png',
                username,
                sender,
                offerLink,
                amount,
                buyerUsername,
                sellerUsername,
                title,
                description,
                deliveryDays,
                orderId,
                orderDue,
                requirements,
                orderUrl,
                originalDate,
                newDate,
                reason,
                subject,
                header,
                type,
                message,
                serviceFee,
                total
            };
            // send emails 
            if (template === "orderPlaced") {
                await sendEmail("orderPlaced", receiverEmail, locals);
                await sendEmail("orderReceipt", receiverEmail, locals);
            } else {
                await sendEmail(template, receiverEmail, locals);
            }

            // acknowledge
            channel.ack(msg!)
        })

    } catch (error) {
        log.log("error", "NotificationServices error consumeOrderEmailMessages() method", error);

    }
}
``




