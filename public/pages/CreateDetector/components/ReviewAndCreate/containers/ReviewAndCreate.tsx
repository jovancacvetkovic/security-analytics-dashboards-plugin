/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { EuiSpacer, EuiTitle } from '@elastic/eui';
import { DetectorDetailsView } from '../../../../Detectors/containers/DetectorDetailsView/DetectorDetailsView';
import { FieldMappingsView } from '../../../../Detectors/components/FieldMappingsView/FieldMappingsView';
import { AlertTriggersView } from '../../../../Detectors/containers/AlertTriggersView/AlertTriggersView';
import { RouteComponentProps } from 'react-router-dom';
import { FieldMapping } from '../../../../../../models/interfaces';
import { DetectorCreationStep } from '../../../models/types';
import { NotificationsStart } from 'opensearch-dashboards/public';
import { Detector } from '../../../../../../types';

export interface ReviewAndCreateProps extends RouteComponentProps {
  detector: Detector;
  existingMappings: FieldMapping[];
  notifications: NotificationsStart;
  setDetectorCreationStep: (step: DetectorCreationStep) => void;
}

export interface ReviewAndCreateState {}

export class ReviewAndCreate extends React.Component<ReviewAndCreateProps, ReviewAndCreateState> {
  setDefineDetectorStep = () => {
    this.props.setDetectorCreationStep(DetectorCreationStep.DEFINE_DETECTOR);
  };

  setConfigureFieldMappingStep = () => {
    this.props.setDetectorCreationStep(DetectorCreationStep.DEFINE_DETECTOR);
  };

  setConfigureAlertsStep = () => {
    this.props.setDetectorCreationStep(DetectorCreationStep.CONFIGURE_ALERTS);
  };

  render() {
    return (
      <div>
        <EuiTitle size={'m'}>
          <h3>Review and create</h3>
        </EuiTitle>

        <EuiSpacer size={'m'} />

        <DetectorDetailsView
          {...this.props}
          detector={this.props.detector}
          rulesCanFold={true}
          editBasicDetails={this.setDefineDetectorStep}
          editDetectorRules={this.setDefineDetectorStep}
        />
        <EuiSpacer size="l" />
        <FieldMappingsView
          {...this.props}
          detector={this.props.detector}
          existingMappings={this.props.existingMappings}
          editFieldMappings={this.setConfigureFieldMappingStep}
        />
        <EuiSpacer size="l" />
        <AlertTriggersView
          {...this.props}
          notifications={this.props.notifications}
          detector={this.props.detector}
          editAlertTriggers={this.setConfigureAlertsStep}
        />
      </div>
    );
  }
}
