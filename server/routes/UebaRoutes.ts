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
      path: `${API.UEBA_BASE}/aggregator`,
      validate: {},
    },
    uebaServices.getAggregators
  );

  router.get(
    {
      path: `${API.UEBA_BASE}/inference`,
      validate: {},
    },
    uebaServices.getInferences
  );
}
