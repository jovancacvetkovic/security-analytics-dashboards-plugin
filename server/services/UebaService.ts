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
} from '../models/interfaces/Ueba';

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
      //   CLIENT_UEBA_METHODS.GET_AGGREGATORS
      // );

      const getAggregationQueriesResponse: GetAggregationQueriesResponse = {
        hits: {
          hits: [
            {
              name: 'Aggregator query I',
              description: 'This is a aggregation query description.',
              source_index: 'cypress-dns-index',
              page_size: 10,
              aggregation_script:
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
              type: 'itt',
              schedule: {},
              aggregators: ['Aggregator model itt'],
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
      // const getAggregatorsResponse: GetRulesResponse = await callWithRequest(
      //   CLIENT_UEBA_METHODS.GET_AGGREGATORS
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
}
