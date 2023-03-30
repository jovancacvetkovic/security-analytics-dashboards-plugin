/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { RulesStore } from './RulesStore';
import { BrowserServices } from '../models/interfaces';
import { NotificationsStart } from 'opensearch-dashboards/public';
import { DetectorsStore } from './DetectorsStore';
import { UebaStore } from './UebaStore';

export class DataStore {
  public static rules: RulesStore;
  public static detectors: DetectorsStore;
  public static ueba: UebaStore;

  public static init = (services: BrowserServices, notifications: NotificationsStart) => {
    DataStore.rules = new RulesStore(services.ruleService, notifications);
    DataStore.detectors = new DetectorsStore(services.detectorsService, notifications);
    DataStore.ueba = new UebaStore(services.uebaService, notifications);
  };
}
