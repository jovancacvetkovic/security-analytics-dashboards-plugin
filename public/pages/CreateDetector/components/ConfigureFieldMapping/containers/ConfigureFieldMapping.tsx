/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import {
  EuiSpacer,
  EuiTitle,
  EuiText,
  EuiCallOut,
  EuiAccordion,
  EuiHorizontalRule,
  EuiPanel,
} from '@elastic/eui';
import FieldMappingsTable from '../components/RequiredFieldMapping';
import { FieldMapping } from '../../../../../../models/interfaces';
import { EMPTY_FIELD_MAPPINGS_VIEW } from '../utils/constants';
import { GetFieldMappingViewResponse } from '../../../../../../server/models/interfaces';
import FieldMappingService from '../../../../../services/FieldMappingService';
import { MappingViewType } from '../components/RequiredFieldMapping/FieldMappingsTable';
import { CreateDetectorRulesState } from '../../DefineDetector/components/DetectionRules/DetectionRules';
import { Detector } from '../../../../../../types';

export interface ruleFieldToIndexFieldMap {
  [fieldName: string]: string;
}

interface ConfigureFieldMappingProps extends RouteComponentProps {
  isEdit: boolean;
  detector: Detector;
  fieldMappingService: FieldMappingService;
  fieldMappings: FieldMapping[];
  loading: boolean;
  enabledRules: CreateDetectorRulesState['allRules'];
  replaceFieldMappings: (mappings: FieldMapping[]) => void;
}

interface ConfigureFieldMappingState {
  loading: boolean;
  detector: Detector;
  mappingsData: GetFieldMappingViewResponse;
  createdMappings: ruleFieldToIndexFieldMap;
  invalidMappingFieldNames: string[];
  fieldMappingIsOpen: boolean;
}

export default class ConfigureFieldMapping extends Component<
  ConfigureFieldMappingProps,
  ConfigureFieldMappingState
> {
  constructor(props: ConfigureFieldMappingProps) {
    super(props);
    const createdMappings: ruleFieldToIndexFieldMap = {};
    props.fieldMappings.forEach((mapping) => {
      createdMappings[mapping.ruleFieldName] = mapping.indexFieldName;
    });
    this.state = {
      loading: props.loading || false,
      mappingsData: EMPTY_FIELD_MAPPINGS_VIEW,
      createdMappings,
      invalidMappingFieldNames: [],
      detector: props.detector,
      fieldMappingIsOpen: false,
    };
  }

  componentDidMount = async () => {
    this.getAllMappings();
  };

  componentDidUpdate(
    prevProps: Readonly<ConfigureFieldMappingProps>,
    prevState: Readonly<ConfigureFieldMappingState>,
    snapshot?: any
  ) {
    if (prevProps.detector !== this.props.detector) {
      this.setState(
        {
          detector: this.props.detector,
        },
        () => {
          this.getAllMappings();
        }
      );
    }
  }

  private getRuleFieldsForEnabledRules(): Set<string> {
    const ruleFieldsForEnabledRules = new Set<string>();
    this.props.enabledRules.forEach((rule) => {
      rule._source.query_field_names.forEach((fieldname: { value: string }) => {
        ruleFieldsForEnabledRules.add(fieldname.value);
      });
    });

    return ruleFieldsForEnabledRules;
  }

  getAllMappings = async () => {
    if (this.state.detector.inputs[0]?.detector_input.indices[0]) {
      this.setState({ loading: true });
      const mappingsView = await this.props.fieldMappingService.getMappingsView(
        this.state.detector.inputs[0].detector_input.indices[0],
        this.state.detector.detector_type.toLowerCase()
      );
      if (mappingsView.ok) {
        const existingMappings = { ...this.state.createdMappings };
        const ruleFieldsForEnabledRules = this.getRuleFieldsForEnabledRules();
        const unmappedRuleFields = new Set(mappingsView.response.unmapped_field_aliases);

        Object.keys(mappingsView.response.properties).forEach((ruleFieldName) => {
          // Filter the mappings view to include only the rule fields for the enabled rules
          if (!ruleFieldsForEnabledRules.has(ruleFieldName)) {
            delete mappingsView.response.properties[ruleFieldName];
            return;
          }

          existingMappings[ruleFieldName] =
            this.state.createdMappings[ruleFieldName] ||
            mappingsView.response.properties[ruleFieldName].path;
        });
        mappingsView.response.unmapped_field_aliases?.forEach((ruleFieldName) => {
          if (!ruleFieldsForEnabledRules.has(ruleFieldName)) {
            unmappedRuleFields.delete(ruleFieldName);
          }
        });
        this.setState({
          createdMappings: existingMappings,
          mappingsData: {
            ...mappingsView.response,
            unmapped_field_aliases: Array.from(unmappedRuleFields),
          },
          fieldMappingIsOpen: !!unmappedRuleFields.size,
        });
        this.updateMappingSharedState(existingMappings);
      }
      this.setState({ loading: false });
    }
  };

  /**
   * Returns the fieldName(s) that have duplicate alias assigned to them
   */
  getInvalidMappingFieldNames(mappings: ruleFieldToIndexFieldMap): string[] {
    const seenAliases = new Set();
    const invalidFields: string[] = [];

    Object.entries(mappings).forEach((entry) => {
      if (seenAliases.has(entry[1])) {
        invalidFields.push(entry[0]);
      }

      seenAliases.add(entry[1]);
    });

    return invalidFields;
  }

  onMappingCreation = (ruleFieldName: string, indexFieldName: string): void => {
    const newMappings: ruleFieldToIndexFieldMap = {
      ...this.state.createdMappings,
      [ruleFieldName]: indexFieldName,
    };

    if (!indexFieldName) {
      delete newMappings[ruleFieldName];
    }

    const invalidMappingFieldNames = this.getInvalidMappingFieldNames(newMappings);
    this.setState({
      createdMappings: newMappings,
      invalidMappingFieldNames: invalidMappingFieldNames,
    });
    this.updateMappingSharedState(newMappings);
  };

  updateMappingSharedState = (createdMappings: ruleFieldToIndexFieldMap) => {
    this.props.replaceFieldMappings(
      Object.entries(createdMappings).map((entry) => {
        return {
          ruleFieldName: entry[0],
          indexFieldName: entry[1],
        };
      })
    );
  };

  render() {
    const {
      loading,
      mappingsData,
      createdMappings,
      invalidMappingFieldNames,
      fieldMappingIsOpen,
    } = this.state;
    const existingMappings: ruleFieldToIndexFieldMap = {
      ...createdMappings,
    };

    const mappedRuleFields: string[] = [];
    const logFields: Set<string> = new Set(mappingsData.unmapped_index_fields || []);
    let pendingCount = mappingsData.unmapped_field_aliases?.length || 0;
    const unmappedRuleFields = [...(mappingsData.unmapped_field_aliases || [])];

    Object.keys(mappingsData.properties).forEach((ruleFieldName) => {
      mappedRuleFields.unshift(ruleFieldName);

      // Need this check to avoid adding undefined value
      // When user removes existing mapping for default mapped values, the mapping will be undefined
      if (existingMappings[ruleFieldName]) {
        logFields.add(existingMappings[ruleFieldName]);
      }
    });

    Object.keys(existingMappings).forEach((mappedRuleField) => {
      if (unmappedRuleFields.includes(mappedRuleField)) {
        pendingCount--;
      }
    });

    const indexFieldOptions = Array.from(logFields);

    return (
      <>
        <EuiPanel paddingSize="none">
          <EuiAccordion
            buttonContent={
              <>
                <EuiTitle size={'m'}>
                  <h3>Configure field mapping - optional</h3>
                </EuiTitle>

                <EuiText size="s" color="subdued">
                  To perform threat detection, known field names from your log data source are
                  automatically mapped to rule field names. Additional fields that may require
                  manual mapping will be shown below.
                </EuiText>
              </>
            }
            buttonProps={{ style: { padding: '5px' } }}
            id={'mappedTitleFieldsAccordion'}
            initialIsOpen={!!unmappedRuleFields.length}
            forceState={fieldMappingIsOpen ? 'open' : 'closed'}
            onToggle={(isOpen) => {
              this.setState({ fieldMappingIsOpen: isOpen });
            }}
          >
            <EuiHorizontalRule margin={'xs'} />
            <EuiSpacer size={'s'} />

            <EuiAccordion
              buttonContent={
                <div data-test-subj="mapped-fields-btn">
                  <EuiTitle size={'s'}>
                    <h6>{`Automatically mapped fields (${mappedRuleFields.length})`}</h6>
                  </EuiTitle>
                </div>
              }
              buttonProps={{
                style: { paddingLeft: '5px', paddingRight: '5px', paddingTop: '5px' },
              }}
              id={'mappedFieldsAccordion'}
              initialIsOpen={false}
            >
              <EuiPanel hasBorder={false} hasShadow={false} paddingSize="s">
                <div data-test-subj="auto-mapped-fields-table">
                  <FieldMappingsTable<MappingViewType.Edit>
                    {...this.props}
                    loading={loading}
                    ruleFields={mappedRuleFields}
                    indexFields={indexFieldOptions}
                    mappingProps={{
                      type: MappingViewType.Edit,
                      existingMappings,
                      invalidMappingFieldNames,
                      onMappingCreation: this.onMappingCreation,
                    }}
                  />
                </div>
              </EuiPanel>
            </EuiAccordion>

            <EuiSpacer size={'m'} />

            <EuiPanel paddingSize={'s'} hasBorder={false} hasShadow={false}>
              {unmappedRuleFields.length > 0 ? (
                <>
                  {pendingCount > 0 ? (
                    <EuiCallOut
                      title={`${pendingCount} log fields are pending for field mapping`}
                      color={'warning'}
                    >
                      <p>
                        To generate accurate findings, we recommend mapping the following security
                        rules fields with the log fields in your data source.
                      </p>
                    </EuiCallOut>
                  ) : (
                    <EuiCallOut title={`All rule fields have been mapped`} color={'success'}>
                      <p>Your data source(s) have been mapped with all security rule fields.</p>
                    </EuiCallOut>
                  )}

                  <EuiSpacer size={'m'} />

                  <EuiTitle size={'s'}>
                    <h6>Pending field mappings</h6>
                  </EuiTitle>
                  <div data-test-subj="pending-mapped-fields-table">
                    <FieldMappingsTable<MappingViewType.Edit>
                      {...this.props}
                      loading={loading}
                      ruleFields={unmappedRuleFields}
                      indexFields={indexFieldOptions}
                      mappingProps={{
                        type: MappingViewType.Edit,
                        existingMappings,
                        invalidMappingFieldNames,
                        onMappingCreation: this.onMappingCreation,
                      }}
                    />
                  </div>
                </>
              ) : (
                <>
                  <EuiCallOut title={'We have automatically mapped all fields'} color={'success'}>
                    <p>
                      Your data source(s) have been mapped with all security rule fields. No action
                      is needed.
                    </p>
                  </EuiCallOut>
                </>
              )}
            </EuiPanel>

            <EuiSpacer size={'m'} />
          </EuiAccordion>
        </EuiPanel>
      </>
    );
  }
}
