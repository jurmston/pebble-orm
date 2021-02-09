class GeneralError extends Error {
  constructor(message: any) {
    super()
    this.message = message
  }
}

class FieldError extends GeneralError {}
class ParseError extends GeneralError {}
class ModelError extends GeneralError {}
class ValidationError extends GeneralError {}


export {
  FieldError,
  GeneralError,
  ModelError,
  ValidationError,
  ParseError,
}
