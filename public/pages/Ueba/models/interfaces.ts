export interface AggregationQueryItem {
  id?: string;
  name: string;
  description: string;
  page_size?: number;
  query: string;
}

export interface AggregatorItem {
  id?: string;
  name: string;
  description: string;
  schedule: {
    selectedFrequency: string;
  };
  queryId: string;
}

export interface DocumentItemProps {
  id?: string;
  name: string;
  inference_model: string;
}

export interface DocumentItem<T> extends DocumentItemProps {
  [key: string]: any;
}

export interface InferenceModelItemArg {
  key: string;
  display: string;
  default_value: string;
}
export interface InferenceModelItem {
  id: string;
  name: string;
  type: string;
  description: string;
  args: InferenceModelItemArg[];
}
