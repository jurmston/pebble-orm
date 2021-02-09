import { GeoPoint } from './geo-point'


describe('GeoPoint', () => {
  it('should not explode', () => {
    new GeoPoint(0, 0)
  })

  it('should throw Error if latitude or longitude are invalid', () => {
    expect(() => {
      new GeoPoint(-100, 0)
    }).toThrow(Error)

    expect(() => {
      new GeoPoint(0, -200)
    }).toThrowError(Error)

    expect(() => {
      new GeoPoint(100, 0)
    }).toThrow(Error)

    expect(() => {
      new GeoPoint(0, 200)
    }).toThrowError(Error)
  })

  it('should construct the correct values', () => {
    const latitude = 39.61183562342277
    const longitude = -120.63239853348283
    const expectedGeohash = '9r41qgn5t'

    const geopoint = new GeoPoint(latitude, longitude)

    expect(geopoint.latitude).toBeCloseTo(latitude)
    expect(geopoint.longitude).toBeCloseTo(longitude)
    expect(geopoint.geohash).toBe(expectedGeohash)
  })

  it('should serialize correctly', () => {
    const latitude = 39.61183562342277
    const longitude = -120.63239853348283
    const expectedGeohash = '9r41qgn5t'

    const geopoint = new GeoPoint(latitude, longitude)

    const expectedSerializedGeopoint = {
      latitude,
      longitude,
      geohash: expectedGeohash,
    }

    expect(geopoint.serialize()).toEqual(expectedSerializedGeopoint)
  })
})

