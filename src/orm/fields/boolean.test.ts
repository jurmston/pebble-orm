import { booleanFieldFactory } from './boolean'


describe('booleanFieldFactory', () => {
  it('should not explode', () => {
    booleanFieldFactory({
      name: 'test',
    })
  })

  it('should throw when validating non-bools', () => {
    const field = booleanFieldFactory({
      name: 'test',
    })

    expect(() => {
      field.validate(123)
    }).toThrow()

    expect(() => {
      field.validate('123')
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
    const field = booleanFieldFactory({
      name: 'test',
    })

    expect(field.toDb(true)).toBe(true)
    expect(field.toDb(undefined)).toBeUndefined()
    expect(field.toApi(false)).toBe(false)
    expect(field.toApi(undefined)).toBeUndefined()
  })

  it('should deserialize correctly', () => {
    const field = booleanFieldFactory({
      name: 'test',
    })

    expect(field.fromDb(true)).toBe(true)
    expect(field.fromDb(undefined)).toBeUndefined()
    expect(field.fromDb(null)).toBeUndefined()
    expect(field.fromApi(false)).toBe(false)
    expect(field.fromApi(undefined)).toBeUndefined()
    expect(field.fromApi(null)).toBeUndefined()
  })
})
