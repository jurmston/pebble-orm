import { ValidationError } from '../errors'
import { Field, FieldOptions, baseFieldFactory } from './base'

interface StringField extends Field<string, string, string> {}
interface StringFieldOptions extends FieldOptions<string> {}

function stringFieldFactory(options: StringFieldOptions): StringField {
  options.checkType = (value: any) => {
    if (typeof value !== 'string') {
      throw new ValidationError(`Field ${options.name} must be string.`)
    }
  }

  return baseFieldFactory<string, string, string>(options)
}

export {
  stringFieldFactory,
  StringField,
  StringFieldOptions,
}
