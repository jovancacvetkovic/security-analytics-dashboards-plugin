export interface AggregationQueryItem {
  id?: string;
  name: string;
  description: string;
  pageSize?: number;
  query: string;
}

export interface AggregatorItem {
  id?: string;
  name: string;
  description: string;
  type: string;
  schedule: any;
  aggregators: string[];
}

export interface DocumentItemProps {
  id?: string;
  name: string;
  inferenceModel: string;
}

export interface DocumentItem<T> extends DocumentItemProps {
  [key: string]: any;
}
