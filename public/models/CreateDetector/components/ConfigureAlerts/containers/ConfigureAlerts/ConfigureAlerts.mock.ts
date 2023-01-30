/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { mockDetector } from '../../../../../Interfaces.mock';
import { mockRuleOptions } from '../../components/AlertCondition/AlertConditionPanel.mock';
import { NotificationsService } from '../../../../../../services';

export const mockNotificationsService: NotificationsService = {
  getChannels: () => {
    return {
      ok: true,
      response: {
        channel_list: [],
      },
    };
  },
};

export default {
  detector: mockDetector,
  isEdit: false,
  rulesOptions: [mockRuleOptions],
  changeDetector: jest.fn(),
  updateDataValidState: jest.fn(),
  notificationsService: mockNotificationsService,
  hasNotificationPlugin: false,
};
