import {
  addInteractiveLegends,
  alertsDefaultColor,
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

export function getUebaVisualization(visualizationData: any[]) {
  console.log(visualizationData);
  return getVisualizationSpec('Docs data overview', visualizationData, [
    addInteractiveLegends({
      mark: {
        type: 'bar',
        clip: true,
      },
      encoding: {
        tooltip: [
          {
            field: 'score',
            title: 'Score',
          },
        ],
        x: {
          field: 'inference_model',
          title: 'Inference',
        },
        y: {
          type: 'quantitative',
          field: 'score',
          title: 'Score',
          scale: {
            domainMax: 1,
            domainMin: 0,
          },
        },
        color: {
          field: 'score',
          title: 'Inference score',
          scale: {
            range: ['#e7ba52', '#c7c7c7', '#aec7e8', '#1f77b4', '#9467bd'],
          },
        },
      },
    }),
    /*{
      data: {
        values: [{}],
      },
      encoding: {
        y: { datum: 0.5 },
      },
      layer: [
        {
          mark: 'rule',
          encoding: {
            y: {
              field: 'score',
            },
            color: { value: 'red' },
            size: { value: 1 },
          },
        },
        {
          mark: {
            type: 'text',
            align: 'top',
            baseline: 'middle',
            // dx: -2,
            // dy: -2,
            x: 'width',
            text: 'hazardous',
          },
        },
      ],
    },
    {
      mark: {
        type: 'text',
      },
      encoding: {
        text: { field: 'score' },
        color: {
          value: 'white',
        },
      },
    },*/
  ]);
}
