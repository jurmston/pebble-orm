import { DateTime } from 'luxon'
import { ValidationError } from '../errors'
import { Field, FieldOptions, baseFieldFactory } from './base'



interface DateField extends Field<string, DateTime, string> {}
interface DateFieldOptions extends FieldOptions<DateTime> {}

function dateFieldFactory(options: DateFieldOptions): DateField {
  options.checkType = (value: any): void => {
    if (!(value instanceof DateTime) || !value.isValid) {
      throw new ValidationError(`Field ${name} must be a valid DateTime`)
    }
  }

  const {
    getDefault,
    ...rest
  } = baseFieldFactory<string, DateTime, string>(options)

  function fromDb(value: string | null | undefined): DateTime | undefined {
    if (value === undefined || value === null) {
      return getDefault()
    }

    return DateTime.fromISO(value)
  }

  function toDb(value: DateTime | undefined): string | undefined {
    if (value === undefined) {
      return undefined
    }

    return value?.toISODate() || undefined
  }

  return {
    ...rest,
    getDefault,
    fromDb,
    toDb,
    fromApi: fromDb,
    toApi: toDb,
  }
}


export {
  DateField,
  DateFieldOptions,
  dateFieldFactory,
}
