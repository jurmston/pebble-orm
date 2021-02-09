import { FieldError, ValidationError } from '../errors'
import { Field, FieldOptions } from './base'
import {
  Model,
  SerializedModelInstance,
  DbRecord,
  ModelInstance,
} from '../models'


interface Submodel extends Field<DbRecord, ModelInstance, SerializedModelInstance> {}
interface SubmodelOptions extends FieldOptions<ModelInstance> {
  model: Model,
}


/**
 */
function submodelFieldFactory(options: SubmodelOptions): Submodel {
  if (!options.name) {
    throw new FieldError('Field must have a name.')
  }

  if (!options.model) {
    throw new FieldError('Map field must have a model.')
  }

  function getDefault(): ModelInstance | undefined {
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
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      throw new ValidationError(`Field "${options.name}" must be a map`)
    }

    options.model?.validate(value, false)
  }

  function fromDb(value: DbRecord | null | undefined): ModelInstance | undefined  {
    if (value === undefined || value === null) {
      return undefined
    }

    return options.model!.fromDb(value)
  }

  function toDb(value: ModelInstance | undefined): DbRecord | undefined {
    if (value === undefined) {
      return undefined
    }

    return options.model!.toDb(value, false)
  }

  function fromApi(value: SerializedModelInstance | null | undefined): ModelInstance | undefined {
    if (value === undefined || value === null) {
      return undefined
    }

    return options.model!.fromApi(value, false)
  }

  function toApi(value: ModelInstance | undefined): SerializedModelInstance | undefined {
    if (value === undefined) {
      return undefined
    }

    return options.model!.toApi(value)
  }

  return {
    name: options.name,
    isRequired: options.isRequired || false,
    getDefault,
    validate,
    fromDb,
    toDb,
    fromApi,
    toApi,
  }

}


export {
  Submodel,
  SubmodelOptions,
  submodelFieldFactory,
}
