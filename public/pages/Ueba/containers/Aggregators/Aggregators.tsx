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
import { AggregatorFlyout } from './AggregatorFlyout';
import { WidgetContainer } from '../../../Overview/components/Widgets/WidgetContainer';
import { TableWidget } from '../../../Overview/components/Widgets/TableWidget';
import { AggregatorItem } from '../../models/interfaces';
import { UebaViewModelActor } from '../../models/UebaViewModelActor';

export interface UebaProps {
  services: BrowserServices;
  notifications: NotificationsStart;
  history: H.History;
}

export const Aggregators: React.FC<UebaProps> = ({ services, notifications, history }) => {
  const context = useContext(CoreServicesContext);
  const uebaViewModelActor = services && new UebaViewModelActor(services, notifications);

  const [loading, setloading] = useState<boolean>(true);
  const [aggregator, setAggregator] = useState<AggregatorItem>();
  const [aggregators, setAggregators] = useState<AggregatorItem[]>([]);

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
          render: (aggregator) => (
            <EuiToolTip content={'View details'}>
              <EuiButtonIcon
                aria-label={'View details'}
                data-test-subj={`view-details-icon`}
                iconType={'expand'}
                onClick={() => openAggregatorFlyout(aggregator)}
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
      BREADCRUMBS.UEBA_VIEW_AGGREGATORS,
    ]);
  });

  const getAggregators = useCallback(async () => {
    const aggregators = await uebaViewModelActor?.getAggregators();
    aggregators && setAggregators(aggregators);
    setloading(false);
  }, [services]);

  useEffect(() => {
    getAggregators();
  }, [getAggregators]);

  const openAggregatorFlyout = useCallback((aggregator: AggregatorItem) => {
    setAggregator(aggregator);
  }, []);

  const hideAggregatorFlyout = useCallback(() => {
    setAggregator(undefined);
  }, []);

  const actions = React.useMemo(
    () => [
      <EuiButton>Actions</EuiButton>,
      <EuiButton href={`#${ROUTES.UEBA_CREATE_AGGREGATOR}`}>Create aggregator</EuiButton>,
    ],
    []
  );

  const getTableSearchConfig = () => {
    return {
      box: {
        placeholder: 'Search aggregators',
        schema: true,
      },
      filters: [],
    };
  };

  return (
    <>
      {aggregator ? (
        <AggregatorFlyout hideFlyout={hideAggregatorFlyout} aggregator={aggregator} />
      ) : null}
      <EuiFlexGroup direction="column">
        <EuiFlexItem>
          <WidgetContainer title={'Aggregators'} actions={actions}>
            <TableWidget
              columns={columns}
              items={aggregators}
              loading={loading}
              search={getTableSearchConfig()}
            />
          </WidgetContainer>
        </EuiFlexItem>
      </EuiFlexGroup>
    </>
  );
};
