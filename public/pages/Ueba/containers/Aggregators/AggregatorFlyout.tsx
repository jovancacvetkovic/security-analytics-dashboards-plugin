/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiFlyout,
  EuiFlyoutBody,
  EuiFlyoutHeader,
  EuiTitle,
  EuiButtonIcon,
  EuiFormLabel,
  EuiText,
} from '@elastic/eui';
import React from 'react';
import { AggregatorItem } from '../../models/interfaces';

export interface AggregatorFlyoutProps {
  aggregator: AggregatorItem;
  hideFlyout: () => void;
}

export const AggregatorFlyout: React.FC<AggregatorFlyoutProps> = ({ aggregator, hideFlyout }) => {
  return (
    <EuiFlyout
      onClose={hideFlyout}
      ownFocus={true}
      hideCloseButton
      size={'s'}
      data-test-subj={`aggregator_flyout_${aggregator.name}`}
    >
      <EuiFlyoutHeader hasBorder={true}>
        <EuiFlexGroup alignItems="center">
          <EuiFlexItem>
            <EuiTitle size="m">
              <h3>Aggregator details</h3>
            </EuiTitle>
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiButtonIcon
              aria-label="close"
              iconType="cross"
              display="empty"
              iconSize="m"
              onClick={() => hideFlyout()}
              data-test-subj={`close-aggregator-details-flyout`}
            />
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiFlyoutHeader>
      <EuiFlyoutBody>
        <EuiFlexGroup justifyContent="flexEnd">
          <EuiFlexItem>
            <EuiFormLabel>Aggregator name</EuiFormLabel>
            <EuiText data-test-subj={'aggregator_flyout_name'}>{aggregator.name}</EuiText>
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiFormLabel>Aggregator type</EuiFormLabel>
            <EuiText data-test-subj={'aggregator_flyout_type'}>{aggregator.type}</EuiText>
          </EuiFlexItem>
        </EuiFlexGroup>

        <EuiFlexGroup justifyContent="flexEnd">
          <EuiFlexItem>
            <EuiFormLabel>Description</EuiFormLabel>
            <EuiText data-test-subj={'aggregator_flyout_description'}>
              {aggregator.description}
            </EuiText>
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiFormLabel>Schedule</EuiFormLabel>
            <EuiText data-test-subj={'aggregator_flyout_schedule'}>
              {JSON.stringify(aggregator.schedule)}
            </EuiText>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiFlyoutBody>
    </EuiFlyout>
  );
};
