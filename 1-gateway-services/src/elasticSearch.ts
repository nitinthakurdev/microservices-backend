import { winstonLogger } from "@nitinthakurdev/jobber-package";
import { Logger } from "winston";
import { config } from "@gateway/config";
import { Client } from "@elastic/elasticsearch";
import { ClusterHealthResponse } from "@elastic/elasticsearch/lib/api/types";


const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, "GatewayElasticConnection", "debug");


class ElsaticSearch {
    private ElasticSearchClient: Client;
    constructor() {
        this.ElasticSearchClient = new Client({
            node:`${config.ELASTIC_SEARCH_URL}`
        })
    };

    public async CheckElasticConnection():Promise<void> {
        let isConnected = false;
        do{
            try {
                const health:ClusterHealthResponse = await this.ElasticSearchClient.cluster.health({});
                log.info(`gatewayService Elastic search status - ${health.status}`);
                isConnected = true;
            } catch (error) {
                log.error("connection to elastic search failed, Retrying....");
                log.log('error',"GatewayService CheckElasticConnection() method error: ",error)
            }
        }while(!isConnected);
    }
}

export const elasticSearch: ElsaticSearch = new ElsaticSearch();





