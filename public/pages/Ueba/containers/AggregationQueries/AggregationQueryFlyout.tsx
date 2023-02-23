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
import { AggregationQueryItem } from '../../models/interfaces';

export interface AggregationQueryFlyoutProps {
  aggregationQuery: AggregationQueryItem;
  hideFlyout: () => void;
}

export const AggregationQueryFlyout: React.FC<AggregationQueryFlyoutProps> = ({
  aggregationQuery,
  hideFlyout,
}) => {
  return (
    <EuiFlyout
      onClose={hideFlyout}
      ownFocus={true}
      hideCloseButton
      size={'m'}
      data-test-subj={`aggregationQuery_flyout_${aggregationQuery.name}`}
    >
      <EuiFlyoutHeader hasBorder={true}>
        <EuiFlexGroup alignItems="center">
          <EuiFlexItem>
            <EuiTitle size="m">
              <h3>Aggregation query details</h3>
            </EuiTitle>
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiButtonIcon
              aria-label="close"
              iconType="cross"
              display="empty"
              iconSize="m"
              onClick={() => hideFlyout()}
              data-test-subj={`close-aggregationQuery-details-flyout`}
            />
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiFlyoutHeader>
      <EuiFlyoutBody>
        <EuiFlexGroup justifyContent="flexEnd">
          <EuiFlexItem>
            <EuiFormLabel>Aggregation query name</EuiFormLabel>
            <EuiText data-test-subj={'aggregationQuery_flyout_name'}>
              {aggregationQuery.name}
            </EuiText>
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiFormLabel>Source index</EuiFormLabel>
            <EuiText data-test-subj={'aggregationQuery_flyout_source_index'}>
              {aggregationQuery.source_index}
            </EuiText>
          </EuiFlexItem>
        </EuiFlexGroup>

        <EuiFlexGroup justifyContent="flexEnd">
          <EuiFlexItem>
            <EuiFormLabel>Description</EuiFormLabel>
            <EuiText data-test-subj={'aggregationQuery_flyout_description'}>
              {aggregationQuery.description}
            </EuiText>
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiFormLabel>Page size</EuiFormLabel>
            <EuiText data-test-subj={'aggregationQuery_flyout_page_size'}>
              {aggregationQuery.page_size}
            </EuiText>
          </EuiFlexItem>
        </EuiFlexGroup>

        <EuiSpacer />

        <EuiFlexGroup justifyContent="flexEnd">
          <EuiFlexItem>
            <EuiFormLabel>aggregationQuery script</EuiFormLabel>
            <EuiCodeBlock language="yaml" data-test-subj={'aggregationQuery_flyout_script'}>
              {aggregationQuery.aggregation_script}
            </EuiCodeBlock>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiFlyoutBody>
    </EuiFlyout>
  );
};
