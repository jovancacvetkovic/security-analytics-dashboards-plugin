import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiBasicTableColumn,
  EuiButton,
  EuiButtonIcon,
  EuiToolTip,
} from '@elastic/eui';
import { NotificationsStart } from 'opensearch-dashboards/public';
import { BrowserServices } from '../../../../models/interfaces';
import { CoreServicesContext } from '../../../../components/core_services';
import { BREADCRUMBS, ROUTES } from '../../../../utils/constants';
import * as H from 'history';
import { UebaViewModelActor } from '../../models/UebaViewModelActor';
import { AggregationQueryItem } from '../../models/interfaces';
import { WidgetContainer } from '../../../Overview/components/Widgets/WidgetContainer';
import { TableWidget } from '../../../Overview/components/Widgets/TableWidget';
import { AggregationQueryFlyout } from './AggregationQueryFlyout';

export interface UebaProps {
  services: BrowserServices;
  notifications: NotificationsStart;
  history: H.History;
}

export const AggregationQueries: React.FC<UebaProps> = ({ services, notifications, history }) => {
  const context = useContext(CoreServicesContext);
  const uebaViewModelActor = services && new UebaViewModelActor(services, notifications);

  const [loading, setloading] = useState<boolean>(true);
  const [aggregationQuery, setAggregationQuery] = useState<AggregationQueryItem>();
  const [aggregationQueries, setAggregationQueries] = useState<AggregationQueryItem[]>([]);

  const columns: EuiBasicTableColumn<AggregationQueryItem>[] = [
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
          render: (aggregationQuery: AggregationQueryItem) => (
            <EuiToolTip content={'View details'}>
              <EuiButtonIcon
                aria-label={'View details'}
                data-test-subj={`view-details-icon`}
                iconType={'expand'}
                onClick={() => openAggregationQueryFlyout(aggregationQuery)}
              />
            </EuiToolTip>
          ),
        },
      ],
    },
  ];

  useEffect(() => {
    context?.chrome.setBreadcrumbs([
      BREADCRUMBS.SECURITY_ANALYTICS,
      BREADCRUMBS.UEBA,
      BREADCRUMBS.UEBA_VIEW_AGGREGATION_QUERIES,
    ]);
  });

  const getAggregationQueries = useCallback(async () => {
    const aggregationQueries = await uebaViewModelActor?.getAggregationQueries();
    aggregationQueries && setAggregationQueries(aggregationQueries);
    setloading(false);
  }, [services]);

  useEffect(() => {
    getAggregationQueries();
  }, [getAggregationQueries]);

  const openAggregationQueryFlyout = useCallback((aggregationQuery: AggregationQueryItem) => {
    setAggregationQuery(aggregationQuery);
  }, []);

  const hideAggregationQueryFlyout = useCallback(() => {
    setAggregationQuery(undefined);
  }, []);

  const actions = React.useMemo(
    () => [
      <EuiButton>Actions</EuiButton>,
      <EuiButton href={`#${ROUTES.UEBA_CREATE_AGGREGATION_QUERY}`}>
        Create aggregation query
      </EuiButton>,
    ],
    []
  );

  const getTableSearchConfig = () => {
    return {
      box: {
        placeholder: 'Search aggregation queries',
        schema: true,
      },
      filters: [],
    };
  };

  return (
    <>
      {aggregationQuery ? (
        <AggregationQueryFlyout
          hideFlyout={hideAggregationQueryFlyout}
          aggregationQuery={aggregationQuery}
        />
      ) : null}
      <EuiFlexGroup direction="column">
        <EuiFlexItem>
          <WidgetContainer title={'Aggregation queries'} actions={actions}>
            <TableWidget
              columns={columns}
              items={aggregationQueries}
              loading={loading}
              search={getTableSearchConfig()}
            />
          </WidgetContainer>
        </EuiFlexItem>
      </EuiFlexGroup>
    </>
  );
};
