import { FieldError, ValidationError } from '../errors'
import { Field, FieldOptions } from './base'


type MapFieldType = Record<string, any>

interface MapField extends Field<MapFieldType, MapFieldType, MapFieldType> {}
interface MapFieldOptions extends FieldOptions<MapFieldType> {
  subField: any,
}

function mapFieldFactory(options: MapFieldOptions): MapField {
  if (!options.name) {
    throw new FieldError('Field must have a name.')
  }

  if (!options.subField) {
    throw new FieldError('Map field must have a subfield.')
  }

  function getDefault(): MapFieldType | undefined {
    if (typeof options.defaultValue === 'function') {
      return (options.defaultValue())
    }

    if (options.defaultValue) {
      return options.defaultValue
    }

    return undefined
  }

  function validate(value: any): void {
    // Explicitly check for `null` since `typeof null` is "object"
    // We are also explicity forbidding arrays
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      throw new ValidationError(`Field "${options.name}" must be a map`)
    }

    // Validate individual key-value pairs
    Object.values(value).forEach(subvalue => {
      options.subField.validate(subvalue)
    })
  }

  const applySubfieldToMap = (method: any) => (value: MapFieldType | undefined) => {
    if (value === undefined) {
      return undefined
    }

    return Object.entries(value).reduce((result: any, [key, subvalue]) => {
      result[key] = method(subvalue)
      return result
    }, {})
  }

  const applySubfieldFromMap = (method: any) => (value: MapFieldType | undefined | null) => {
    if (value === undefined || value === null) {
      return undefined
    }

    return Object.entries(value).reduce((result: any, [key, subvalue]) => {
      result[key] = method(subvalue)
      return result
    }, {})
  }

  return {
    name: options.name,
    getDefault,
    validate,
    isRequired: options.isRequired ?? false,
    fromDb: applySubfieldFromMap(options.subField.fromDb),
    fromApi: applySubfieldFromMap(options.subField.fromApi),
    toDb: applySubfieldToMap(options.subField.toDb),
    toApi: applySubfieldToMap(options.subField.toApi),
  }

}


export {
  MapField,
  MapFieldOptions,
  mapFieldFactory,
}
