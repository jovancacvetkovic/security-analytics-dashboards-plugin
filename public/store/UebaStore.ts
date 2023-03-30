/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { RuleService, UebaService } from '../services';
import { load, safeDump } from 'js-yaml';
import { RuleItemInfoBase, IRulesStore, IRulesCache } from '../../types';
import { Rule } from '../../models/interfaces';
import { NotificationsStart } from 'opensearch-dashboards/public';
import { errorNotificationToast } from '../utils/helpers';
import { ruleTypes } from '../pages/Rules/utils/constants';
import _ from 'lodash';
import { InferenceModelItem } from '../pages/Ueba/models/interfaces';

interface IUebaStore {
  readonly service: UebaService;
  readonly notifications: NotificationsStart;
}

interface IUebaCache {
  [key: string]: InferenceModelItem[];
}

/**
 * Class is used to make rule's API calls and cache the rules.
 * If there is a cache data requests are skipped and result is returned from the cache.
 * If cache is invalidated then the request is triggered to get a new set of data.
 *
 * @class UebaStore
 * @implements IRulesStore
 * @param {BrowserServices} services Uses services to make API requests
 */
export class UebaStore implements IUebaStore {
  /**
   * Rule service instance
   *
   * @property {UebaService} service
   * @readonly
   */
  readonly service: UebaService;

  /**
   * Notifications
   * @property {NotificationsStart}
   * @readonly
   */
  readonly notifications: NotificationsStart;

  constructor(service: UebaService, notifications: NotificationsStart) {
    this.service = service;
    this.notifications = notifications;
  }

  /**
   * Keeps rule's data cached
   *
   * @property {IUebaCache} cache
   */
  private cache: IUebaCache = {};

  /**
   * Invalidates all rules data
   */
  private invalidateCache = () => {
    this.cache = {};
    return this;
  };

  /**
   * Makes the request to get inference models
   *
   */
  public async getInferenceModels(): Promise<InferenceModelItem[]> {
    const cacheKey: string = `getInferenceModels:${JSON.stringify(arguments)}`;

    if (this.cache[cacheKey]) {
      return this.cache[cacheKey];
    }

    const response = await this.service.getInferenceModels();

    if (response?.ok) {
      return (this.cache[cacheKey] = response.response.hits.hits);
    }

    return [];
  }
}
