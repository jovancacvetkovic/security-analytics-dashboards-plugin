/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { EuiBasicTableColumn, EuiButton, EuiToolTip, EuiButtonIcon } from '@elastic/eui';
import { ROUTES } from '../../../../utils/constants';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { NotificationsStart } from 'opensearch-dashboards/public';

import { WidgetContainer } from '../../../Overview/components/Widgets/WidgetContainer';
import { TableWidget } from '../../../Overview/components/Widgets/TableWidget';
import { ServicesContext } from '../../../../services';
import { AggregatorItem } from '../../models/interfaces';
import { UebaViewModelActor } from '../../models/UebaViewModelActor';
import { BrowserServices } from '../../../../models/interfaces';

export interface AggregatorsProps {
  loading?: boolean;
  openFlyout: Function;
  services: BrowserServices;
  notifications: NotificationsStart;
}

export const RecentAggregators: React.FC<AggregatorsProps> = ({
  loading = false,
  openFlyout,
  notifications,
}) => {
  const services = useContext(ServicesContext);
  const uebaViewModelActor = services && new UebaViewModelActor(services, notifications);

  const [aggregatorItems, setAggregatorItems] = useState<AggregatorItem[]>([]);

  const actions = React.useMemo(
    () => [<EuiButton href={`#${ROUTES.UEBA_VIEW_AGGREGATORS}`}>View aggregators</EuiButton>],
    []
  );

  const columns: EuiBasicTableColumn<AggregatorItem>[] = [
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
      field: 'source_index',
      name: 'Source index',
      sortable: true,
      align: 'left',
    },
    {
      field: 'page_size',
      name: 'Page size',
      sortable: true,
      align: 'left',
    },
    {
      name: 'Details',
      sortable: false,
      actions: [
        {
          render: (aggregator: AggregatorItem) => (
            <EuiToolTip content={'View details'}>
              <EuiButtonIcon
                aria-label={'View details'}
                data-test-subj={`view-details-icon`}
                iconType={'expand'}
                onClick={() => openFlyout(aggregator)}
              />
            </EuiToolTip>
          ),
        },
      ],
    },
  ];

  const getAggregators = useCallback(async () => {
    const aggregators = await uebaViewModelActor?.getAggregators();
    aggregators && setAggregatorItems(aggregators);
  }, [services]);

  useEffect(() => {
    getAggregators();
  }, [getAggregators]);

  return (
    <WidgetContainer title={'Recent aggregators'} actions={actions}>
      <TableWidget columns={columns} items={aggregatorItems} loading={loading} />
    </WidgetContainer>
  );
};
