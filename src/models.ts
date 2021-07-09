import { ValidationError } from './errors'

export type ModelInstance = Record<string, any>
export type DbRecord = Record<string, any>
export type ApiPayload = Record<string, any>


export interface ModelOptions {
  name: string,
  fields: any[],
  collection: string,
  description?: string,
  idFieldName?: string,
}

export interface Model {
  collection: string,
  create: (record: DbRecord) => ModelInstance,
  description: string,
  deserializeFromApi: (payload: Partial<ApiPayload>) => Partial<ModelInstance>,
  deserializeFromDb: (record: Partial<DbRecord>) => Partial<ModelInstance>,
  extractFields: (instance: ModelInstance, fields: string[]) => Partial<ModelInstance>,
  fromApi: (data: ApiPayload) => ModelInstance,
  fromDb: (idValue: any, record: DbRecord) => ModelInstance,
  getField: (field: string) => any,
  getFields: () => any[],
  name: string,
  serializeToApi: (instance: Partial<ModelInstance>) => Partial<ApiPayload>
  serializeToDb: (instance: Partial<ModelInstance>) => Partial<DbRecord>,
  toApi: (instance: ModelInstance) => ApiPayload,
  toDb: (instance: ModelInstance) => DbRecord,
  validate: (instance: ModelInstance) => void,
}

export function modelFactory({
  name = '',
  collection = '',
  fields = [],
  description = '',
  idFieldName = 'id',
}: ModelOptions): Model {
  const _fields: Record<string, any> = {}

  fields.forEach(field => {
    _fields[field.name] = field
  })

  /**
   * Retrievies a list of the model's field objects.
   */
  function getFields(): any[] {
    return Object.values(_fields)
  }

  /**
   * Retrieves a single model field by name.
   * @param field The name of the field to be retrieved.
   */
  function getField(field: string): any {
    return _fields[field]
  }


  function _convertModelFormat<FromFormat, ToFormat>(
    method: 'fromDb' | 'toDb' | 'fromApi' | 'toApi',
    modelObj: FromFormat,
    fieldMask: string[] | null = null,
  ): Partial<ToFormat> {
    // Extract the field names to be used.
    const fieldNames = fieldMask !== null
      ? fieldMask
      : Object.keys(_fields)

    // Iterate over the field names, storing the transformed results into a new object.
    // Undefined and null values are excluded from the result.
    return fieldNames.reduce((result: Partial<ToFormat>, fieldName: string): Partial<ToFormat> => {
      // Check that the fieldName is included in the fields. If not, ignore it.
      if (!_fields[fieldName]) {
        return result
      }

      const fromValue = (modelObj as any)?.[fieldName]

      const toValue = _fields[fieldName]?.[method](fromValue)

      // Undefined or null values are not included in the payload.
      if (toValue === undefined || toValue === null) {
        return result
      }

      (result as any)[fieldName] = toValue

      return result
    }, {})
  }


  /**
   * Converts a record stored in the database to a ModelInstance.
   * @param record An object from the database
   * @param fieldMask An optional list of field names to create a partial instance.
   */
  function deserializeFromDb(record: DbRecord, fieldMask: string[] | null = null): Partial<ModelInstance> {
    return _convertModelFormat<DbRecord, ModelInstance>('fromDb', record, fieldMask)
  }

  /**
   * Convert a Firestore Database record into a ModelInstance.
   * @param record The data object from the firestore document data.
   * @param idValue
   */
  function fromDb(idValue: any = null, record: DbRecord): ModelInstance {
    if (idFieldName && idValue !== null) {
      record[idFieldName] = idValue
    }

    const instance = deserializeFromDb(record)
    return instance
  }


  /**
   * Serializes a ModelInstance to a DbRecord
   * @param instance The instance to be serialized
   * @param fieldMask An optinal list of field names that will create a partial record.
   */
  function serializeToDb(instance: ModelInstance, fieldMask: string[] | null = null): Partial<DbRecord> {
    return _convertModelFormat<ModelInstance, DbRecord>('toDb', instance, fieldMask)
  }


  /**
   * Converts the fields of a `ModelInstance` into a `DbRecord`
   * @param instance
   */
  function toDb(instance: ModelInstance): DbRecord {
    const valuesToSerialize = { ...instance }

    // Remove the id field, if it's present.
    if (idFieldName) {
      delete valuesToSerialize[idFieldName]
    }

    return serializeToDb(valuesToSerialize)
  }


  function deserializeFromApi(payload: Partial<ApiPayload>, fieldMask: string[] | null = null): Partial<ModelInstance> {
    return _convertModelFormat<ApiPayload, ModelInstance>('fromApi', payload, fieldMask)
  }

  /**
   * Creates a complete ModelInstance from an ApiPayload
   * @param payload
   */
  function fromApi(payload: ApiPayload): ModelInstance {
    return deserializeFromApi(payload)
  }

  function serializeToApi(instance: Partial<ModelInstance>, fieldMask: string[] | null = null): Partial<ApiPayload> {
    return _convertModelFormat<ModelInstance, ApiPayload>('toApi', instance, fieldMask)
  }

  /**
   * Serializes a `ModelInstance` into a JSON serializable object.
   * @param instance
   */
  function toApi(instance: ModelInstance): ApiPayload {
    return serializeToApi(instance)
  }

  /**
   * Validates a `ModelInstance`
   * @param instance
   * @param partial
   */
  function validate(instance: ModelInstance): void {
    // Ensure that all the keys in the instance are valid.

    Object.keys(instance).forEach(fieldName => {
      if (!_fields[fieldName]) {
        throw new ValidationError(`Invalid field: ${fieldName}`)
      }
    })

    Object.values(_fields).forEach((field: any) => {
      const value = instance[field.name]

      if (value === undefined) {
        if (field.isRequired) {
          throw new ValidationError(`Field "${field.name}" is reqired.`)
        }

        return
      }

      field.validate(value)
    })
  }

  /**
   * Creates a new model instance.
   * @param initialValues An optional map of initial field values.
   */
  function create(initialValues: Partial<ModelInstance> = {}): ModelInstance {
    const instance = Object.values(_fields).reduce((result, field) => {
      result[field.name] = initialValues[field.name] ?? field.getDefault()
      return result
    }, {})

    return instance
  }

  /**
   * Extracts a partial model instance using a fieldMask
   * @param instance
   * @param fieldNames
   */
  function extractFields(instance: ModelInstance, fieldMask: string[]): Partial<ModelInstance> {
    return fieldMask.reduce((result: ModelInstance, fieldName: any) => {
      const field = _fields[fieldName]

      if (!field) {
        throw new Error(`Invalid field name: ${fieldName}`)
      }

      result[field.name] = instance[field.name] ?? field.getDefault()
      return result
    }, {})
  }

  return {
    create,
    collection,
    description,
    deserializeFromApi,
    deserializeFromDb,
    extractFields,
    fromApi,
    fromDb,
    getField,
    getFields,
    name,
    serializeToApi,
    serializeToDb,
    toApi,
    toDb,
    validate,
  }
}
