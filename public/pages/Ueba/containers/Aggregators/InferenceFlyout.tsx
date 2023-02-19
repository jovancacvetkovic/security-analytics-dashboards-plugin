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
import { InferenceItem } from '../../models/interfaces';

export interface InferenceFlyoutProps {
  inference: InferenceItem;
  hideFlyout: () => void;
}

export const InferenceFlyout: React.FC<InferenceFlyoutProps> = ({ inference, hideFlyout }) => {
  return (
    <EuiFlyout
      onClose={hideFlyout}
      ownFocus={true}
      hideCloseButton
      size={'s'}
      data-test-subj={`inference_flyout_${inference.name}`}
    >
      <EuiFlyoutHeader hasBorder={true}>
        <EuiFlexGroup alignItems="center">
          <EuiFlexItem>
            <EuiTitle size="m">
              <h3>Inference details</h3>
            </EuiTitle>
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiButtonIcon
              aria-label="close"
              iconType="cross"
              display="empty"
              iconSize="m"
              onClick={() => hideFlyout()}
              data-test-subj={`close-inference-details-flyout`}
            />
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiFlyoutHeader>
      <EuiFlyoutBody>
        <EuiFlexGroup justifyContent="flexEnd">
          <EuiFlexItem>
            <EuiFormLabel>Inference name</EuiFormLabel>
            <EuiText data-test-subj={'inference_flyout_name'}>{inference.name}</EuiText>
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiFormLabel>Inference type</EuiFormLabel>
            <EuiText data-test-subj={'inference_flyout_type'}>{inference.type}</EuiText>
          </EuiFlexItem>
        </EuiFlexGroup>

        <EuiFlexGroup justifyContent="flexEnd">
          <EuiFlexItem>
            <EuiFormLabel>Description</EuiFormLabel>
            <EuiText data-test-subj={'inference_flyout_description'}>
              {inference.description}
            </EuiText>
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiFormLabel>Schedule</EuiFormLabel>
            <EuiText data-test-subj={'inference_flyout_schedule'}>
              {JSON.stringify(inference.schedule)}
            </EuiText>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiFlyoutBody>
    </EuiFlyout>
  );
};
