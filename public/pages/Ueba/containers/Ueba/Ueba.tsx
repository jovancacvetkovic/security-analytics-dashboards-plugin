import React, { useState } from 'react';
import { EuiTabs, EuiTab } from '@elastic/eui';

import { NotificationsStart } from 'opensearch-dashboards/public';
import { BrowserServices } from '../../../../models/interfaces';
import { ROUTES } from '../../../../utils/constants';
import * as H from 'history';
import { DateTimeFilter } from '../../../Overview/models/interfaces';
import _ from 'lodash';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Inferences } from './Inferences';
import { Aggregators } from '../Aggregators/Aggregators';
import { AggregationQueries } from '../AggregationQueries/AggregationQueries';

export interface UebaProps {
  services: BrowserServices;
  notifications: NotificationsStart;
  history: H.History;
  setDateTimeFilter?: Function;
  dateTimeFilter?: DateTimeFilter;
}

export interface DocumentsItem {
  id?: string;
}

export const Ueba: React.FC<UebaProps> = ({ history, services, notifications }) => {
  const tabs = [
    {
      id: 'inferences',
      name: 'Inferences',
      route: ROUTES.UEBA_VIEW_INFERENCES,
    },
    {
      id: 'aggregators',
      name: 'Aggregators',
      route: ROUTES.UEBA_VIEW_AGGREGATORS,
    },
    {
      id: 'aggregation_queries',
      name: 'Aggregation queries',
      route: ROUTES.UEBA_VIEW_AGGREGATION_QUERIES,
    },
  ];
  const [selectedTabId, setSelectedTabId] = useState<string>('inferences');

  const onSelectedTabChanged = (id: string, route: string) => {
    setSelectedTabId(id);

    const path = history.location.pathname;
    if (!path.includes(route)) {
      history.push(route);
    }
  };

  const renderTab = (tab) => (
    <EuiTab
      onClick={() => onSelectedTabChanged(tab.id, tab.route)}
      isSelected={tab.id === selectedTabId}
      key={tab.id}
    >
      {tab.name}
    </EuiTab>
  );

  return (
    <>
      <EuiTabs>{tabs.map(renderTab)}</EuiTabs>
      <div style={{ padding: '25px 25px' }}>
        <Switch>
          <Route
            exact
            path={`${ROUTES.UEBA_VIEW_INFERENCES}`}
            render={(props) => (
              <Inferences services={services} notifications={notifications} history={history} />
            )}
          />
          <Route
            exact
            path={`${ROUTES.UEBA_VIEW_AGGREGATORS}`}
            render={(props) => <Aggregators services={services} history={history} />}
          />
          <Route
            exact
            path={`${ROUTES.UEBA_VIEW_AGGREGATION_QUERIES}`}
            render={(props) => <AggregationQueries services={services} history={history} />}
          />
          <Redirect to={`${ROUTES.UEBA_VIEW_INFERENCES}`} />
        </Switch>
      </div>
    </>
  );
};
