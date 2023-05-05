/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { dump, load } from 'js-yaml';
import {
  EuiAccordion,
  EuiToolTip,
  EuiButtonIcon,
  EuiTitle,
  EuiText,
  EuiSpacer,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormRow,
  EuiFieldText,
  EuiComboBox,
  EuiPanel,
  EuiRadioGroup,
  EuiTextArea,
  EuiButton,
  EuiHorizontalRule,
  EuiModal,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiModalBody,
  EuiModalFooter,
  EuiFilePicker,
  EuiCodeEditor,
} from '@elastic/eui';
import _ from 'lodash';
import {
  validateCondition,
  validateDetectionFieldName,
  validateName,
} from '../../../../utils/validation';

export interface DetectionVisualEditorProps {
  detectionYml: string;
  onChange: (value: string) => void;
}

interface Errors {
  fields: { [key: string]: string };
  touched: { [key: string]: boolean };
}

interface DetectionVisualEditorState {
  detectionObj: DetectionObject;
  fileUploadModalState?: {
    selectionIdx: number;
    dataIdx: number;
  };
  errors: Errors;
}

interface SelectionData {
  field: string;
  modifier?: string;
  values: string[];
  selectedRadioId?: string;
}

interface Selection {
  name: string;
  data: SelectionData[];
}

interface DetectionObject {
  condition: string;
  selections: Selection[];
}

enum SelectionMapValueRadioId {
  VALUE = 'selection-map-value',
  LIST = 'selection-map-list',
}

const detectionModifierOptions = [
  { value: 'contains', label: 'contains' },
  { value: 'all', label: 'all' },
  { value: 'base64', label: 'base64' },
  { value: 'endswith', label: 'endswith' },
  { value: 'startswith', label: 'startswith' },
];

const defaultDetectionObj: DetectionObject = {
  condition: '',
  selections: [
    {
      name: '',
      data: [
        {
          field: '',
          values: [''],
          modifier: detectionModifierOptions[0].value,
        },
      ],
    },
  ],
};

export class DetectionVisualEditor extends React.Component<
  DetectionVisualEditorProps,
  DetectionVisualEditorState
> {
  constructor(props: DetectionVisualEditorProps) {
    super(props);
    this.state = {
      detectionObj: this.parseDetectionYml(),
      errors: {
        fields: {},
        touched: {},
      },
    };
  }

  public componentDidUpdate(
    prevProps: Readonly<DetectionVisualEditorProps>,
    prevState: Readonly<DetectionVisualEditorState>,
    snapshot?: any
  ): void {
    if (prevState.detectionObj !== this.state.detectionObj) {
      this.props.onChange(this.createDetectionYml());
    }
  }

  private parseDetectionYml = (): DetectionObject => {
    const detectionJSON: any = load(this.props.detectionYml);
    const detectionObj: DetectionObject = {
      ...defaultDetectionObj,
    };

    if (!detectionJSON) {
      return detectionObj;
    }

    detectionObj.condition = detectionJSON.condition ?? detectionObj.condition;
    detectionObj.selections = [];

    delete detectionJSON.condition;

    Object.keys(detectionJSON).forEach((selectionKey, selectionIdx) => {
      const selectionMapJSON = detectionJSON[selectionKey];
      const selectionDataEntries: SelectionData[] = [];

      Object.keys(selectionMapJSON).forEach((fieldKey, dataIdx) => {
        const [field, modifier] = fieldKey.split('|');
        const val = selectionMapJSON[fieldKey];
        const values: any[] = typeof val === 'string' ? [val] : val;
        selectionDataEntries.push({
          field,
          modifier,
          values,
          selectedRadioId: `${
            values.length <= 1 ? SelectionMapValueRadioId.VALUE : SelectionMapValueRadioId.LIST
          }-${selectionIdx}-${dataIdx}`,
        });
      });

      detectionObj.selections.push({
        name: selectionKey,
        data: selectionDataEntries,
      });
    });

    return detectionObj;
  };

  private createDetectionYml = (): string => {
    const { condition, selections } = this.state.detectionObj;
    const compiledDetection: any = {
      condition,
    };

    selections.forEach((selection, idx) => {
      const selectionMaps: any = {};

      selection.data.forEach((datum) => {
        const key = `${datum.field}${datum.modifier ? `|${datum.modifier}` : ''}`;
        selectionMaps[key] = datum.values;
      });

      // compiledDetection[`Selection_${idx + 1}`] = selectionMaps;
      compiledDetection[selection.name] = selectionMaps;
    });

    return dump(compiledDetection);
  };

  private updateDatumInState = (
    selectionIdx: number,
    dataIdx: number,
    newDatum: Partial<SelectionData>
  ) => {
    const { errors } = this.state;
    const { condition, selections } = this.state.detectionObj;
    const selection = selections[selectionIdx];
    const datum = selection.data[dataIdx];
    const newSelections = [
      ...selections.slice(0, selectionIdx),
      {
        ...selection,
        data: [
          ...selection.data.slice(0, dataIdx),
          {
            ...datum,
            ...newDatum,
          },
          ...selection.data.slice(dataIdx + 1),
        ],
      },
      ...selections.slice(selectionIdx + 1),
    ];

    newSelections.map((selection, selIdx) => {
      selection.data.map((data, idx) => {
        const fieldName = `field_${selIdx}_${idx}`;
        delete errors.fields[fieldName];
        if (!data.field) {
          errors.fields[fieldName] = 'Key name is required';
        } else {
          if (!validateDetectionFieldName(data.field)) {
            errors.fields[fieldName] = 'Invalid key name.';
          }
        }
        errors.touched[fieldName] = true;
      });
    });

    this.setState({
      detectionObj: {
        condition,
        selections: newSelections,
      },
      errors,
    });
  };

  private updateSelection = (selectionIdx: number, newSelection: Partial<Selection>) => {
    const { condition, selections } = this.state.detectionObj;
    const { errors } = this.state;
    const selection = selections[selectionIdx];

    delete errors.fields['name'];
    if (!selection.name) {
      errors.fields['name'] = 'Selection name is required';
    } else {
      if (!validateName(selection.name)) {
        errors.fields['name'] = 'Invalid selection name.';
      } else {
        selections.map((sel, selIdx) => {
          if (selIdx !== selectionIdx && sel.name === newSelection.name) {
            errors.fields['name'] = 'Selection name already exists.';
          }
        });
      }
    }
    errors.touched['name'] = true;

    this.setState({
      detectionObj: {
        condition,
        selections: [
          ...selections.slice(0, selectionIdx),
          {
            ...selection,
            ...newSelection,
          },
          ...selections.slice(selectionIdx + 1),
        ],
      },
      errors,
    });
  };

  private updateCondition = (value: string) => {
    const {
      errors,
      detectionObj: { selections },
    } = this.state;
    value = value.trim();

    delete errors.fields['condition'];
    if (!value) {
      errors.fields['condition'] = 'Condition is required';
    } else {
      if (!validateCondition(value)) {
        errors.fields['condition'] = 'Invalid condition.';
      } else {
        const selectionNames = _.map(selections, 'name');
        const conditions = _.pull(value.split(' '), ...['and', 'or', 'not']);
        conditions.map((selection) => {
          if (_.indexOf(selectionNames, selection) === -1) {
            errors.fields['condition'] = `The selection name "${selection}" doesn't exists.`;
          }
        });
      }
    }
    errors.touched['condition'] = true;

    const detectionObj = { ...this.state.detectionObj, condition: value } as DetectionObject;
    this.setState({
      detectionObj,
      errors,
    });
  };

  private csvStringToArray = (
    csvString: string,
    delimiter: string = ',',
    numOfColumnsToReturn: number = 1
  ): string[] => {
    const rows = csvString.split('\n');
    return rows
      .map((row) => (!_.isEmpty(row) ? row.split(delimiter, numOfColumnsToReturn) : []))
      .flat();
  };

  private onFileUpload = (files: any, selectionIdx: number, dataIdx: number) => {
    if (files[0]?.type === 'text/csv' || files[0]?.type === 'text/plain') {
      let reader = new FileReader();
      reader.readAsText(files[0]);
      reader.onload = () => {
        try {
          const textContent = reader.result;
          if (typeof textContent === 'string') {
            this.updateDatumInState(selectionIdx, dataIdx, {
              values: this.csvStringToArray(textContent),
            });
          }
        } catch (error: any) {
        } finally {
          this.setState({ fileUploadModalState: undefined });
        }
      };
    }
  };

  private closeFileUploadModal = () => {
    this.setState({
      fileUploadModalState: undefined,
    });
  };

  private createRadioGroupOptions = (selectionIdx: number, datumIdx: number) => {
    return [
      {
        id: `${SelectionMapValueRadioId.VALUE}-${selectionIdx}-${datumIdx}`,
        label: 'Value',
      },
      {
        id: `${SelectionMapValueRadioId.LIST}-${selectionIdx}-${datumIdx}`,
        label: 'List',
      },
    ];
  };

  render() {
    const {
      detectionObj: { condition, selections },
      fileUploadModalState,
      errors = {
        touched: {},
        fields: {},
      },
    } = this.state;

    return (
      <EuiPanel style={{ maxWidth: 1000 }}>
        {selections.map((selection, selectionIdx) => {
          return (
            <div data-test-subj={`detection-visual-editor-${selectionIdx}`}>
              <EuiFlexGroup alignItems="center">
                <EuiFlexItem grow={true}>
                  <EuiTitle size="s">
                    <p>{selection.name || `Selection_${selectionIdx + 1}`}</p>
                  </EuiTitle>
                  <EuiText size="s">
                    <p>Define the search identifier in your data the rule will be applied to.</p>
                  </EuiText>
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                  {selections.length > 1 && (
                    <EuiToolTip title={'Delete selection'}>
                      <EuiButtonIcon
                        iconType={'trash'}
                        color="danger"
                        onClick={() => {
                          const newSelections = [...selections];
                          newSelections.splice(selectionIdx, 1);
                          this.setState({
                            detectionObj: {
                              condition,
                              selections: newSelections,
                            },
                          });
                        }}
                      />
                    </EuiToolTip>
                  )}
                </EuiFlexItem>
              </EuiFlexGroup>

              <EuiSpacer />

              <EuiFormRow
                isInvalid={errors.touched.name && !!errors.fields.name}
                error={errors.fields.name}
                label={<EuiText size={'s'}>Name</EuiText>}
              >
                <EuiFieldText
                  isInvalid={errors.touched.name && !!errors.fields.name}
                  placeholder="Enter selection name"
                  data-test-subj={'selection_name'}
                  onChange={(e) => this.updateSelection(selectionIdx, { name: e.target.value })}
                  onBlur={(e) => this.updateSelection(selectionIdx, { name: e.target.value })}
                  value={selection.name}
                />
              </EuiFormRow>

              <EuiSpacer />

              {selection.data.map((datum, idx) => {
                const radioGroupOptions = this.createRadioGroupOptions(selectionIdx, idx);
                const fieldName = `field_${selectionIdx}_${idx}`;
                return (
                  <EuiAccordion
                    id={`Map-${idx}`}
                    data-test-subj={`Map-${idx}`}
                    initialIsOpen={true}
                    buttonContent={`Map ${idx + 1}`}
                    extraAction={
                      selection.data.length > 1 ? (
                        <EuiToolTip title={'Delete map'}>
                          <EuiButtonIcon
                            iconType={'trash'}
                            color="danger"
                            onClick={() => {
                              const newData = [...selection.data];
                              newData.splice(idx, 1);
                              this.updateSelection(selectionIdx, { data: newData });
                            }}
                          />
                        </EuiToolTip>
                      ) : null
                    }
                    style={{ maxWidth: '500px' }}
                  >
                    <EuiSpacer size="m" />

                    <EuiFlexGroup>
                      <EuiFlexItem grow={false} style={{ minWidth: 200 }}>
                        <EuiFormRow
                          isInvalid={errors.touched[fieldName] && !!errors.fields[fieldName]}
                          error={errors.fields[fieldName]}
                          label={<EuiText size={'s'}>Key</EuiText>}
                        >
                          <EuiFieldText
                            isInvalid={errors.touched[fieldName] && !!errors.fields[fieldName]}
                            placeholder="Enter key name"
                            data-test-subj={'selection_field_key_name'}
                            onChange={(e) =>
                              this.updateDatumInState(selectionIdx, idx, {
                                field: e.target.value,
                              })
                            }
                            onBlur={(e) =>
                              this.updateDatumInState(selectionIdx, idx, {
                                field: e.target.value,
                              })
                            }
                            value={datum.field}
                          />
                        </EuiFormRow>
                      </EuiFlexItem>
                      <EuiFlexItem grow={false} style={{ minWidth: 200 }}>
                        <EuiFormRow label={<EuiText size={'s'}>Modifier</EuiText>}>
                          <EuiComboBox
                            // isInvalid={isInvalidInputForQuery('logType')}
                            placeholder="Select a field"
                            data-test-subj={'field_dropdown'}
                            options={detectionModifierOptions}
                            singleSelection={{ asPlainText: true }}
                            onChange={(e) => {
                              this.updateDatumInState(selectionIdx, idx, {
                                modifier: e[0].value,
                              });
                            }}
                            onBlur={(e) => {}}
                            selectedOptions={
                              datum.modifier
                                ? [{ value: datum.modifier, label: datum.modifier }]
                                : [detectionModifierOptions[0]]
                            }
                          />
                        </EuiFormRow>
                      </EuiFlexItem>
                    </EuiFlexGroup>
                    <EuiSpacer size="m" />

                    <EuiRadioGroup
                      options={radioGroupOptions}
                      idSelected={datum.selectedRadioId || radioGroupOptions[0].id}
                      onChange={(id) => {
                        this.updateDatumInState(selectionIdx, idx, {
                          selectedRadioId: id as SelectionMapValueRadioId,
                        });
                      }}
                    />
                    <EuiSpacer size="m" />

                    {datum.selectedRadioId?.includes('list') ? (
                      <>
                        <EuiButton
                          iconType="download"
                          onClick={() => {
                            this.setState({
                              fileUploadModalState: {
                                selectionIdx,
                                dataIdx: idx,
                              },
                            });
                          }}
                        >
                          Upload file
                        </EuiButton>
                        <EuiSpacer />
                        <EuiTextArea
                          style={{ maxWidth: '100%' }}
                          onChange={(e) => {
                            const values = e.target.value.split('\n');
                            console.log(values);
                            this.updateDatumInState(selectionIdx, idx, {
                              values,
                            });
                          }}
                          value={datum.values.join('\n')}
                          compressed={true}
                        />
                      </>
                    ) : (
                      <EuiFieldText
                        // isInvalid={props.touched.name && !!props.errors.name}
                        placeholder="Value"
                        data-test-subj={'selection_field_value'}
                        onChange={(e) => {
                          this.updateDatumInState(selectionIdx, idx, {
                            values: [e.target.value, ...datum.values.slice(1)],
                          });
                        }}
                        onBlur={(e) => {}}
                        value={datum.values[0]}
                      />
                    )}

                    <EuiHorizontalRule margin="s" />
                    <EuiSpacer size="m" />
                  </EuiAccordion>
                );
              })}

              <EuiButton
                iconType="plusInCircle"
                onClick={() => {
                  const newData = [
                    ...selection.data,
                    { ...defaultDetectionObj.selections[0].data[0] },
                  ];
                  this.updateSelection(selectionIdx, { data: newData });
                }}
              >
                Add map
              </EuiButton>

              <EuiSpacer />

              <EuiHorizontalRule />
            </div>
          );
        })}

        <EuiButton
          fullWidth
          iconType={'plusInCircle'}
          onClick={() => {
            this.setState({
              detectionObj: {
                condition,
                selections: [
                  ...selections,
                  {
                    ...defaultDetectionObj.selections[0],
                  },
                ],
              },
            });
          }}
        >
          Add selection
        </EuiButton>

        <EuiSpacer />

        <EuiFormRow
          isInvalid={errors.touched.condition && !!errors.fields.condition}
          error={errors.fields.condition}
          label={
            <>
              <EuiTitle size="s">
                <p>Condition</p>
              </EuiTitle>
              <EuiText size="xs">
                Define how each selection should be included in the final query. For more options
                use YAML editor.
              </EuiText>
            </>
          }
        >
          <EuiCodeEditor
            mode="yaml"
            width="600px"
            height="50px"
            value={this.state.detectionObj.condition}
            onChange={(value) => this.updateCondition(value)}
            onBlur={(e) => {
              this.updateCondition(this.state.detectionObj.condition);
            }}
            data-test-subj={'rule_detection_field'}
          />
        </EuiFormRow>

        {fileUploadModalState && (
          <EuiModal onClose={this.closeFileUploadModal}>
            <EuiModalHeader>
              <EuiModalHeaderTitle>
                <h1>Upload a file</h1>
              </EuiModalHeaderTitle>
            </EuiModalHeader>

            <EuiModalBody>
              <EuiFilePicker
                id={'filePickerId'}
                fullWidth
                initialPromptText="Select or drag file containing list of values"
                onChange={(files: any) =>
                  this.onFileUpload(
                    files,
                    fileUploadModalState.selectionIdx,
                    fileUploadModalState.dataIdx
                  )
                }
                multiple={false}
                aria-label="file picker"
              />
              <EuiText color="subdued" size="xs">
                <p>
                  Accepted formats: .csv, .txt. Maximum size: 25 MB. <br /> Learn more about
                  formatting
                </p>
              </EuiText>
            </EuiModalBody>

            <EuiModalFooter>
              <EuiButton fill={true} onClick={this.closeFileUploadModal}>
                Close
              </EuiButton>
            </EuiModalFooter>
          </EuiModal>
        )}
      </EuiPanel>
    );
  }
}