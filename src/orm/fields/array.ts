import { FieldError, ValidationError } from '../errors'
import { Field, FieldOptions } from './base'


type ArrayFieldType = any[]

interface ArrayField extends Field<ArrayFieldType, ArrayFieldType, ArrayFieldType> {}
interface ArrayFieldOptions extends FieldOptions<ArrayFieldType> {
  subField: any,
}

function arrayFieldFactory(options: Partial<ArrayFieldOptions>): ArrayField {
  if (!options.name) {
    throw new FieldError('Field must have a name.')
  }

  if (!options.subField) {
    throw new FieldError('Array field must have a subfield.')
  }

  function getDefault(): ArrayFieldType | undefined {
    if (typeof options.defaultValue === 'function') {
      return (options.defaultValue())
    }

    if (options.defaultValue) {
      return options.defaultValue
    }

    return undefined
  }

  function validate(value: any): void {
    if (!Array.isArray(value)) {
      throw new ValidationError(`Field "${options.name}" must be an array`)
    }

    // Apply any subfield validators to each item
    value.forEach(subvalue => {
      options.subField.validate(subvalue)
    })
  }

  const applySubfieldToArray = (method: any) => (value: ArrayFieldType | undefined ) => {
    if (value === undefined) {
      return undefined
    }

    return value.map(method)
  }

  const applySubfieldFromArray = (method: any) => (value: ArrayFieldType | undefined | null) => {
    if (value === undefined || value === null) {
      return undefined
    }

    return value.map(method)
  }

  return {
    name: options.name,
    isRequired: options.isRequired || false,
    getDefault,
    validate,
    fromDb: applySubfieldFromArray(options.subField.fromDb),
    fromApi: applySubfieldFromArray(options.subField.fromApi),
    toDb: applySubfieldToArray(options.subField.toDb),
    toApi: applySubfieldToArray(options.subField.toApi),
  }

}


export {
  ArrayField,
  ArrayFieldOptions,
  arrayFieldFactory,
}
