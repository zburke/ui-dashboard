import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';

import { Field, useFormState, useForm } from 'react-final-form';

import {
  Col,
  KeyValue,
  Row,
  Select
} from '@folio/stripes/components';
import { get } from 'lodash';
import { requiredValidator } from '@folio/stripes-erm-components';
import SimpleSearchDateFilterField from './SimpleSearchDateFilterField';
import SimpleSearchUUIDFilterField from './SimpleSearchUUIDFilterField';
import isComparatorSpecialCase from '../../../utilities';

const SimpleSearchFilterRuleField = ({
  filterComponent,
  filterComponentProps,
  input: { name },
  selectedFilterColumn: { comparators = [], resource, valueType } = {}
}) => {
  const { values } = useFormState();
  const { change } = useForm();
  const intl = useIntl();

  const selectifiedComparators = comparators.map(
    sfcc => ({ value: sfcc,
      label: intl.formatMessage({
        id: `ui-dashboard.simpleSearchForm.filters.filterField.comparator.${valueType}.${sfcc}`,
        defaultMessage: sfcc
      }) })
  );

  useEffect(() => {
    // Ensure comparator is always set
    // -- was an issue when changing between two filters of same valueType
    if (get(values, `${name}.comparator`) === undefined) {
      change(`${name}.comparator`, selectifiedComparators[0]?.value);
    }
  }, [change, name, selectifiedComparators, values]);

  const comparator = get(values, `${name}.comparator`);
  const comparatorIsSpecialCase = isComparatorSpecialCase(comparator);

  // If type is Date or UUID then we need to do some extra work, send to specific components
  if (valueType === 'Date' || valueType === 'DateTime') {
    return (
      <SimpleSearchDateFilterField
        comparators={comparators}
        dateTime={valueType === 'DateTime'}
        filterComponent={filterComponent}
        filterComponentProps={filterComponentProps}
        input={{ name }}
        selectifiedComparators={selectifiedComparators}
      />
    );
  }

  if (valueType === 'UUID') {
    return (
      <SimpleSearchUUIDFilterField
        comparators={comparators}
        filterComponent={filterComponent}
        filterComponentProps={filterComponentProps}
        input={{ name }}
        resourceType={resource}
        selectifiedComparators={selectifiedComparators}
      />
    );
  }

  return (
    <Row>
      {selectifiedComparators.length > 0 &&
        <Col xs={6}>
          <KeyValue label={<FormattedMessage id="ui-dashboard.simpleSearchForm.filters.filterField.comparator" />}>
            <Field
              autoFocus
              component={Select}
              dataOptions={selectifiedComparators}
              name={`${name}.comparator`}
              required
              validate={requiredValidator}
            />
          </KeyValue>
        </Col>
      }
      <Col xs={6}>
        <KeyValue label={<FormattedMessage id="ui-dashboard.simpleSearchForm.filters.filterField.value" />}>
          <Field
            {...filterComponentProps}
            component={filterComponent}
            disabled={comparatorIsSpecialCase}
            name={`${name}.filterValue`}
          />
        </KeyValue>
      </Col>
    </Row>
  );
};

SimpleSearchFilterRuleField.propTypes = {
  filterComponent: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.node,
    PropTypes.func,
  ]),
  filterComponentProps: PropTypes.object,
  input: PropTypes.shape({
    name: PropTypes.string.isRequired
  }).isRequired,
  selectedFilterColumn: PropTypes.shape({
    comparators: PropTypes.arrayOf(
      PropTypes.string
    )
  })
};

export default SimpleSearchFilterRuleField;
