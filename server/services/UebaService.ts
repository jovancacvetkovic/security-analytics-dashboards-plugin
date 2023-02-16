/*
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
import { GetAggregatorsResponse, GetInferencesResponse } from '../models/interfaces/Ueba';

export default class UebaService {
  osDriver: ILegacyCustomClusterClient;

  constructor(osDriver: ILegacyCustomClusterClient) {
    this.osDriver = osDriver;
  }

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
              name: 'Aggregator 1',
              description: 'Any text can go here.',
              source_index: 'cypress-dns-index',
              page_size: 10,
              aggregator_script: 'Not implemented',
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

  getInferences = async (
    _context: RequestHandlerContext,
    request: OpenSearchDashboardsRequest<{}>,
    response: OpenSearchDashboardsResponseFactory
  ): Promise<
    IOpenSearchDashboardsResponse<ServerResponse<GetInferencesResponse> | ResponseError>
  > => {
    try {
      // const { callAsCurrentUser: callWithRequest } = this.osDriver.asScoped(request);
      // const getAggregatorsResponse: GetRulesResponse = await callWithRequest(
      //   CLIENT_UEBA_METHODS.GET_AGGREGATORS
      // );

      const getInferencesResponse: GetInferencesResponse = {
        hits: {
          hits: [
            {
              name: 'Inference model I',
              description: 'Any text can go here.',
              type: 'itt',
              schedule: {},
              aggregators: ['Aggregator 1'],
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
}
