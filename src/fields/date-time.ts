import { DateTime } from 'luxon'
import { ValidationError } from '../errors'
import { Field, FieldOptions, baseFieldFactory } from './base'



interface DateTimeField extends Field<number, DateTime, number> {}
interface DateTimeFieldOptions extends FieldOptions<DateTime> {}

function dateTimeFieldFactory(options: DateTimeFieldOptions): DateTimeField {

  options.checkType = (value: any): void => {
    if (!(value instanceof DateTime) || !value.isValid) {
      throw new ValidationError(`Field ${options.name} must be a valid DateTime`)
    }
  }

  const {
    getDefault,
    ...rest
  } = baseFieldFactory<number, DateTime, number>(options)

  function fromDb(value: number | null | undefined): DateTime | undefined {
    if (value === undefined || value === null) {
      return getDefault()
    }

    // Truncate the number value because the fromMillis only works with integer
    // values.
    return DateTime.fromMillis(Math.trunc(value))
  }

  function toDb(value: DateTime | undefined): number | undefined {
    if (!value) {
      return undefined
    }

    return value.toMillis()
  }

  function fromApi(value: number | null | undefined): DateTime | undefined {
    if (value === undefined || value === null) {
      return getDefault()
    }

    return DateTime.fromMillis(Math.trunc(value))
  }

  function toApi(value: DateTime | undefined): number | undefined {
    if (!value) {
      return undefined
    }

    return value.toMillis()
  }

  return {
    ...rest,
    getDefault,
    fromDb,
    toDb,
    fromApi,
    toApi,
  }
}


export {
  DateTimeField,
  DateTimeFieldOptions,
  dateTimeFieldFactory,
}
