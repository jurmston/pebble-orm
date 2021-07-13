import { FieldError, ValidationError } from '../errors'
import { Field, FieldOptions } from './base'
import {
  Model,
  ApiPayload,
  DbRecord,
  ModelInstance,
} from '../models'


interface Submodel extends Field<DbRecord, ModelInstance, ApiPayload> {}
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
    throw new FieldError('Submodel field must have a model.')
  }

  if (!options.model.isSubmodel) {
    throw new FieldError('Submodel must have isSubmodel = true')
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

    options.model?.validate(value)
  }

  function fromDb(value: DbRecord | null | undefined): ModelInstance | undefined  {
    if (value === undefined || value === null) {
      return undefined
    }

    return options.model!.fromDb('', value)
  }

  function toDb(value: ModelInstance | undefined): DbRecord | undefined {
    if (value === undefined) {
      return undefined
    }

    return options.model!.toDb(value)
  }

  function fromApi(value: ApiPayload | null | undefined): ModelInstance | undefined {
    if (value === undefined || value === null) {
      return undefined
    }

    return options.model!.fromApi(value)
  }

  function toApi(value: ModelInstance | undefined): ApiPayload | undefined {
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
