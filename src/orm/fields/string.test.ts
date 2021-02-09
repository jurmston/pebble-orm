import { stringFieldFactory } from './string'


describe('stringFieldFactory', () => {
  it('should not explode', () => {
    stringFieldFactory({
      name: 'test',
    })
  })

  it('should throw when validating non-strings', () => {
    const field = stringFieldFactory({
      name: 'test',
    })

    expect(() => {
      field.validate(123)
    }).toThrow()

    expect(() => {
      field.validate(true)
    }).toThrow()

    expect(() => {
      field.validate(undefined)
    }).toThrow()

    expect(() => {
      field.validate(null)
    }).toThrow()

    expect(() => {
      field.validate({})
    }).toThrow()
  })

  it('should serialize correctly', () => {
    const field = stringFieldFactory({
      name: 'test',
    })

    expect(field.toDb('test')).toBe('test')
    expect(field.toDb(undefined)).toBeUndefined()
    expect(field.toApi('test')).toBe('test')
    expect(field.toApi(undefined)).toBeUndefined()
  })

  it('should deserialize correctly', () => {
    const field = stringFieldFactory({
      name: 'test',
    })

    expect(field.fromDb('test')).toBe('test')
    expect(field.fromDb(undefined)).toBeUndefined()
    expect(field.fromDb(null)).toBeUndefined()
    expect(field.fromApi('test')).toBe('test')
    expect(field.fromApi(undefined)).toBeUndefined()
    expect(field.fromApi(null)).toBeUndefined()
  })
})
