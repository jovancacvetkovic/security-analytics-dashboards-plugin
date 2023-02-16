/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { EuiBasicTableColumn, EuiButton, EuiToolTip, EuiButtonIcon } from '@elastic/eui';
import { ROUTES } from '../../../../utils/constants';
import React, { useCallback, useContext, useEffect, useState } from 'react';

import { WidgetContainer } from '../../../Overview/components/Widgets/WidgetContainer';
import { TableWidget } from '../../../Overview/components/Widgets/TableWidget';
import { InferenceItem } from '../../models/interfaces';
import { ServicesContext } from '../../../../services';

export interface InferenceProps {
  loading?: boolean;
  openFlyout: Function;
}

export const RecentInferences: React.FC<InferenceProps> = ({ loading = false, openFlyout }) => {
  const services = useContext(ServicesContext);
  const [inferenceItems, setInferenceItems] = useState<InferenceItem[]>([]);

  const actions = React.useMemo(
    () => [<EuiButton href={`#${ROUTES.UEBA_VIEW_INFERENCES}`}>View inferences</EuiButton>],
    []
  );

  const columns: EuiBasicTableColumn<InferenceItem>[] = [
    {
      field: 'name',
      name: 'Name',
      sortable: true,
      align: 'left',
    },
    {
      field: 'description',
      name: 'Description',
      sortable: false,
      align: 'left',
    },
    {
      field: 'type',
      name: 'Type',
      sortable: false,
      align: 'left',
    },
    {
      field: 'schedule',
      name: 'Schedule',
      sortable: false,
      align: 'left',
    },
    {
      name: 'Details',
      sortable: false,
      actions: [
        {
          render: (inference) => (
            <EuiToolTip content={'View details'}>
              <EuiButtonIcon
                aria-label={'View details'}
                data-test-subj={`view-details-icon`}
                iconType={'expand'}
                onClick={() => openFlyout(inference)}
              />
            </EuiToolTip>
          ),
        },
      ],
    },
  ];

  const getInferences = useCallback(async () => {
    const inferencesResponse = await services?.uebaService.getInferences();
    if (inferencesResponse?.ok) {
      setInferenceItems(inferencesResponse?.response.hits.hits);
    }
  }, [services]);

  useEffect(() => {
    getInferences();
  }, [getInferences]);

  return (
    <WidgetContainer title={'Recent inference models'} actions={actions}>
      <TableWidget columns={columns} items={inferenceItems} loading={loading} />
    </WidgetContainer>
  );
};
