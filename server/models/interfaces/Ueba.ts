/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  AggregatorItem,
  DocumentItem,
  InferenceItem,
} from '../../../public/pages/Ueba/models/interfaces';

export interface GetAggregators {
  body: string;
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

export interface GetInferences {
  body: string;
}
export interface GetInferencesResponse {
  hits: {
    hits: InferenceItem[];
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
