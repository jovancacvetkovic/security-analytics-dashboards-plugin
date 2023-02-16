/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { EuiBasicTableColumn } from '@elastic/eui';
import { AlertItem, DetectorItem, FindingItem } from './interfaces';
import { AggregatorItem, InferenceItem } from '../../Ueba/models/interfaces';
import { DocumentsItem } from '../../Ueba/containers/Ueba/Ueba';

export type TableWidgetItem =
  | FindingItem
  | AlertItem
  | DetectorItem
  | AggregatorItem
  | DocumentsItem
  | InferenceItem;

export type TableWidgetProps<T extends TableWidgetItem> = {
  columns: EuiBasicTableColumn<T>[];
  items: T[];
  loading?: boolean;
  search?: any;
};
