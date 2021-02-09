import { ValidationError } from '../errors'
import { Field, FieldOptions, baseFieldFactory } from './base'

interface NumberField extends Field<number, number, number> {}
interface NumberFieldOptions extends FieldOptions<number> {}

function numberFieldFactory(options: NumberFieldOptions): NumberField {
  options.checkType = (value: any) => {
    if (typeof value !== 'number') {
      throw new ValidationError(`Field "${options.name}" must be number.`)
    }

    if (Number.isNaN(value)) {
      throw new ValidationError(`Field "${options.name}" cannot be NaN`)
    }
  }

  return baseFieldFactory<number, number, number>(options)
}

export {
  numberFieldFactory,
  NumberField,
  NumberFieldOptions,
}
