/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  AggregatorItem,
  AggregationQueryItem,
  DocumentItem,
  InferenceModelItem,
} from '../../../public/pages/Ueba/models/interfaces';

export interface GetAggregators {
  body: string;
}

export interface GetAggregationQueriesResponse {
  hits: {
    hits: AggregationQueryItem[];
    total: {
      value: number;
    };
    timed_out: boolean;
  };
}

export interface GetAggregatorsResponse {
  hits: {
    hits: AggregatorItem[];
    total: {
      value: number;
    };
    timed_out: boolean;
  };
}

export interface GetDocumentsResponse {
  hits: {
    hits: DocumentItem<any>[];
    total: {
      value: number;
    };
    timed_out: boolean;
  };
}

export interface GetInferenceModelsResponse {
  hits: {
    hits: InferenceModelItem[];
    total: {
      value: number;
    };
    timed_out: boolean;
  };
}
