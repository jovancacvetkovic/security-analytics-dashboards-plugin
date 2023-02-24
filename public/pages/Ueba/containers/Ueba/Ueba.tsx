import React, { useCallback, useEffect, useState } from 'react';
import { EuiTabs, EuiTab } from '@elastic/eui';

import { NotificationsStart } from 'opensearch-dashboards/public';
import { BrowserServices } from '../../../../models/interfaces';
import { ROUTES } from '../../../../utils/constants';
import * as H from 'history';
import { DateTimeFilter } from '../../../Overview/models/interfaces';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Inferences } from '../Inferences/Inferences';
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

interface TabRoute {
  id: string;
  name: string;
  route: string;
}

export const Ueba: React.FC<UebaProps> = ({ history, services, notifications }) => {
  const tabs: TabRoute[] = [
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

  const pathname = history.location.pathname;
  const initialTab = tabs.filter((tab) => tab.route === pathname);
  const initialRoute = initialTab[0] ? initialTab[0].id : 'inferences';
  const [selectedTabId, setSelectedTabId] = useState<string>(initialRoute);

  const renderTab = useCallback(
    (tab: TabRoute) => (
      <EuiTab
        onClick={() => onSelectedTabChanged(tab.id, tab.route)}
        isSelected={tab.id === selectedTabId}
        key={tab.id}
      >
        {tab.name}
      </EuiTab>
    ),
    [selectedTabId]
  );

  useEffect(() => {
    setSelectedTabId(initialRoute);
  }, [renderTab]);

  const onSelectedTabChanged = (id: string, route: string) => {
    setSelectedTabId(id);

    const path = history.location.pathname;
    if (!path.includes(route)) {
      history.push(route);
    }
  };

  return (
    <>
      <EuiTabs>{tabs.map(renderTab)}</EuiTabs>
      <div style={{ padding: '25px 0' }}>
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
            render={(props) => (
              <Aggregators services={services} history={history} notifications={notifications} />
            )}
          />
          <Route
            exact
            path={`${ROUTES.UEBA_VIEW_AGGREGATION_QUERIES}`}
            render={(props) => (
              <AggregationQueries
                services={services}
                history={history}
                notifications={notifications}
              />
            )}
          />
          <Redirect to={`${ROUTES.UEBA_VIEW_INFERENCES}`} />
        </Switch>
      </div>
    </>
  );
};
