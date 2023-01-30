/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render } from '@testing-library/react';
import props from '../../../../../models/CreateDetector/components/ConfigureAlerts/containers/ConfigureAlerts/ConfigureAlerts.mock';
import { expect } from '@jest/globals';
import ConfigureAlerts from './ConfigureAlerts';

describe('<ConfigureAlerts /> spec', () => {
  it('renders the component', () => {
    const view = render(<ConfigureAlerts {...props} />);
    expect(view).toMatchSnapshot();
  });
});
