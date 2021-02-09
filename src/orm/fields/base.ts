import { FieldError, ValidationError } from '../errors'

interface Field<StorageType, FieldType, ApiType> {
  name: string,
  validate: (value: any) => void,
  fromDb: (value: StorageType | null | undefined) => FieldType | undefined,
  fromApi: (value: ApiType | null | undefined) => FieldType | undefined,
  toDb: (value: FieldType | undefined) => StorageType | undefined,
  toApi: (value: FieldType | undefined) => ApiType | undefined,
  getDefault: () => FieldType | undefined,
  isRequired: boolean,
}


interface FieldOptions<FieldType> {
  name: string,
  checkType?: (value: any) => void,
  defaultValue?: FieldType | (() => FieldType),
  choices?: FieldType[],
  description?: string,
  isRequired?: boolean,
}

function baseFieldFactory<StorageType, FieldType, ApiType>({
  name,
  checkType,
  defaultValue,
  choices,
  isRequired = false,
  description = '',
}: FieldOptions<FieldType>): Field<StorageType, FieldType, ApiType> {
  if (!name) {
    throw new FieldError('Field must have a name')
  }

  if (!checkType) {
    throw new FieldError('Field must be provided with type checker.')
  }

  function getDefault(): FieldType | undefined {
    if (typeof defaultValue === 'function') {
      return (defaultValue as (() => FieldType))()
    }

    if (defaultValue) {
      return defaultValue
    }

    return undefined
  }

  /**
   * Checks that the value of the field is valid.
   */
  function validate(value: any): void {
    checkType?.(value)

    if (choices && value && !choices.includes(value)) {
      throw new ValidationError(`Invalid choice for field "${name}": ${value}`)
    }
  }

  /**
   * Deserializes the value from StorageType to the FieldType
   * @param value Value of the field.
   */
  function fromDb(value: StorageType | null | undefined): (FieldType | undefined)  {
    if (value === undefined || value === null) {
      return getDefault()
    }

    // The base field assumes the types are the same. Each indiviual field
    // type should override this function as needed.
    const instanceValue: any = value
    return instanceValue as FieldType
  }

  /**
   * Serializes the FieldType to the StorageType
   * @param value Current field value
   */
  function toDb(value: FieldType | undefined): StorageType | undefined {
    if (value === undefined) {
      return undefined
    }

    // The base field assumes the types are the same.
    const dbValue: any = value
    return dbValue as StorageType
  }

  /**
   * Deserializes the ApiType to the FieldType
   * @param value The serialized api value
   */
  function fromApi(value: ApiType | null | undefined): (FieldType | undefined)  {
    if (value === undefined || value === null) {
      return getDefault()
    }

    // The base field assumes the types are the same.
    const instanceValue: any = value
    return instanceValue as FieldType
  }

  /**
   * Serializes the FieldType to the ApiType
   * @param value The current field value
   */
  function toApi(value: FieldType | undefined): ApiType | undefined {
    if (value === undefined) {
      return undefined
    }

    // The base field assumes the types are the same.
    const serializedValue: any = value
    return serializedValue as ApiType
  }

  return {
    name,
    validate,
    fromApi,
    fromDb,
    toDb,
    toApi,
    getDefault,
    isRequired,
  }
}

export {
  Field,
  FieldOptions,
  baseFieldFactory,
}
