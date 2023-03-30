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
  EuiComboBox,
} from '@elastic/eui';
import { NotificationsStart } from 'opensearch-dashboards/public';
import { BrowserServices } from '../../../../models/interfaces';
import { CoreServicesContext } from '../../../../components/core_services';
import { BREADCRUMBS, ROUTES } from '../../../../utils/constants';
import * as H from 'history';
import { FormikErrors, useFormik } from 'formik';
import { InferenceModelItem } from '../../models/interfaces';
import { validateDescription, validateName } from '../../../../utils/validation';
import { ContentPanel } from '../../../../components/ContentPanel';
import { FormFieldHeader } from '../../../../components/FormFieldHeader/FormFieldHeader';
import { RunnerFieldMappings } from '../../components/RunnerFieldMappings/RunnerFieldMappings';
import { DataStore } from '../../../../store/DataStore';

export interface UebaProps {
  services: BrowserServices;
  notifications?: NotificationsStart;
  history: H.History;
}

interface IInferenceModelSubmitProps {
  name: string;
  description: string;
  inferenceModelId: string;
}

export const CreateInferenceRunner: React.FC<UebaProps> = ({ history }) => {
  const context = useContext(CoreServicesContext);

  const [loading, setLoading] = useState<boolean>(true);
  const [modelOptions, setModelOptions] = useState<any[]>([]);
  const [selectedModels, setSelectedModels] = useState<any[]>([]);

  useEffect(() => {
    context?.chrome.setBreadcrumbs([
      BREADCRUMBS.SECURITY_ANALYTICS,
      BREADCRUMBS.UEBA,
      BREADCRUMBS.UEBA_VIEW_INFERENCE_RUNNERS,
      BREADCRUMBS.UEBA_CREATE_INFERENCE_RUNNER,
    ]);
  });

  const getInferenceModels = async () => {
    const models = await DataStore.ueba.getInferenceModels();
    setModelOptions(
      models.map((hit: InferenceModelItem) => ({
        value: hit.id,
        label: hit.name,
        description: hit.description,
      }))
    );

    setSelectedModels(modelOptions.length ? modelOptions[0] : []);
  };

  useEffect(() => {
    getInferenceModels();
    setLoading(false);
  }, [setModelOptions]);

  const onSubmit = async (values: IInferenceModelSubmitProps) => {};

  const formik = useFormik({
    validateOnMount: true,
    validateOnChange: true,
    validateOnBlur: true,
    initialValues: {
      name: '',
      description: '',
      inferenceModelId: '',
    },
    validate: (values) => {
      const errors: FormikErrors<IInferenceModelSubmitProps> = {};

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

      if (!values.inferenceModelId) {
        errors.inferenceModelId = 'Inference model is required';
      } else {
        setSelectedModels([values.inferenceModelId]);
      }

      return errors;
    },
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(false);
      await onSubmit(values);
    },
  });

  const onClose = useCallback(() => {
    history.replace(ROUTES.UEBA_VIEW_INFERENCE_RUNNERS);
  }, [history]);

  const renderModelOption = (option) => {
    const { label, description } = option;
    debugger;
    return (
      <EuiText size="xs">
        <dl>
          <dt>{label}</dt>
          <dd>{description}</dd>
        </dl>
      </EuiText>
    );
  };

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
          helpText="Runner name must contain 5-50 characters. Valid characters are a-z, A-Z, 0-9, hyphens, spaces, and underscores."
        >
          <EuiFieldText
            isInvalid={formik.touched.name && !!formik.errors.name}
            placeholder="Enter runner name"
            data-test-subj={'runner_name_field'}
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
            placeholder={'Enter a description for the inference runner.'}
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
          label={<FormFieldHeader headerTitle={'Select an inference model'} />}
          isInvalid={formik.touched.inferenceModelId && !!formik.errors?.inferenceModelId}
          error={formik.errors?.inferenceModelId}
          helpText="This is a mandatory field."
        >
          <EuiComboBox
            placeholder="Select an inference model"
            options={modelOptions}
            singleSelection={{ asPlainText: true }}
            isClearable={false}
            renderOption={renderModelOption}
            onChange={(e) => {
              formik.handleChange('inferenceModelId')(e[0]?.value ? e[0].value : '');
            }}
            onBlur={formik.handleBlur('inferenceModelId')}
            selectedOptions={
              formik.values.inferenceModelId
                ? [
                    {
                      value: formik.values.inferenceModelId,
                      label: modelOptions.filter(
                        (model) => model.value === formik.values.inferenceModelId
                      )[0].label,
                    },
                  ]
                : []
            }
          />
        </EuiFormRow>
      </ContentPanel>

      <EuiSpacer size={'m'} />

      <ContentPanel title={'Inference model arguments mapping'} titleSize={'m'}>
        <EuiSpacer size={'m'} />
        <RunnerFieldMappings loading={loading} />
      </ContentPanel>

      <EuiSpacer />

      <EuiFlexGroup justifyContent="flexEnd">
        <EuiFlexItem grow={false}>
          <EuiButton onClick={onClose}>Cancel</EuiButton>
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiButton
            onClick={() => formik.handleSubmit()}
            data-test-subj={'submit_runner_form_button'}
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
