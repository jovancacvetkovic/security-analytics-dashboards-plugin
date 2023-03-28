/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  EuiFieldNumber,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormRow,
  EuiSelect,
  EuiSelectOption,
} from '@elastic/eui';
import React from 'react';
import { ISchedule, Schedule } from './Schedule';
import FormFieldHeader from '../FormFieldHeader';

export interface IntervalProps {
  schedule: ISchedule;
  onScheduleChange(schedule: Schedule): void;
}

export interface IntervalState {
  isIntervalValid: boolean;
}

const unitOptions: EuiSelectOption[] = [
  { value: 'MINUTES', text: 'Minutes' },
  { value: 'HOURS', text: 'Hours' },
  { value: 'DAYS', text: 'Days' },
];

export class Interval extends React.Component<IntervalProps, IntervalState> {
  state = {
    isIntervalValid: true,
  };

  onTimeIntervalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      isIntervalValid: !!event.target.value,
    });
    this.props.onScheduleChange({
      period: {
        ...this.props.schedule?.period,
        interval: parseInt(event.target.value),
      },
    });
  };

  onUnitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    this.props.onScheduleChange({
      period: {
        ...this.props.schedule?.period,
        unit: event.target.value,
      },
    });
  };

  render() {
    const { isIntervalValid } = this.state;
    const {
      period = {
        interval: 30,
      },
    } = this.props.schedule;
    return (
      <EuiFormRow
        label={<FormFieldHeader headerTitle={'Run every'} />}
        isInvalid={!isIntervalValid}
        error={'Enter schedule interval.'}
      >
        <EuiFlexGroup>
          <EuiFlexItem>
            <EuiFieldNumber
              min={1}
              icon={'clock'}
              value={period.interval}
              onChange={this.onTimeIntervalChange}
              data-test-subj={'schedule-number-select'}
              required={true}
              isInvalid={!isIntervalValid}
            />
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiSelect
              options={unitOptions}
              onChange={this.onUnitChange}
              value={period.unit}
              data-test-subj={'schedule-unit-select'}
            />
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiFormRow>
    );
  }
}
