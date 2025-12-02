import {  ApiResponse, Client } from '@elastic/elasticsearch';
import { winstonLogger } from '@nitinthakurdev/jobber-package';
import { config } from '@notifications/config';
import { Logger } from 'winston';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationElasticSearchServer', 'debug');

const elasticSearchClient = new Client({
  node: `${config.ELASTIC_SEARCH_URL}`
});

export async function checkElasticSearchConnection(): Promise<void> {
  let isConnected = false;
  do {
    try {
      const response:ApiResponse = await elasticSearchClient.cluster.health({});
      const health = response.body;
      log.info(`NotificationService Elasticsearch health status - ${health.status}`);
      isConnected = true;
    } catch (error) {
      log.error('Connection to Elasticsearch failed. Retrying...');
      log.log('error', 'NotificationService checkConnection() method:', error);
    }
  } while (!isConnected)
}