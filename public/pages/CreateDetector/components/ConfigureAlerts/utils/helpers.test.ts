import {
  createSelectedOptions,
  getEmptyAlertCondition,
  getNotificationChannels,
  parseAlertSeverityToOption,
  parseNotificationChannelsToOptions,
} from './helpers';
import { expect } from '@jest/globals';
import { mockNotificationsService } from '../../../../../models/CreateDetector/components/ConfigureAlerts/containers/ConfigureAlerts/ConfigureAlerts.mock';
import { CHANNEL_TYPES } from './constants';

describe('helper utilities spec', () => {
  describe('tests parseAlertSeverityToOption function', () => {
    it(' - should match the snapshot', () => {
      expect(parseAlertSeverityToOption('1')).toMatchSnapshot();
    });
  });

  describe('tests createSelectedOptions function', () => {
    it(' - should match the snapshot', () => {
      expect(createSelectedOptions(['1 Highest'])).toMatchSnapshot();
    });
  });

  describe('tests getNotificationChannels function', () => {
    it(' - should match the snapshot', () => {
      expect(getNotificationChannels(mockNotificationsService)).toMatchSnapshot();
    });
  });

  describe('tests getEmptyAlertCondition function', () => {
    it(' - should match the snapshot', () => {
      expect(getEmptyAlertCondition()).toMatchSnapshot();
    });
  });

  describe('tests parseNotificationChannelsToOptions function', () => {
    it(' - should match the snapshot', () => {
      let notificationChannels = [
        {
          config_id: 'mockConfigId',
          name: 'mockName',
          description: 'mockDescription',
          config_type: 'mockConfigType',
          is_enabled: false,
        },
      ];
      expect(
        parseNotificationChannelsToOptions(notificationChannels, CHANNEL_TYPES)
      ).toMatchSnapshot();
    });
  });
});
