import {
  createTimestampFields,
} from './mixins'

import {
  modelFactory,
  stringFieldFactory,
  numberFieldFactory,
} from '../orm'


export const File = modelFactory({
  name: 'File',
  collection: 'files',
  tags: ['Common'],
  fields: [
    ...createTimestampFields(),

    stringFieldFactory({
      name: 'ownerId',
      allowNull: false,
    }),

    stringFieldFactory({
      name: 'rootRef',
      allowNull: false,
    }),

    stringFieldFactory({
      name: 'relatedRef',
      allowNull: false,
    }),

    stringFieldFactory({
      name: 'name',
      allowNull: false,
      defaultValue: '',
    }),

    stringFieldFactory({
      name: 'description',
      allowNull: false,
      defaultValue: '',
    }),

    stringFieldFactory({
      name: 'url',
      allowNull: false,
      defaultValue: '',
    }),

    numberFieldFactory({
      name: 'size',
      allowNull: false,
      defaultValue: 0,
    }),

    numberFieldFactory({
      name: 'downloadCount',
      allowNull: false,
      defaultValue: 0,
    }),
  ],
})


export const Image = modelFactory({
  name: 'Image',
  collection: 'images',
  tags: ['Common'],
  fields: [
    ...createTimestampFields(),

    stringFieldFactory({
      name: 'ownerId',
    }),

    stringFieldFactory({
      name: 'rootRef',
    }),

    stringFieldFactory({
      name: 'relatedRef',
    }),

    stringFieldFactory({
      name: 'name',
      allowNull: false,
      defaultValue: '',
    }),

    stringFieldFactory({
      name: 'description',
      allowNull: false,
      defaultValue: '',
    }),

    stringFieldFactory({
      name: 'originalUrl',
      defaultValue: '',
      allowNull: false,
    }),

    stringFieldFactory({
      name: 'croppedUrl',
      defaultValue: '',
      allowNull: false,
    }),

    stringFieldFactory({
      name: 'thumbnailUrl',
      defaultValue: '',
      allowNull: false,
    }),
  ],
})
