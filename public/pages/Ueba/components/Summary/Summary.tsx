import React, { useState } from 'react';
import { EuiFlexItem } from '@elastic/eui';

import { ChartContainer } from '../../../../components/Charts/ChartContainer';
import { WidgetContainer } from '../../../Overview/components/Widgets/WidgetContainer';
export interface SummaryProps {
  loading: boolean;
}
export const Summary: React.FC<SummaryProps> = ({ loading = true }) => {
  return (
    <WidgetContainer title="User entity behavior analytics" actions={[]}>
      <EuiFlexItem>
        <ChartContainer chartViewId={'ueba-view'} loading={loading} />
      </EuiFlexItem>
    </WidgetContainer>
  );
};
