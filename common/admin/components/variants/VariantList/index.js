import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Checkbox } from 'semantic-ui-react';
import { Field } from 'formik';
import { Input, InputField } from '@shared/components/form';
import { first, map } from 'lodash';
import css from './index.scss';

class VariantList extends Component {
  static propTypes = {
    variants: PropTypes.array
  };

  static defaultProps = {
    variants: []
  };

  render() {
    const { variants } = this.props;
    const options = Object.keys(first(variants).options);

    return (
      <Table basic className={css.variantListForm}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell collapsing>
              <Checkbox />
            </Table.HeaderCell>
            {options.map((option, idx) => (
              <Table.HeaderCell collapsing key={idx}>
                {option}
              </Table.HeaderCell>
            ))}
            <Table.HeaderCell>Price</Table.HeaderCell>
            <Table.HeaderCell>SKU</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {variants.map((variant, idx) => {
            return (
              <Table.Row key={idx}>
                <Table.Cell>
                  <Checkbox />
                </Table.Cell>
                {map(variant.options, (value, key, index) => (
                  <Table.Cell key={`${idx}-${index}-${value}`}>
                    <Field
                      component={Input}
                      className={css.optionField}
                      name={`variants.${idx}.options[${key}]`}
                    />
                  </Table.Cell>
                ))}
                <Table.Cell>
                  <Field
                    component={InputField}
                    name={`variants.${idx}.priceInCents`}
                    placeholder="Price"
                    type="number"
                  />
                </Table.Cell>
                <Table.Cell>
                  <Field
                    component={InputField}
                    name={`variants.${idx}.sku`}
                    placeholder="SKU"
                  />
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    );
  }
}

export default VariantList;
