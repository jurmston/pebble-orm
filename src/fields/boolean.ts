import { ValidationError } from '../errors'
import { Field, FieldOptions, baseFieldFactory } from './base'

interface BooleanField extends Field<boolean, boolean, boolean> {}
interface BooleanFieldOptions extends FieldOptions<boolean> {}

function booleanFieldFactory(options: BooleanFieldOptions): BooleanField {
  options.checkType = (value: any) => {
    if (typeof value !== 'boolean') {
      throw new ValidationError(`Field ${options.name} must be boolean.`)
    }
  }

  return baseFieldFactory<boolean, boolean, boolean>(options)
}

export {
  booleanFieldFactory,
  BooleanField,
  BooleanFieldOptions,
}
