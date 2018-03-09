import { Validator } from 'objection';
import { keyBy, mapValues } from 'lodash';

class YupValidator extends Validator {
  constructor(options = {}) {
    super();
    this.errorParser = options.errorParser || this.defaultErrorParser;
  }

  defaultErrorParser(error) {
    const errors = error.inner.map(err => ({
      key: err.path,
      message: err.message
    }));

    return mapValues(keyBy(errors, 'key'), (o) => ({
      message: o.message
    }));
  }

  validate(args) {
    const { model, json, options } = args;
    const { yupSchema } = model.constructor;
    let result;

    if (!yupSchema) {
      throw new Error('A `yupSchema` must be included in the model.');
    }

    try {
      // use synchronous validation since objection.js doesn't support
      // async validation (unless we implement it on our own).
      result = yupSchema.validateSync(json, {
        abortEarly: false,
        stripUnknown: true,
        context: {
          // if this is an update, we make fields optional since updates
          // do not have all the fields in the json to validate.
          patch: !!options.patch
        }
      });
    } catch (err) {
      // Catch the error throw by `yup`, and create our own validation error.
      throw model.constructor.createValidationError({
        type: 'ModelValidation',
        statusCode: 400,
        data: this.errorParser(err)
      });
    }

    // Return the modified/validated data (possibly with default values added)
    return result;
  }

  // Override Validator.beforeValidate until
  // https://github.com/Vincit/objection.js/issues/804 is released
  beforeValidate({ model, json, opts }) {
    model.$beforeValidate(null, json, opts);
  }

  afterValidate(args) {
    // Takes the same arguments as `validate`. Usually there is no need
    // to override this.
    return super.afterValidate(args);
  }
}

module.exports = YupValidator;
