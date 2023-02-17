/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { NotificationsStart } from 'opensearch-dashboards/public';
import { errorNotificationToast } from '../../../utils/helpers';
import { AggregatorItem, DocumentItem, InferenceItem } from './interfaces';
import { BrowserServices } from '../../../models/interfaces';

export interface UebaViewModel {
  aggregators: AggregatorItem[];
}

export class UebaViewModelActor {
  private readonly uebaViewModel: UebaViewModel;

  constructor(private services: BrowserServices, private notifications: NotificationsStart | null) {
    this.uebaViewModel = {
      aggregators: [],
    };
  }

  public async getAggregators(pageSize: number = 10): Promise<AggregatorItem[]> {
    try {
      const response = await this.services.uebaService.getAggregators(pageSize);

      if (response.ok) {
        return response?.response.hits.hits;
      } else {
        errorNotificationToast(this.notifications, 'retrieve', 'ueba aggregators', response.error);
      }

      return [];
    } catch (error: any) {
      errorNotificationToast(this.notifications, 'retrieve', 'ueba aggregators', error);
      return [];
    }
  }

  public async getInferences(pageSize: number = 10): Promise<InferenceItem[]> {
    try {
      const response = await this.services.uebaService.getInferences(pageSize);

      if (response.ok) {
        return response?.response.hits.hits;
      } else {
        errorNotificationToast(this.notifications, 'retrieve', 'ueba inferences', response.error);
      }

      return [];
    } catch (error: any) {
      errorNotificationToast(this.notifications, 'retrieve', 'ueba inferences', error);
      return [];
    }
  }

  public async getDocuments(pageSize: number = 10): Promise<DocumentItem<any>[]> {
    try {
      const response = await this.services.uebaService.getDocuments(pageSize);

      if (response.ok) {
        return response?.response.hits.hits;
      } else {
        errorNotificationToast(this.notifications, 'retrieve', 'ueba documents', response.error);
      }

      return [];
    } catch (error: any) {
      errorNotificationToast(this.notifications, 'retrieve', 'ueba documents', error);
      return [];
    }
  }

  public getUebaViewModel() {
    return this.uebaViewModel;
  }
}
