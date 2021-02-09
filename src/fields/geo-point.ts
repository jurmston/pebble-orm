import { GeoPoint, SerializedGeoPoint } from '../geo-point'
import { ParseError, ValidationError } from '../errors'
import { Field, FieldOptions, baseFieldFactory } from './base'


interface GeoPointField extends Field<SerializedGeoPoint, GeoPoint, SerializedGeoPoint> {}
interface GeoPointFieldOptions extends FieldOptions<GeoPoint> {}

function geoPointFieldFactory(options: GeoPointFieldOptions): GeoPointField {
  options.checkType = (value: any) => {
    if (!(value instanceof GeoPoint)) {
      throw new ValidationError(`Field ${options.name} must be a valid GeoPoint`)
    }
  }

  const {
    getDefault,
    ...rest
  } = baseFieldFactory<GeoPoint, GeoPoint, SerializedGeoPoint>(options)

  function from(value: SerializedGeoPoint | null | undefined): GeoPoint | undefined {
    if (value === undefined || value === null) {
      return getDefault()
    }

    if (value.latitude > 90 || value.latitude < -90) {
      throw new ParseError('Latitude must be between -90 and 90')
    }

    if (value.longitude > 180 || value.longitude < -180) {
      throw new ParseError('Longitude must be between -180 and 180')
    }

    return new GeoPoint(value.latitude, value.longitude)
  }

  function to(value: GeoPoint | undefined): SerializedGeoPoint | undefined {
    return value === undefined
      ? undefined
      : (value?.serialize() || undefined)
  }

  return {
    ...rest,
    getDefault,
    fromDb: from,
    fromApi: from,
    toDb: to,
    toApi: to,
  }
}


export {
  GeoPointField,
  GeoPointFieldOptions,
  geoPointFieldFactory,
}
