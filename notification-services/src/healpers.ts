import { IEmailLocals, winstonLogger } from "@nitinthakurdev/jobber-package";
import { config } from "./config";
import { Logger } from "winston";
import nodemailer, { Transporter } from "nodemailer";
import Email from "email-templates";
import path from "path";


const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, "NotificationEmailConsumer", 'debug');



const emailTemplate = async (template: string, reciverEmail: string, locals: IEmailLocals): Promise<void> => {
    try {
        const transporter:Transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: config.SENDER_EMAIL,
                pass: config.SENDER_EMAIL_PASS
            }
        });

        const email:Email = new Email({
            message:{
                from:`freelance <${config.SENDER_EMAIL}>`
            },
            send:true,
            preview:false,
            transport:transporter,
            views:{
                options:{
                    extension:"ejs"
                }
            },
            juice:true,
            juiceResources:{
                preserveImportant:true,
                webResources:{
                    relativeTo:path.join(__dirname,'../build')
                }
            }
        });
        await email.send({
            template:path.join(__dirname,'..','src/emails',template),
            message:{to:reciverEmail},
            locals,
        });
    } catch (error) {
        log.error(error);
    }
};


export {emailTemplate};




