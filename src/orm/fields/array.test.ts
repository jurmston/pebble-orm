import { DateTime } from 'luxon'
import { arrayFieldFactory } from './array'
import { stringFieldFactory } from './string'
import { dateFieldFactory } from './date'


describe('arrayFieldFactory', () => {
  it('should not explode', () => {
    arrayFieldFactory({
      name: 'test',
      subField: stringFieldFactory({
        name: 'testString',
      }),
    })
  })

  it('should throw when validating non-arrays', () => {
    const field = arrayFieldFactory({
      name: 'test',
      subField: stringFieldFactory({
        name: 'testString',
      }),
    })

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
      field.validate(123)
    }).toThrow()

    expect(() => {
      field.validate(['a', 'b', 3])
    }).toThrow()
  })

  it('should serialize correctly', () => {
    const field = arrayFieldFactory({
      name: 'test',
      subField: dateFieldFactory({
        name: 'testDate',
      }),
    })

    const value = [
      DateTime.fromISO('2020-02-02'),
      DateTime.fromISO('2020-02-03'),
    ]

    const result = [
      '2020-02-02',
      '2020-02-03'
    ]

    expect(field.toDb(value)).toEqual(result)
    expect(field.toDb(undefined)).toBeUndefined()

    expect(field.toApi(value)).toEqual(result)
    expect(field.toApi(undefined)).toBeUndefined()
  })

  it('should deserialize correctly', () => {
    const field = arrayFieldFactory({
      name: 'test',
      subField: dateFieldFactory({
        name: 'testString',
      }),
    })

    const value = [
      '2020-02-02',
      '2020-02-03'
    ]

    const result = [
      DateTime.fromISO('2020-02-02'),
      DateTime.fromISO('2020-02-03'),
    ]

    expect(field.fromDb(value)).toEqual(result)
    expect(field.fromDb(undefined)).toBeUndefined()
    expect(field.fromDb(null)).toBeUndefined()

    expect(field.fromApi(value)).toEqual(result)
    expect(field.fromApi(undefined)).toBeUndefined()
    expect(field.fromApi(null)).toBeUndefined()
  })
})
