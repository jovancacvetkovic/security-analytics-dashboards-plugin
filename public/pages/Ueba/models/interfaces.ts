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
