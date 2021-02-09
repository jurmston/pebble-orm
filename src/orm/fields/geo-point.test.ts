import ngeohash from 'ngeohash'
import { GeoPoint } from '../geo-point'
import { geoPointFieldFactory } from './geo-point'


describe('geoPointFieldFactory', () => {
  it('should not explode', () => {
    geoPointFieldFactory({
      name: 'test',
    })
  })

  it('should throw when validating non-geo-points', () => {
    const field = geoPointFieldFactory({
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

  it('should serialize correctly', () => {
    const field = geoPointFieldFactory({
      name: 'test',
    })

    const latitude = 39.46499122998108
    const longitude = -119.80543741484055
    const geoPoint = new GeoPoint(latitude, longitude)
    const geohash = ngeohash.encode(latitude, longitude)

    const serialized = {
      latitude,
      longitude,
      geohash,
    }

    expect(field.toDb(geoPoint)).toEqual(serialized)
    expect(field.toDb(undefined)).toBeUndefined()
    
    expect(field.toApi(geoPoint)).toEqual(serialized)
    expect(field.toApi(undefined)).toBeUndefined()
  })

  it('should deserialize correctly', () => {
    const field = geoPointFieldFactory({
      name: 'test',
    })

    const latitude = 39.46499122998108
    const longitude = -119.80543741484055
    const geoPoint = new GeoPoint(latitude, longitude)
    const geohash = ngeohash.encode(latitude, longitude)

    const serialized = {
      latitude,
      longitude,
      geohash,
    }

    expect(field.fromDb(serialized)?.serialize()).toEqual(geoPoint.serialize())
    expect(field.fromDb(undefined)).toBeUndefined()
    expect(field.fromDb(null)).toBeUndefined()

    expect(field.fromApi(serialized)?.serialize()).toEqual(geoPoint.serialize())
    expect(field.fromApi(undefined)).toBeUndefined()
    expect(field.fromApi(null)).toBeUndefined()
  })
})
