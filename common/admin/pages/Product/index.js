import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { ProductForm } from '@admin/components/products';
import { ProductQuery } from '@shared/components/products';
import { withUpdate } from '@shared/hocs/products';
import { get } from 'lodash';

class AdminProductPage extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    update: PropTypes.func.isRequired
  };

  handleUpdate = (values) => {
    return this.props.update(values);
  }

  render() {
    const { match } = this.props;
    const slug = get(match, 'params.slug', null);

    return (
      <ProductQuery slug={slug}>
        {({ loading, error, product }) => {
          if (loading || error) return null;

          return (
            <React.Fragment>
              <Helmet>
                <title>{product.title}</title>
              </Helmet>
              <h1>{product.title}</h1>
              <ProductForm
                product={product}
                onSubmit={this.handleUpdate}
              />
            </React.Fragment>
          );
        }}
      </ProductQuery>
    );
  }
}

export default withUpdate(AdminProductPage);
