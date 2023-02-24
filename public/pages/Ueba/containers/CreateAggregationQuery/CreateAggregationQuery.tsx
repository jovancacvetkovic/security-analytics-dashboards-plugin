import React, { useCallback, useContext, useEffect, useState } from 'react';

import { NotificationsStart } from 'opensearch-dashboards/public';
import { BrowserServices } from '../../../../models/interfaces';
import { CoreServicesContext } from '../../../../components/core_services';
import { BREADCRUMBS, ROUTES } from '../../../../utils/constants';
import * as H from 'history';
import { FormikErrors, useFormik } from 'formik';
import { ContentPanel } from '../../../../components/ContentPanel';
import { AggregationQueryItem } from '../../models/interfaces';

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
  EuiCodeEditor,
} from '@elastic/eui';
import { FormFieldHeader } from '../../../../components/FormFieldHeader/FormFieldHeader';
import { validateDescription, validateName } from '../../../../utils/validation';
import { CatIndex } from '../../../../../server/models/interfaces';

export interface UebaProps {
  services: BrowserServices;
  notifications?: NotificationsStart;
  history: H.History;
}

export interface QueryEditorAnnotations {
  row: number;
  column: number;
  text: string;
  type: string;
}

const defaultQueryEditorValue = {
  query: {
    match_all: {},
  },
  size: 0,
  aggs: {
    itt: {
      composite: {
        size: 2,
        sources: [{ user_id: { terms: { field: 'winlog.event_data.TargetUserSid.keyword' } } }],
      },
      aggregations: {
        ip_list: {
          scripted_metric: {
            init_script: "state['ips'] = new ArrayList()",
            map_script:
              "state['ip'] = doc['winlog.event_data.IpAddress.keyword']; state.ips.add(state['ip'].value)",
            combine_script:
              'List combined = new ArrayList(); for (ip in state.ips) combined.add(ip); return combined',
            reduce_script:
              'List final = new ArrayList(); for (ip_list in states) final.addAll(ip_list); return final.stream().distinct().sorted().collect(Collectors.toList());',
          },
        },
      },
    },
  },
};

export const CreateAggregationQuery: React.FC<UebaProps> = ({
  services,
  notifications,
  history,
}) => {
  const context = useContext(CoreServicesContext);
  useEffect(() => {
    context?.chrome.setBreadcrumbs([
      BREADCRUMBS.SECURITY_ANALYTICS,
      BREADCRUMBS.UEBA,
      BREADCRUMBS.UEBA_VIEW_AGGREGATION_QUERIES,
      BREADCRUMBS.UEBA_CREATE_AGGREGATION_QUERY,
    ]);
  });

  const [annotations, setAnnotations] = useState<QueryEditorAnnotations[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [indexes, setIndexes] = useState<{ label: string; value: string }[]>([]);

  const getIndices = useCallback(async () => {
    const indicesResponse = await services.indexService.getIndices();
    if (indicesResponse.ok) {
      const indices = indicesResponse.response.indices;

      const indicesNames: { label: string; value: string }[] = indices.map((index: CatIndex) => ({
        label: index.index,
        value: index.index,
      }));

      setIndexes(indicesNames);
    }
    setLoading(false);
  }, [services]);

  useEffect(() => {
    getIndices();
  }, [getIndices]);

  const onSubmit = async (values: AggregationQueryItem) => {
    // const submitingRule = mapFormToRule(values);
    // if (!validateRule(submitingRule, notifications!, 'create')) {
    //   return;
    // }
    //
    // let result;
    // if (mode === 'edit') {
    //   if (!rule) {
    //     console.error('No rule id found');
    //     return;
    //   }
    //   result = await ruleService.updateRule(rule?.id, submitingRule.category, submitingRule);
    // } else {
    //   result = await ruleService.createRule(submitingRule);
    // }
    //
    // if (!result.ok) {
    //   errorNotificationToast(
    //     notifications!,
    //     mode === 'create' ? 'create' : 'save',
    //     'rule',
    //     result.error
    //   );
    // } else {
    //   history.replace(ROUTES.RULES);
    // }
  };

  const onClose = useCallback(() => {
    history.replace(ROUTES.UEBA_VIEW_AGGREGATION_QUERIES);
  }, [history]);

  const formik = useFormik({
    validateOnMount: true,
    validateOnChange: true,
    initialValues: {
      name: '',
      description: '',
      dataSource: '',
      query: '',
    },
    validate: (values) => {
      const errors: FormikErrors<AggregationQueryItem> = {};

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

      if (!values.dataSource) {
        errors.dataSource = 'Data source is required';
      }

      // if (!values.query) {
      //   errors.query = 'Aggregation query is required';
      // }

      return errors;
    },
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(false);
      await onSubmit(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <EuiTitle size={'m'}>
        <h3>{'Create aggregation query'}</h3>
      </EuiTitle>

      <EuiText size="s" color="subdued">
        Any additional text about aggregation query.
      </EuiText>
      <EuiSpacer size={'m'} />

      <ContentPanel title={'Query details'} titleSize={'m'}>
        <EuiSpacer size={'m'} />
        <EuiFormRow
          label={<FormFieldHeader headerTitle={'Name'} />}
          isInvalid={formik.touched.name && !!formik.errors?.name}
          error={formik.errors?.name}
          helpText="Aggregation query name must contain 5-50 characters. Valid characters are a-z, A-Z, 0-9, hyphens, spaces, and underscores."
        >
          <EuiFieldText
            isInvalid={formik.touched.name && !!formik.errors.name}
            placeholder="Enter rule name"
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

      <ContentPanel title={'Data source'} titleSize={'m'}>
        <EuiSpacer size={'m'} />
        <EuiFormRow
          label={<FormFieldHeader headerTitle={'Select or input indexes or index patterns'} />}
          isInvalid={formik.touched.dataSource && !!formik.errors?.dataSource}
          error={formik.errors?.dataSource}
        >
          <EuiComboBox
            isInvalid={formik.touched.dataSource && !!formik.errors.dataSource}
            isLoading={loading}
            placeholder="Select a data source"
            data-test-subj={'data_source_dropdown'}
            options={indexes.map(({ value, label }) => ({ value, label }))}
            singleSelection={{ asPlainText: true }}
            onChange={(e) => formik.handleChange('dataSource')(e[0]?.value ? e[0].value : '')}
            onBlur={formik.handleBlur('dataSource')}
            selectedOptions={
              formik.values.dataSource
                ? [{ value: formik.values.dataSource, label: formik.values.dataSource }]
                : []
            }
          />
        </EuiFormRow>
      </ContentPanel>

      <EuiSpacer size={'m'} />

      <ContentPanel title={'Aggregation query'} titleSize={'m'}>
        <EuiSpacer size={'m'} />
        <EuiFormRow
          label={<FormFieldHeader headerTitle={'Write an aggregation query (DSL)'} />}
          isInvalid={formik.touched.query && !!formik.errors?.query}
          error={formik.errors?.query}
          fullWidth={true}
        >
          <EuiCodeEditor
            name={'query'}
            theme={''}
            mode="json"
            width="100%"
            value={formik.values.query || JSON.stringify(defaultQueryEditorValue, null, 2)}
            onChange={(value) => formik.handleChange('query')(value)}
            onBlur={formik.handleBlur('query')}
            data-test-subj={'aggregation_query_field'}
            placeholder={'Enter the aggregation query here'}
            annotations={annotations}
          />
        </EuiFormRow>
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
            {'Create'}
          </EuiButton>
        </EuiFlexItem>
      </EuiFlexGroup>
    </form>
  );
};
