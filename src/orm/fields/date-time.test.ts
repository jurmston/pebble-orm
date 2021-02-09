import { DateTime } from 'luxon'
import { dateTimeFieldFactory } from './date-time'


describe('dateTimeFieldFactory', () => {
  it('should not explode', () => {
    dateTimeFieldFactory({
      name: 'test',
    })
  })

  it('should throw when validating non-date-times', () => {
    const field = dateTimeFieldFactory({
      name: 'test',
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
  })

  it('should throw when validating invalid date time objects', () => {
    const field = dateTimeFieldFactory({
      name: 'test',
    })

    expect(() => {
      field.validate(DateTime.fromISO('2020-01-01T25:00'))
    }).toThrow()

    expect(() => {
      field.validate(DateTime.fromISO('2020-01-01T23:61'))
    }).toThrow()

    expect(() => {
      // Beware the leap day!
      field.validate(DateTime.fromISO('2021-02-28T23:59:61'))
    }).toThrow()
  })

  it('should serialize correctly', () => {
    const field = dateTimeFieldFactory({
      name: 'test',
    })

    const local = DateTime.local()

    expect(field.toDb(local)).toBe(local.toMillis())
    expect(field.toDb(undefined)).toBeUndefined()
    
    expect(field.toApi(local)).toBe(local.toMillis())
    expect(field.toApi(undefined)).toBeUndefined()
  })

  it('should deserialize correctly', () => {
    const field = dateTimeFieldFactory({
      name: 'test',
    })

    const local = DateTime.local()

    expect(field.fromDb(local.toMillis())).toEqual(local)
    expect(field.fromDb(undefined)).toBeUndefined()
    expect(field.fromDb(null)).toBeUndefined()

    expect(field.fromApi(local.toMillis())).toEqual(local)
    expect(field.fromApi(undefined)).toBeUndefined()
    expect(field.fromApi(null)).toBeUndefined()
  })
})
