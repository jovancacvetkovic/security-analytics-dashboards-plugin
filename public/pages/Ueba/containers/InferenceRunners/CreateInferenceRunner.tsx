import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  EuiSpacer,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormRow,
  EuiText,
  EuiFieldText,
  EuiTextArea,
  EuiButton,
  EuiTitle,
  EuiSelect,
  EuiSelectOption,
  EuiComboBox,
} from '@elastic/eui';
import { NotificationsStart } from 'opensearch-dashboards/public';
import { BrowserServices } from '../../../../models/interfaces';
import { CoreServicesContext } from '../../../../components/core_services';
import { BREADCRUMBS, ROUTES } from '../../../../utils/constants';
import * as H from 'history';
import { FormikErrors, useFormik } from 'formik';
import { AggregatorItem } from '../../models/interfaces';
import { validateDescription, validateName } from '../../../../utils/validation';
import { ContentPanel } from '../../../../components/ContentPanel';
import { FormFieldHeader } from '../../../../components/FormFieldHeader/FormFieldHeader';
import { Daily } from '../../../CreateDetector/components/DefineDetector/components/DetectorSchedule/Daily';
import { Weekly } from '../../../CreateDetector/components/DefineDetector/components/DetectorSchedule/Weekly';
import { Monthly } from '../../../CreateDetector/components/DefineDetector/components/DetectorSchedule/Monthly';
import { CustomCron } from '../../../CreateDetector/components/DefineDetector/components/DetectorSchedule/CustomCron';
import { Interval } from '../../../CreateDetector/components/DefineDetector/components/DetectorSchedule/Interval';
import { Schedule } from '../../../../components/Schedule/Schedule';
import { RunnerFieldMappings } from '../../components/RunnerFieldMappings/RunnerFieldMappings';

export interface UebaProps {
  services: BrowserServices;
  notifications?: NotificationsStart;
  history: H.History;
}

export const CreateInferenceRunner: React.FC<UebaProps> = ({ history }) => {
  const context = useContext(CoreServicesContext);

  const components: { [freq: string]: typeof React.Component } = {
    daily: Daily,
    weekly: Weekly,
    monthly: Monthly,
    cronExpression: CustomCron,
    interval: Interval,
  };

  const frequencies: EuiSelectOption[] = [{ value: 'interval', text: 'By interval' }];
  const [selectedFrequency, setSelectedFrequency] = useState<string>(frequencies[0].value);
  const [loading, setLoading] = useState<boolean>(true);
  const [modelOptions, setModelOptions] = useState<any[]>([]);

  useEffect(() => {
    context?.chrome.setBreadcrumbs([
      BREADCRUMBS.SECURITY_ANALYTICS,
      BREADCRUMBS.UEBA,
      BREADCRUMBS.UEBA_VIEW_INFERENCE_RUNNERS,
      BREADCRUMBS.UEBA_CREATE_INFERENCE_RUNNER,
    ]);
  });

  const onSubmit = async (values: AggregatorItem) => {};

  const formik = useFormik({
    validateOnMount: true,
    validateOnChange: true,
    validateOnBlur: true,
    initialValues: {
      name: '',
      description: '',
      schedule: {
        selectedFrequency: frequencies[0].value,
      },
      dataSource: '',
      queryId: '',
    },
    validate: (values) => {
      const errors: FormikErrors<AggregatorItem> = {};

      if (!values.name || !values.name.length) {
        errors.name = 'Aggregation query name is required';
      } else {
        if (!validateName(values.name)) {
          errors.name = 'Invalid aggregation query name.';
        }
      }

      if (values.description && !validateDescription(values.description)) {
        errors.description = 'Invalid description.';
      }

      if (!values.schedule.selectedFrequency) {
        errors.schedule = {
          selectedFrequency: 'Can not be empty',
        };
      }

      if (!values.dataSource) {
        errors.dataSource = 'Aggregation query is required';
      }

      if (!values.queryId) {
        errors.queryId = 'Aggregation query is required';
      }

      return errors;
    },
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(false);
      await onSubmit(values);
    },
  });

  const FrequencyPicker = components[selectedFrequency];

  const onFrequencySelected = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFrequency(event.target.value);
  };

  const onClose = useCallback(() => {
    history.replace(ROUTES.UEBA_VIEW_AGGREGATORS);
  }, [history]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <EuiTitle size={'m'}>
        <h3>Create inference runner</h3>
      </EuiTitle>

      <EuiText size="s" color="subdued">
        Any additional text about runners.
      </EuiText>
      <EuiSpacer size={'m'} />

      <ContentPanel title={'Runner details'} titleSize={'m'}>
        <EuiSpacer size={'m'} />
        <EuiFormRow
          label={<FormFieldHeader headerTitle={'Name'} />}
          isInvalid={formik.touched.name && !!formik.errors?.name}
          error={formik.errors?.name}
          helpText="Aggregation query name must contain 5-50 characters. Valid characters are a-z, A-Z, 0-9, hyphens, spaces, and underscores."
        >
          <EuiFieldText
            isInvalid={formik.touched.name && !!formik.errors.name}
            placeholder="Enter query name"
            data-test-subj={'rule_name_field'}
            name={'name'}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
          />
        </EuiFormRow>

        <EuiSpacer size={'m'} />

        <EuiFormRow
          label={<FormFieldHeader headerTitle={'Description'} optionalField={true} />}
          isInvalid={!!formik.errors?.description}
          error={formik.errors.description}
          helpText={
            'Description must contain 5-500 characters. Valid characters are a-z, A-Z, 0-9, hyphens, spaces, dots, commas, and underscores.'
          }
        >
          <EuiTextArea
            placeholder={'Enter a description for the aggregation query.'}
            compressed={true}
            name={'description'}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.description}
          />
        </EuiFormRow>
      </ContentPanel>

      <EuiSpacer size={'m'} />

      <ContentPanel title={'Inference model'} titleSize={'m'}>
        <EuiSpacer size={'m'} />
        <EuiFormRow
          label={<FormFieldHeader headerTitle={'Select an input source for the detector.'} />}
          isInvalid={formik.touched.name && !!formik.errors?.name}
          error={formik.errors?.name}
          helpText="Aggregation query name must contain 5-50 characters. Valid characters are a-z, A-Z, 0-9, hyphens, spaces, and underscores."
        >
          <EuiComboBox
            placeholder={'Select an input source for the detector.'}
            isLoading={loading}
            options={modelOptions}
            selectedOptions={[]}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            isClearable={true}
          />
        </EuiFormRow>
      </ContentPanel>

      <EuiSpacer size={'m'} />

      <ContentPanel title={'Inference model arguments mapping'} titleSize={'m'}>
        <EuiSpacer size={'m'} />
        <RunnerFieldMappings />
      </ContentPanel>

      <EuiSpacer />

      <EuiFlexGroup justifyContent="flexEnd">
        <EuiFlexItem grow={false}>
          <EuiButton onClick={onClose}>Cancel</EuiButton>
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiButton
            onClick={() => formik.handleSubmit()}
            data-test-subj={'submit_aggregation_query_form_button'}
            fill
            disabled={!formik.isValid}
          >
            {'Create runner'}
          </EuiButton>
        </EuiFlexItem>
      </EuiFlexGroup>
    </form>
  );
};
