import { IEmailLocals, winstonLogger } from "@nitinthakurdev/jobber-package";
import { config } from "@notifications/config";
import { emailTemplate } from "@notifications/healpers";
import { Logger } from "winston";


const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, "mailTransport", 'debug');


export const sendEmail = async (template: string, reciverEmail: string, locals: IEmailLocals):Promise<void> => {
    try {
        await emailTemplate(template,reciverEmail,locals)
        log.info("Email send successfully ");
    } catch (error) {
        log.log("error", "Notification service mailTransport sendEmail() method error: ", error);
    }
};


