/*  GetInferencesResponse,

 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  OpenSearchDashboardsRequest,
  OpenSearchDashboardsResponseFactory,
  IOpenSearchDashboardsResponse,
  ResponseError,
  RequestHandlerContext,
  ILegacyCustomClusterClient,
} from 'opensearch-dashboards/server';
import { ServerResponse } from '../models/types';
import {
  GetAggregationQueriesResponse,
  GetAggregatorsResponse,
  GetDocumentsResponse,
  GetInferenceModelsResponse,
} from '../models/interfaces/Ueba';
import { v4 as uuidv4 } from 'uuid';

export default class UebaService {
  osDriver: ILegacyCustomClusterClient;

  constructor(osDriver: ILegacyCustomClusterClient) {
    this.osDriver = osDriver;
  }

  getAggregationQueries = async (
    _context: RequestHandlerContext,
    request: OpenSearchDashboardsRequest<{}>,
    response: OpenSearchDashboardsResponseFactory
  ): Promise<
    IOpenSearchDashboardsResponse<ServerResponse<GetAggregationQueriesResponse> | ResponseError>
  > => {
    try {
      // const { callAsCurrentUser: callWithRequest } = this.osDriver.asScoped(request);
      // const getAggregationQueriesResponse: GetRulesResponse = await callWithRequest(
      //   CLIENT_UEBA_METHODS.GET_AGGREGATION_QUERIES
      // );

      const getAggregationQueriesResponse: GetAggregationQueriesResponse = {
        hits: {
          hits: [
            {
              name: 'Aggregator query I',
              description: 'This is a aggregation query description.',
              query:
                '{\n' +
                '  "query": {\n' +
                '    "match_all": {}\n' +
                '  },\n' +
                '  "size": 0,\n' +
                '  "aggs": {\n' +
                '    "itt": {\n' +
                '      "composite": {\n' +
                '        "size": 2,\n' +
                '        "sources": [\n' +
                '          { "user_id": { "terms": { "field": "winlog.event_data.TargetUserSid.keyword" } } }\n' +
                '        ]\n' +
                '      },\n' +
                '      "aggregations": {\n' +
                '        "ip_list": {\n' +
                '          "scripted_metric": {\n' +
                '            "init_script": "state[\'ips\'] = new ArrayList()",\n' +
                "            \"map_script\": \"state['ip'] = doc['winlog.event_data.IpAddress.keyword']; state.ips.add(state['ip'].value)\",\n" +
                '            "combine_script": "List combined = new ArrayList(); for (ip in state.ips) combined.add(ip); return combined",\n' +
                '            "reduce_script": "List final = new ArrayList(); for (ip_list in states) final.addAll(ip_list); return final.stream().distinct().sorted().collect(Collectors.toList());"\n' +
                '          }\n' +
                '        }\n' +
                '      }\n' +
                '    }\n' +
                '  }\n' +
                '}',
            },
          ],
          total: {
            value: 1,
          },
          timed_out: false,
        },
      };

      return response.custom({
        statusCode: 200,
        body: {
          ok: true,
          response: getAggregationQueriesResponse,
        },
      });
    } catch (error: any) {
      console.error('Security Analytics - UebaServices - getAggregationQueries:', error);
      return response.custom({
        statusCode: 200,
        body: {
          ok: false,
          error: error.message,
        },
      });
    }
  };

  getAggregators = async (
    _context: RequestHandlerContext,
    request: OpenSearchDashboardsRequest<{}>,
    response: OpenSearchDashboardsResponseFactory
  ): Promise<
    IOpenSearchDashboardsResponse<ServerResponse<GetAggregatorsResponse> | ResponseError>
  > => {
    try {
      // const { callAsCurrentUser: callWithRequest } = this.osDriver.asScoped(request);
      // const getAggregatorsResponse: GetRulesResponse = await callWithRequest(
      //   CLIENT_UEBA_METHODS.GET_AGGREGATORS
      // );

      const getAggregatorsResponse: GetAggregatorsResponse = {
        hits: {
          hits: [
            {
              name: 'Aggregator I',
              description: 'Any text can go here.',
              schedule: {
                selectedFrequency: '',
              },
              queryId: `query_id_${uuidv4()}`,
            },
          ],
          total: {
            value: 1,
          },
          timed_out: false,
        },
      };

      return response.custom({
        statusCode: 200,
        body: {
          ok: true,
          response: getAggregatorsResponse,
        },
      });
    } catch (error: any) {
      console.error('Security Analytics - UebaServices - getAggregators:', error);
      return response.custom({
        statusCode: 200,
        body: {
          ok: false,
          error: error.message,
        },
      });
    }
  };

  getDocuments = async (
    _context: RequestHandlerContext,
    request: OpenSearchDashboardsRequest<{}>,
    response: OpenSearchDashboardsResponseFactory
  ): Promise<
    IOpenSearchDashboardsResponse<ServerResponse<GetDocumentsResponse> | ResponseError>
  > => {
    try {
      // const { callAsCurrentUser: callWithRequest } = this.osDriver.asScoped(request);
      // const getInferencesResponse: GetDocumentsResponse = await callWithRequest(
      //   CLIENT_UEBA_METHODS.GET_DOCUMENTS
      // );

      const getInferencesResponse: GetDocumentsResponse = {
        hits: {
          hits: [
            {
              id: 'J34hj9aKJr353L6',
              name: 'DNS_doc_01',
              inference_model: 'itt',
              itt_inference: { score: 0.8 },
              itt: {
                ip_list: ['46.235.97.26'],
              },
            },
            {
              id: 'J34hj9aKJr453L6',
              name: 'DNS_doc_02',
              inference_model: 'itt',
              itt_inference: { score: 0.4 },
              itt: {
                ip_list: ['46.235.97.26'],
              },
            },
          ],
          total: {
            value: 1,
          },
          timed_out: false,
        },
      };

      return response.custom({
        statusCode: 200,
        body: {
          ok: true,
          response: getInferencesResponse,
        },
      });
    } catch (error: any) {
      console.error('Security Analytics - UebaServices - getDocuments:', error);
      return response.custom({
        statusCode: 200,
        body: {
          ok: false,
          error: error.message,
        },
      });
    }
  };

  getInferenceModels = async (
    _context: RequestHandlerContext,
    request: OpenSearchDashboardsRequest<{}>,
    response: OpenSearchDashboardsResponseFactory
  ): Promise<
    IOpenSearchDashboardsResponse<ServerResponse<GetInferenceModelsResponse> | ResponseError>
  > => {
    try {
      // const { callAsCurrentUser: callWithRequest } = this.osDriver.asScoped(request);
      // const getInferenceModelsResponse: GetInferenceModelsResponse = await callWithRequest(
      //   CLIENT_UEBA_METHODS.GET_INFERENCE_MODELS
      // );

      const getInferenceModelsResponse: GetInferenceModelsResponse = {
        hits: {
          hits: [
            {
              id: `inference_model_id_${uuidv4()}`,
              description: 'description for ITT_1',
              type: 'itt',
              name: 'ITT_1',
              args: [],
            },
            {
              id: `inference_model_id_${uuidv4()}`,
              description: 'description ITT_2',
              name: 'ITT_2',
              type: 'itt',
              args: [],
            },
          ],
          total: {
            value: 2,
          },
          timed_out: false,
        },
      };

      return response.custom({
        statusCode: 200,
        body: {
          ok: true,
          response: getInferenceModelsResponse,
        },
      });
    } catch (error: any) {
      console.error('Security Analytics - UebaServices - getInferenceModels:', error);
      return response.custom({
        statusCode: 200,
        body: {
          ok: false,
          error: error.message,
        },
      });
    }
  };
}
