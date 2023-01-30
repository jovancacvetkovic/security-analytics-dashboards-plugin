/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { MappingViewType } from '../../../../../../../../pages/CreateDetector/components/ConfigureFieldMapping/components/RequiredFieldMapping/FieldMappingsTable';

const fieldMappingsTableProps = {
  loading: false,
  indexFields: ['mockField'],
  ruleFields: ['mockRuleField'],
};
export default {
  ...fieldMappingsTableProps,
  mappingProps: [
    {
      type: MappingViewType.Edit,
    },
  ],
};

export const fieldMappingsTablePropsReadOnly = {
  ...fieldMappingsTableProps,
  mappingProps: [
    {
      type: MappingViewType.Readonly,
    },
  ],
};
