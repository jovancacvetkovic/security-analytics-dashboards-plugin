/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  EuiText,
  EuiInMemoryTable,
  EuiBasicTableColumn,
  EuiIcon,
  EuiEmptyPrompt,
  EuiFormRow,
  EuiComboBox,
} from '@elastic/eui';

export const RunnerFieldMappings: React.FC<any> = ({ history }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const columns: EuiBasicTableColumn<any>[] = [
    {
      field: 'argFieldName',
      name: 'Argument',
      dataType: 'string',
      width: '25%',
      render: (argFieldName: string) => argFieldName,
    },
    {
      field: '',
      name: 'Maps to',
      align: 'center',
      width: '15%',
      render: () => <EuiIcon type={'sortRight'} />,
    },
    {
      field: 'logFieldName',
      name: 'Log source field name',
      dataType: 'string',
      width: '45%',
      render: (modelFieldName: string, entry: any) => {
        const isInvalid = false;
        return (
          <EuiFormRow
            style={{ width: '100%' }}
            isInvalid={isInvalid}
            error={isInvalid ? 'Field is already used.' : undefined}
          >
            <EuiComboBox
              data-test-subj={'detector-field-mappings-select'}
              placeholder="Select a mapping field"
              singleSelection={{ asPlainText: true }}
              options={[]}
              selectedOptions={[]}
              onChange={() => {}}
            />
          </EuiFormRow>
        );
      },
    },
  ];

  return (
    <EuiInMemoryTable
      loading={loading}
      items={[]}
      columns={columns}
      pagination={{
        pageIndex: pageIndex,
      }}
      isSelectable={false}
      onTableChange={() => {}}
      message={
        <EuiEmptyPrompt
          style={{ maxWidth: '45em' }}
          body={
            <EuiText>
              <p>There are no field mappings.</p>
            </EuiText>
          }
        />
      }
    />
  );
};
