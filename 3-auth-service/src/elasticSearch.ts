import { Client } from '@elastic/elasticsearch';
import { winstonLogger } from '@nitinthakurdev/jobber-package';
import { Logger } from 'winston';
import { ClusterHealthResponse } from '@elastic/elasticsearch/lib/api/types';

// local imports
import { config } from '@auth/config';


// -------------------------- here is all constant data ----------------------------------------
const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'AuthService-elasticSearch-connection', 'debug');


// --------------------------------- here is create elasticSearchClient here -------------------------- 
export const elasticSearchClient = new Client({
  node: `${config.ELASTIC_SEARCH_URL}`
});


// ------------------------------- here is check connection to check elsaticSearchConnection ----------------------------
export async function checkElasticSearchConnection(): Promise<void> {
  let isConnected = false;
  do {
    try {
      const health:ClusterHealthResponse = await elasticSearchClient.cluster.health({});
      log.info(`AuthService Elasticsearch health status - ${health.status}`);
      isConnected = true;
    } catch (error) {
      log.error('Connection to Elasticsearch failed. Retrying...');
      log.log('error', 'AuthService checkConnection() method:', error);
    }
  } while (!isConnected)
}