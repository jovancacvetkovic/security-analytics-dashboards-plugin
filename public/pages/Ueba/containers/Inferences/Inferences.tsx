import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiTitle,
  EuiSuperDatePicker,
  EuiBasicTableColumn,
  EuiButton,
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

import { TableWidget } from '../../../Overview/components/Widgets/TableWidget';
import { WidgetContainer } from '../../../Overview/components/Widgets/WidgetContainer';
import { renderVisualization } from '../../../../utils/helpers';
import { getUebaVisualization } from '../../utils/helpers';
import { UebaViewModelActor } from '../../models/UebaViewModelActor';

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

export const Inferences: React.FC<UebaProps> = (props) => {
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

  const [loading, setLoading] = useState<boolean>(true);
  const [recentlyUsedRanges, setRecentlyUsedRanges] = useState([DEFAULT_DATE_RANGE]);

  // const timeUnits = getChartTimeUnit(dateTimeFilter.startTime, dateTimeFilter.endTime);
  // const [timeUnit, setTimeUnit] = useState<TimeUnit>(timeUnits.timeUnit);

  const [documents, setDocuments] = useState<DocumentsItem[]>([]);

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
      <EuiButton href={`#${ROUTES}`}>View document details</EuiButton>,
      <EuiButton>Acknowledge</EuiButton>,
    ],
    []
  );

  useEffect(() => {
    context?.chrome.setBreadcrumbs([
      BREADCRUMBS.SECURITY_ANALYTICS,
      BREADCRUMBS.UEBA,
      BREADCRUMBS.UEBA_VIEW_INFERENCES,
    ]);
  });

  useEffect(() => {
    context?.chrome.setBreadcrumbs([BREADCRUMBS.SECURITY_ANALYTICS, BREADCRUMBS.UEBA]);
    getDocuments();
  }, [getDocuments]);

  const onTimeChange = async ({ start, end }: { start: string; end: string }) => {
    let usedRanges = recentlyUsedRanges.filter(
      (range) => !(range.start === start && range.end === end)
    );
    usedRanges.unshift({
      start: start,
      end: end,
    });
    if (usedRanges.length > MAX_RECENTLY_USED_TIME_RANGES)
      usedRanges = usedRanges.slice(0, MAX_RECENTLY_USED_TIME_RANGES);

    const endTime = start === end ? DEFAULT_DATE_RANGE.end : end;
    // const timeUnits = getChartTimeUnit(start, endTime);

    props.setDateTimeFilter &&
      props.setDateTimeFilter({
        startTime: start,
        endTime: endTime,
      });
    // setTimeUnit(timeUnits.timeUnit);
    setRecentlyUsedRanges(usedRanges);
  };

  const onRefresh = async () => {
    setLoading(true);
    // await overviewViewModelActor.onRefresh(dateTimeFilter.startTime, dateTimeFilter.endTime);
  };

  return (
    <>
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
        </EuiFlexItem>
      </EuiFlexGroup>
    </>
  );
};
