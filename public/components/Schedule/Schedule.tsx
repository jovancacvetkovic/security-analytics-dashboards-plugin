/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { EuiFormRow, EuiSelect, EuiSelectOption } from '@elastic/eui';
import { Interval } from './Interval';
import { CustomCron } from './CustomCron';
import { Daily } from './Daily';
import { Monthly } from './Monthly';
import { Weekly } from './Weekly';
import { ContentPanel } from '../ContentPanel';
import FormFieldHeader from '../FormFieldHeader';
import { PeriodSchedule } from '../../../models/interfaces';

const frequencies: EuiSelectOption[] = [{ value: 'interval', text: 'By interval' }];

export interface ISchedule {
  selectedFrequency: string;
  period: PeriodSchedule;
}

export interface ScheduleProps {
  title: string;
  schedule: ISchedule;
  onScheduleChange(schedule: PeriodSchedule): void;
}

export interface ScheduleState {
  selectedFrequency: string;
}

const components: { [freq: string]: typeof React.Component } = {
  daily: Daily,
  weekly: Weekly,
  monthly: Monthly,
  cronExpression: CustomCron,
  interval: Interval,
};

export class Schedule extends React.Component<ScheduleProps, ScheduleState> {
  constructor(props: ScheduleProps) {
    super(props);
    this.state = {
      selectedFrequency: frequencies[0].value as string,
    };
  }

  onFrequencySelected = (event: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({ selectedFrequency: event.target.value });
  };

  render() {
    const FrequencyPicker = components[this.state.selectedFrequency];

    return (
      <ContentPanel title={this.props.title}>
        <EuiFormRow label={<FormFieldHeader headerTitle={'Frequency'} />}>
          <EuiSelect
            id="overview-vis-options"
            options={frequencies}
            value={this.state.selectedFrequency}
            onChange={this.onFrequencySelected}
          />
        </EuiFormRow>

        <FrequencyPicker {...this.props} />
      </ContentPanel>
    );
  }
}
