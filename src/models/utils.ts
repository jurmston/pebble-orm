import { Model } from '../orm'
import { Program } from './programs'

export function getModelByCollection(collection: string): Model {
  switch (collection) {
    case 'programs': {
      return Program
    }

    default: {
      throw new Error(`Invalid collection: ${collection}`)
    }
  }
}