import { HttpSetup } from 'opensearch-dashboards/public';
import { ServerResponse } from '../../server/models/types';
import { API } from '../../server/utils/constants';
import {
  GetAggregationQueriesResponse,
  GetAggregatorsResponse,
  GetDocumentsResponse,
} from '../../server/models/interfaces/Ueba';

export default class UebaService {
  httpClient: HttpSetup;

  constructor(httpClient: HttpSetup) {
    this.httpClient = httpClient;
  }

  getAggregationQueries = async (
    pageSize: number = 10
  ): Promise<ServerResponse<GetAggregationQueriesResponse>> => {
    const url = `..${API.UEBA_BASE}/aggregation_queries`;
    return (await this.httpClient.get(url, {})) as ServerResponse<GetAggregationQueriesResponse>;
  };

  getAggregators = async (
    pageSize: number = 10
  ): Promise<ServerResponse<GetAggregatorsResponse>> => {
    const url = `..${API.UEBA_BASE}/aggregators`;
    return (await this.httpClient.get(url, {})) as ServerResponse<GetAggregatorsResponse>;
  };

  getDocuments = async (pageSize: number = 10): Promise<ServerResponse<GetDocumentsResponse>> => {
    const url = `..${API.UEBA_BASE}/documents`;
    return (await this.httpClient.get(url, {})) as ServerResponse<GetDocumentsResponse>;
  };
}
