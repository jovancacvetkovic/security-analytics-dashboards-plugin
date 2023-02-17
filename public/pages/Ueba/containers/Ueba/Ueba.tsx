import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiTitle,
  EuiSuperDatePicker,
  EuiFlexGrid,
  EuiBasicTableColumn,
  EuiButton,
  EuiSpacer,
} from '@elastic/eui';

import { NotificationsStart } from 'opensearch-dashboards/public';
import { BrowserServices } from '../../../../models/interfaces';
import { CoreServicesContext } from '../../../../components/core_services';
import {
  BREADCRUMBS,
  DEFAULT_DATE_RANGE,
  MAX_RECENTLY_USED_TIME_RANGES,
  ROUTES,
} from '../../../../utils/constants';
import * as H from 'history';
import { Summary } from '../../components/Summary/Summary';
import { DateTimeFilter } from '../../../Overview/models/interfaces';
import { getChartTimeUnit, TimeUnit } from '../../../Overview/utils/helpers';
import { RecentAggregators } from '../../components/RecentWidgets/RecentAggregators';
import { RecentInferences } from '../../components/RecentWidgets/RecentInferences';
import { TableWidget } from '../../../Overview/components/Widgets/TableWidget';
import { WidgetContainer } from '../../../Overview/components/Widgets/WidgetContainer';
import { renderVisualization } from '../../../../utils/helpers';
import { getUebaVisualization } from '../../utils/helpers';
import { AggregatorFlyout } from '../ViewAggregators/AggregatorFlyout';
import { InferenceFlyout } from '../ViewInferences/InferenceFlyout';
import { AggregatorItem, InferenceItem } from '../../models/interfaces';
import { UebaViewModelActor } from '../../models/UebaViewModelActor';
import _ from 'lodash';

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

export const Ueba: React.FC<UebaProps> = (props) => {
  const {
    dateTimeFilter = {
      startTime: DEFAULT_DATE_RANGE.start,
      endTime: DEFAULT_DATE_RANGE.end,
    },
    services,
    notifications,
  } = props;
  const uebaViewModelActor = services && new UebaViewModelActor(services, notifications);

  const context = useContext(CoreServicesContext);

  const [aggregator, setAggregator] = useState<AggregatorItem>();
  const [inference, setInference] = useState<InferenceItem>();

  const [loading, setLoading] = useState<boolean>(true);
  const [recentlyUsedRanges, setRecentlyUsedRanges] = useState([DEFAULT_DATE_RANGE]);

  const timeUnits = getChartTimeUnit(dateTimeFilter.startTime, dateTimeFilter.endTime);
  const [timeUnit, setTimeUnit] = useState<TimeUnit>(timeUnits.timeUnit);

  const [documents, setDocuments] = useState<DocumentsItem[]>([]);
  const [inferences, setInferences] = useState<InferenceItem[]>([]);

  const columns: EuiBasicTableColumn<DocumentsItem>[] = [
    {
      field: 'name',
      name: 'Document',
      sortable: true,
      align: 'left',
    },
    {
      field: 'inference_model',
      name: 'Inference model',
      sortable: true,
      align: 'left',
    },
    {
      field: 'score',
      name: 'Score',
      sortable: true,
      align: 'left',
    },
  ];

  const getDocuments = useCallback(async () => {
    let documents = await uebaViewModelActor?.getDocuments();
    if (documents?.length) {
      documents.forEach((doc) => {
        const inferenceType = doc.inference_model;
        doc.score = doc[`${inferenceType}_inference`].score;
      });
      setDocuments(documents);

      renderVisualization(getUebaVisualization(documents), 'ueba-view');
    }
    setLoading(false);
  }, [services]);

  const inferenceModels: any = [];

  const getTableSearchConfig = () => {
    return {
      box: {
        placeholder: 'Search documents',
        schema: true,
      },
      filters: [
        {
          type: 'field_value_selection',
          field: 'inference_model',
          name: 'Inference model',
          multiSelect: 'or',
          options: inferenceModels.map((model: any) => ({
            value: model.id,
            name: model.name,
          })),
        },
      ],
    };
  };

  const actions = React.useMemo(
    () => [
      <EuiButton href={`#${ROUTES.UEBA_CREATE_AGGREGATOR}`}>Create Aggregator</EuiButton>,
      <EuiButton href={`#${ROUTES.UEBA_CREATE_INFERENCE}`}>Create inference</EuiButton>,
    ],
    []
  );

  useEffect(() => {
    context?.chrome.setBreadcrumbs([BREADCRUMBS.SECURITY_ANALYTICS, BREADCRUMBS.UEBA]);
    getDocuments();
  }, [getDocuments]);

  const onTimeChange = async ({ start, end }: { start: string; end: string }) => {
    let usedRanges = recentlyUsedRanges.filter(
      (range) => !(range.start === start && range.end === end)
    );
    usedRanges.unshift({ start: start, end: end });
    if (usedRanges.length > MAX_RECENTLY_USED_TIME_RANGES)
      usedRanges = usedRanges.slice(0, MAX_RECENTLY_USED_TIME_RANGES);

    const endTime = start === end ? DEFAULT_DATE_RANGE.end : end;
    const timeUnits = getChartTimeUnit(start, endTime);

    props.setDateTimeFilter &&
      props.setDateTimeFilter({
        startTime: start,
        endTime: endTime,
      });
    setTimeUnit(timeUnits.timeUnit);
    setRecentlyUsedRanges(usedRanges);
  };

  const onRefresh = async () => {
    setLoading(true);
    // await overviewViewModelActor.onRefresh(dateTimeFilter.startTime, dateTimeFilter.endTime);
  };

  const openAggregatorFlyout = useCallback((aggregator: AggregatorItem) => {
    setAggregator(aggregator);
  }, []);

  const openInferenceFlyout = useCallback((inference: InferenceItem) => {
    setInference(inference);
  }, []);

  const hideAggregatorFlyout = useCallback(() => {
    setAggregator(undefined);
  }, []);

  const hideInferenceFlyout = useCallback(() => {
    setInference(undefined);
  }, []);

  return (
    <>
      {aggregator ? (
        <AggregatorFlyout hideFlyout={hideAggregatorFlyout} aggregator={aggregator} />
      ) : null}
      {inference ? (
        <InferenceFlyout hideFlyout={hideInferenceFlyout} inference={inference} />
      ) : null}
      <EuiFlexGroup direction="column">
        <EuiFlexItem>
          <EuiFlexGroup justifyContent="spaceBetween">
            <EuiFlexItem grow={false}>
              <EuiTitle size="m">
                <h1>UEBA Overview</h1>
              </EuiTitle>
            </EuiFlexItem>

            <EuiFlexItem grow={false}>
              <EuiSuperDatePicker
                start={dateTimeFilter.startTime}
                end={dateTimeFilter.endTime}
                recentlyUsedRanges={recentlyUsedRanges}
                isLoading={loading}
                onTimeChange={onTimeChange}
                onRefresh={onRefresh}
                updateButtonProps={{ fill: false }}
              />
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFlexItem>
        <EuiFlexItem>
          <Summary loading={loading} />
        </EuiFlexItem>

        <EuiFlexItem>
          <WidgetContainer title={'Entity documents'} actions={actions}>
            <TableWidget
              columns={columns}
              items={documents}
              loading={loading}
              search={getTableSearchConfig()}
            />
          </WidgetContainer>
          <EuiSpacer size={'m'} />
          <EuiFlexGrid columns={2} gutterSize="m">
            <RecentAggregators
              loading={loading}
              openFlyout={openAggregatorFlyout}
              services={services}
              notifications={notifications}
            />
            <RecentInferences
              loading={loading}
              openFlyout={openInferenceFlyout}
              services={services}
              notifications={notifications}
            />
          </EuiFlexGrid>
        </EuiFlexItem>
      </EuiFlexGroup>
    </>
  );
};
