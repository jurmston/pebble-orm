import { DateTime } from 'luxon'
import { dateFieldFactory } from './date'


describe('dateFieldFactory', () => {
  it('should not explode', () => {
    dateFieldFactory({
      name: 'test',
    })
  })

  it('should throw when validating non-date-times', () => {
    const field = dateFieldFactory({
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
    const field = dateFieldFactory({
      name: 'test',
    })

    expect(() => {
      field.validate(DateTime.fromISO('2020-13-01'))
    }).toThrow()

    expect(() => {
      field.validate(DateTime.fromISO('2020-01-32'))
    }).toThrow()

    expect(() => {
      // Beware the leap day!
      field.validate(DateTime.fromISO('2021-02-29'))
    }).toThrow()
  })

  it('should serialize correctly', () => {
    const field = dateFieldFactory({
      name: 'test',
    })

    const local = DateTime.local()

    expect(field.toDb(local)).toBe(local.toISODate())
    expect(field.toDb(DateTime.fromISO('2021-02-02'))).toBe('2021-02-02')
    expect(field.toDb(undefined)).toBeUndefined()
    
    expect(field.toApi(local)).toBe(local.toISODate())
    expect(field.toApi(DateTime.fromISO('2021-02-02'))).toBe('2021-02-02')
    expect(field.toApi(undefined)).toBeUndefined()
  })

  it('should deserialize correctly', () => {
    const field = dateFieldFactory({
      name: 'test',
    })

    expect(field.fromDb('2021-02-02')).toEqual(DateTime.fromISO('2021-02-02'))
    expect(field.fromDb(undefined)).toBeUndefined()
    expect(field.fromDb(null)).toBeUndefined()

    expect(field.fromApi('2021-02-02')).toEqual(DateTime.fromISO('2021-02-02'))
    expect(field.fromApi(undefined)).toBeUndefined()
    expect(field.fromApi(null)).toBeUndefined()
  })
})
