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
  EuiCodeBlock,
  EuiSpacer,
} from '@elastic/eui';
import React from 'react';
import { AggregatorItem } from '../../models/interfaces';

export interface AggregatorFlyoutProps {
  aggregator: AggregatorItem;
  hideFlyout: () => void;
}

export const AggregationQueryFlyout: React.FC<AggregatorFlyoutProps> = ({
  aggregator,
  hideFlyout,
}) => {
  return (
    <EuiFlyout
      onClose={hideFlyout}
      ownFocus={true}
      hideCloseButton
      size={'m'}
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
            <EuiFormLabel>Source index</EuiFormLabel>
            <EuiText data-test-subj={'aggregator_flyout_source_index'}>
              {aggregator.source_index}
            </EuiText>
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
            <EuiFormLabel>Page size</EuiFormLabel>
            <EuiText data-test-subj={'aggregator_flyout_page_size'}>{aggregator.page_size}</EuiText>
          </EuiFlexItem>
        </EuiFlexGroup>

        <EuiSpacer />

        <EuiFlexGroup justifyContent="flexEnd">
          <EuiFlexItem>
            <EuiFormLabel>Aggregator script</EuiFormLabel>
            <EuiCodeBlock language="yaml" data-test-subj={'aggregator_flyout_script'}>
              {aggregator.aggregator_script}
            </EuiCodeBlock>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiFlyoutBody>
    </EuiFlyout>
  );
};
