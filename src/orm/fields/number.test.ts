import { numberFieldFactory } from './number'


describe('numberFieldFactory', () => {
  it('should not explode', () => {
    numberFieldFactory({
      name: 'test',
    })
  })

  it('should throw when validating non-numbers', () => {
    const field = numberFieldFactory({
      name: 'test',
    })

    expect(() => {
      field.validate('test')
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

    expect(() => {
      field.validate(NaN)
    }).toThrow()
  })

  it('should serialize correctly', () => {
    const field = numberFieldFactory({
      name: 'test',
    })

    expect(field.toDb(123)).toBe(123)
    expect(field.toDb(Infinity)).toBe(Infinity)
    expect(field.toDb(undefined)).toBeUndefined()

    expect(field.toApi(123)).toBe(123)
    expect(field.toApi(Infinity)).toBe(Infinity)
    expect(field.toApi(undefined)).toBeUndefined()
  })

  it('should deserialize correctly', () => {
    const field = numberFieldFactory({
      name: 'test',
    })

    expect(field.fromDb(123)).toBe(123)
    expect(field.fromDb(undefined)).toBeUndefined()
    expect(field.fromDb(null)).toBeUndefined()
    expect(field.fromDb(Infinity)).toBe(Infinity)

    expect(field.fromApi(123)).toBe(123)
    expect(field.fromApi(undefined)).toBeUndefined()
    expect(field.fromApi(null)).toBeUndefined()
    expect(field.fromApi(Infinity)).toBe(Infinity)
  })
})
