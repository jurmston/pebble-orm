import { ValidationError } from '../orm/errors'


export function noEmptyString(value: string | null | undefined): void {
  if (!value) {
    throw new ValidationError('Field cannot be blank.')
  }
}


export function isValidJson(value: string | null | undefined): void {
  try {
    JSON.parse(value ?? 'null')
  } catch (error) {
    throw new ValidationError(`Invalid JSON: ${error}`)
  }
}


export function noDuplicateArrayItems(value: any[] | null | undefined): void {
  if (value) {
    if (value.length !== (new Set(value).size)) {
      throw new ValidationError('Array field cannot have duplicate items')
    }
  }
}


export function e164PhoneNumber(value: string | null | undefined): void {
  if (value) {
    if (value.match(/^\+[1-9]\d{1,14}$/)) {
      throw new ValidationError('Phone number must be in e.164 format')
    }
  }
}


export function isInteger(value: number | null | undefined): void {
  if (!Number.isInteger(value ?? 0)) {
    throw new ValidationError('Number must be an integer')
  }
}
