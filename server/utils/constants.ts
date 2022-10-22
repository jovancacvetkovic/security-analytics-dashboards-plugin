/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { SecurityAnalyticsApi } from '../models/interfaces';

export enum CLUSTER {
  ADMIN = 'admin',
  SA = 'opensearch_security_analytics',
  DATA = 'data',
}

export const BASE_API_PATH = '/_plugins/_security_analytics';

export const API: SecurityAnalyticsApi = {
  DETECTORS_BASE: `${BASE_API_PATH}/detectors`,
  SEARCH_DETECTORS: `${BASE_API_PATH}/detectors/_search`,
  INDICES_BASE: `${BASE_API_PATH}/indices`,
  GET_FINDINGS: `${BASE_API_PATH}/findings/_search`,
  DOCUMENT_IDS_QUERY: `${BASE_API_PATH}/document_ids_query`,
  TIME_RANGE_QUERY: `${BASE_API_PATH}/time_range_query`,
  MAPPINGS_BASE: `${BASE_API_PATH}/mappings`,
  MAPPINGS_VIEW: `${BASE_API_PATH}/mappings/view`,
  GET_ALERTS: `${BASE_API_PATH}/alerts`,
};

/**
 * Property with below name is added to the prototype of Opensearch client during setup.
 * @see ../clusters/securityAnalytics/securityAnalyticsPlugin
 */
export const PLUGIN_PROPERTY_NAME: string = 'securityAnalytics';

export const METHOD_NAMES = {
  // Detector methods
  CREATE_DETECTOR: 'createDetector',
  DELETE_DETECTOR: 'deleteDetector',
  GET_DETECTOR: 'getDetector',
  SEARCH_DETECTORS: 'searchDetectors',
  UPDATE_DETECTOR: 'updateDetector',

  // Finding methods
  GET_FINDINGS: 'getFindings',

  // Field mapping methods
  GET_MAPPINGS_VIEW: 'getFieldMappingsView',
  CREATE_MAPPINGS: 'createMappings',
  GET_MAPPINGS: 'getMappings',

  // Alerts methods
  GET_ALERTS: 'getAlerts',
};

/**
 * These methods are defined on the Opensearch client instance by adding them to the client's
 * prototype under the @see PLUGIN_PROPERTY_NAME field.
 * @see ../clusters/securityAnalytics/securityAnalyticsPlugin
 */
export const CLIENT_DETECTOR_METHODS = {
  CREATE_DETECTOR: `${PLUGIN_PROPERTY_NAME}.${METHOD_NAMES.CREATE_DETECTOR}`,
  DELETE_DETECTOR: `${PLUGIN_PROPERTY_NAME}.${METHOD_NAMES.DELETE_DETECTOR}`,
  GET_DETECTOR: `${PLUGIN_PROPERTY_NAME}.${METHOD_NAMES.GET_DETECTOR}`,
  SEARCH_DETECTORS: `${PLUGIN_PROPERTY_NAME}.${METHOD_NAMES.SEARCH_DETECTORS}`,
  UPDATE_DETECTOR: `${PLUGIN_PROPERTY_NAME}.${METHOD_NAMES.UPDATE_DETECTOR}`,
  GET_FINDINGS: `${PLUGIN_PROPERTY_NAME}.${METHOD_NAMES.GET_FINDINGS}`,
};

export const CLIENT_FIELD_MAPPINGS_METHODS = {
  GET_MAPPINGS_VIEW: `${PLUGIN_PROPERTY_NAME}.${METHOD_NAMES.GET_MAPPINGS_VIEW}`,
  CREATE_MAPPINGS: `${PLUGIN_PROPERTY_NAME}.${METHOD_NAMES.CREATE_MAPPINGS}`,
  GET_MAPPINGS: `${PLUGIN_PROPERTY_NAME}.${METHOD_NAMES.GET_MAPPINGS}`,
};

export const CLIENT_ALERTS_METHODS = {
  GET_ALERTS: `${PLUGIN_PROPERTY_NAME}.${METHOD_NAMES.GET_ALERTS}`,
};