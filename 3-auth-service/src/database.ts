import { winstonLogger } from "@nitinthakurdev/jobber-package";
import { Logger } from "winston";
import { config } from "@auth/config";
import { Sequelize } from "sequelize";


const log:Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`,"AuthService-Database-connection",'debug');


export const sequlizedConnection:Sequelize = new Sequelize(config.MYSQL_DB!,{
    dialect:"mysql",
    logging:false,
    dialectOptions:{
        multipleStatements:true,
    }
});


export const  dbConnection = async ():Promise<void> => {
    try {
        await sequlizedConnection.authenticate();
        log.info("Auth service connect to database Successfully.")
    } catch (error) {
        log.error('Auth service is unable to connect database');
        log.log("error","authService dbConnection() method error",error)
    }
}