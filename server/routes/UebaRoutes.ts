/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { IRouter } from 'opensearch-dashboards/server';
import { NodeServices } from '../models/interfaces';
import { API } from '../utils/constants';

export function setupUebaRoutes(services: NodeServices, router: IRouter) {
  const { uebaServices } = services;

  router.get(
    {
      path: `${API.UEBA_BASE}/aggregators`,
      validate: {},
    },
    uebaServices.getAggregators
  );

  router.get(
    {
      path: `${API.UEBA_BASE}/aggregation_queries`,
      validate: {},
    },
    uebaServices.getAggregationQueries
  );

  router.get(
    {
      path: `${API.UEBA_BASE}/documents`,
      validate: {},
    },
    uebaServices.getDocuments
  );
  router.get(
    {
      path: `${API.UEBA_BASE}/inference_models`,
      validate: {},
    },
    uebaServices.getInferenceModels
  );
}
