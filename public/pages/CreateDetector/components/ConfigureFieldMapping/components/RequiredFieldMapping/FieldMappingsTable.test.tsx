/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render } from '@testing-library/react';
import { expect } from '@jest/globals';
import FieldMappingsTable from './FieldMappingsTable';
import props, {
  fieldMappingsTablePropsReadOnly,
} from '../../../../../../models/CreateDetector/components/ConfigureAlerts/components/ConfigureFieldMappings/components/RequiredFieldMapping/FieldMappingsTable.mock';

describe('<FieldMappingsTable /> spec', () => {
  it('renders the component', () => {
    const view = render(<FieldMappingsTable {...props} />);
    expect(view).toMatchSnapshot();
  });
  it('renders the readonly component', () => {
    const view = render(<FieldMappingsTable {...fieldMappingsTablePropsReadOnly} />);
    expect(view).toMatchSnapshot();
  });
});
