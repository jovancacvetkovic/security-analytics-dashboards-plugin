export interface AggregatorItem {
  id?: string;
  name: string;
  description: string;
  source_index: string;
  page_size: number;
  aggregator_script: string;
}

export interface InferenceItem {
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
  inference_model: string;
}

export interface DocumentItem<T> extends DocumentItemProps {
  [key: string]: any;
}
