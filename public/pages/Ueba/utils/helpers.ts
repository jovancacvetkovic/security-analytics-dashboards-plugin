import {
  addInteractiveLegends,
  DateOpts,
  defaultDateFormat,
  defaultScaleDomain,
  defaultTimeUnit,
  getTimeTooltip,
  getVisualizationSpec,
  getXAxis,
  getYAxis,
} from '../../Overview/utils/helpers';

import { euiPaletteColorBlind, euiPaletteForStatus } from '@elastic/eui';

export function getUebaVisualization(
  visualizationData: any[],
  groupBy: string,
  dateOpts: DateOpts = {
    timeUnit: defaultTimeUnit,
    dateFormat: defaultDateFormat,
    domain: defaultScaleDomain,
  }
) {
  const severities = ['info', 'low', 'medium', 'high', 'critical'];
  const isGroupedByLogType = groupBy === 'logType';
  const logTitle = 'Log type';
  const severityTitle = 'Rule severity';
  const title = isGroupedByLogType ? logTitle : severityTitle;
  return getVisualizationSpec('Findings data overview', visualizationData, [
    addInteractiveLegends({
      mark: {
        type: 'bar',
        clip: true,
      },
      encoding: {
        tooltip: [
          getYAxis('finding', 'Findings'),
          getTimeTooltip(dateOpts),
          {
            field: groupBy,
            title: title,
          },
        ],
        x: getXAxis(dateOpts),
        y: getYAxis('finding', 'Count'),
        color: {
          field: groupBy,
          title: title,
          scale: {
            domain: isGroupedByLogType ? undefined : severities,
            range: groupBy === 'logType' ? euiPaletteColorBlind() : euiPaletteForStatus(5),
          },
        },
      },
    }),
  ]);
}
