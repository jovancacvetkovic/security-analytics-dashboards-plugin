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
} from '@elastic/eui';
import { FormFieldHeader } from '../../../../components/FormFieldHeader/FormFieldHeader';
import { validateDescription, validateName } from '../../../../utils/validation';
import { CatIndex } from '../../../../../server/models/interfaces';

import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/ext-language_tools';
import _ from 'lodash';

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

export const CreateAggregationQuery: React.FC<UebaProps> = ({
  services,
  notifications,
  history,
}) => {
  const context = useContext(CoreServicesContext);
  const [annotations, setAnnotations] = useState<QueryEditorAnnotations[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [indexes, setIndexes] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    context?.chrome.setBreadcrumbs([
      BREADCRUMBS.SECURITY_ANALYTICS,
      BREADCRUMBS.UEBA,
      BREADCRUMBS.UEBA_VIEW_AGGREGATION_QUERIES,
      BREADCRUMBS.UEBA_CREATE_AGGREGATION_QUERY,
    ]);
  });

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

  const onSubmit = async (values: AggregationQueryItem) => {};

  const onClose = useCallback(() => {
    history.replace(ROUTES.UEBA_VIEW_AGGREGATION_QUERIES);
  }, [history]);

  const formik = useFormik({
    validateOnMount: true,
    validateOnChange: true,
    validateOnBlur: true,
    initialValues: {
      name: '',
      description: '',
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

      if (!values.query) {
        errors.query = 'Aggregation query is required';
      }

      return errors;
    },
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(false);
      await onSubmit(values);
    },
  });

  const customAceEditorCompleter = {
    getCompletions: (editor, session, caretPosition2d, prefix, callback) => {
      const suggestions = ['aggs', 'composite', 'aggregations'];
      callback(
        null,
        _.map(suggestions, (s) => {
          return { name: s, value: s, score: 1, meta: 'rhyme' };
        })
      );
    },
  };

  const updateEditorNameAttribute = (item: HTMLElement) => {
    if (item && item.refEditor) {
      // ace editor doesn't set name attribute, but overrides it to an ID attribute instead
      // the change is necessary because formik uses name attribute to bind input element to itself
      const textAreaEls = item.refEditor.getElementsByClassName('ace_text-input');
      if (textAreaEls?.length) textAreaEls[0].setAttribute('name', 'query');
    }
  };

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

      <ContentPanel title={'Aggregation query'} titleSize={'m'}>
        <EuiSpacer size={'m'} />
        <EuiFormRow
          label={<FormFieldHeader headerTitle={'Write an aggregation query (DSL)'} />}
          isInvalid={formik.touched.query && !!formik.errors?.query}
          error={formik.errors?.query}
          fullWidth={true}
          helpText={'Write an aggregation query here.'}
        >
          <AceEditor
            ref={updateEditorNameAttribute}
            mode="json"
            theme="textmate"
            name={'query'}
            width={'100%'}
            fontSize={14}
            editorProps={{ $blockScrolling: true }}
            showPrintMargin={false}
            enableBasicAutocompletion={true}
            onChange={(value) => {
              formik.handleChange('query')(value);
            }}
            onBlur={formik.handleBlur('query')}
            value={formik.values.query}
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
