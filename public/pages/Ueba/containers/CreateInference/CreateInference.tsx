import React, { useContext, useEffect } from 'react';

import { NotificationsStart } from 'opensearch-dashboards/public';
import { BrowserServices } from '../../../../models/interfaces';
import { CoreServicesContext } from '../../../../components/core_services';
import { BREADCRUMBS } from '../../../../utils/constants';
import * as H from 'history';

export interface UebaProps {
  services: BrowserServices;
  notifications?: NotificationsStart;
  history: H.History;
}

export const CreateInference: React.FC<UebaProps> = (props) => {
  const context = useContext(CoreServicesContext);
  useEffect(() => {
    context?.chrome.setBreadcrumbs([
      BREADCRUMBS.SECURITY_ANALYTICS,
      BREADCRUMBS.UEBA,
      BREADCRUMBS.UEBA_CREATE_INFERENCE,
    ]);
  });

  return <>Create inference</>;
};
