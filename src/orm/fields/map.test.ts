import { DateTime } from 'luxon'
import { mapFieldFactory } from './map'
import { stringFieldFactory } from './string'
import { dateFieldFactory } from './date'


describe('mapFieldFactory', () => {
  it('should not explode', () => {
    mapFieldFactory({
      name: 'test',
      subField: stringFieldFactory({
        name: 'testString',
      }),
    })
  })

  it('should throw when validating non-maps', () => {
    const field = mapFieldFactory({
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
      field.validate([])
    }).toThrow()

    expect(() => {
      field.validate(123)
    }).toThrow()

    expect(() => {
      field.validate({
        a: 'a',
        b: 'b',
        c: 1,
      })
    }).toThrow()
  })

  it('should serialize correctly', () => {
    const field = mapFieldFactory({
      name: 'test',
      subField: dateFieldFactory({
        name: 'testDate',
      }),
    })

    const value = {
      a: DateTime.fromISO('2020-02-02'),
      b: DateTime.fromISO('2020-02-03'),
    }

    const result = {
      a: '2020-02-02',
      b: '2020-02-03'
    }

    expect(field.toDb(value)).toEqual(result)
    expect(field.toDb(undefined)).toBeUndefined()

    expect(field.toApi(value)).toEqual(result)
    expect(field.toApi(undefined)).toBeUndefined()
  })

  it('should deserialize correctly', () => {
    const field = mapFieldFactory({
      name: 'test',
      subField: dateFieldFactory({
        name: 'testString',
      }),
    })

    const value = {
      a: '2020-02-02',
      b: '2020-02-03',
    }

    const result = {
      a: DateTime.fromISO('2020-02-02'),
      b: DateTime.fromISO('2020-02-03'),
    }

    expect(field.fromDb(value)).toEqual(result)
    expect(field.fromDb(undefined)).toBeUndefined()
    expect(field.fromDb(null)).toBeUndefined()

    expect(field.fromApi(value)).toEqual(result)
    expect(field.fromApi(undefined)).toBeUndefined()
    expect(field.fromApi(null)).toBeUndefined()
  })
})
