import {
  modelFactory,
  stringFieldFactory,
  arrayFieldFactory,
  dateTimeFieldFactory,
  imageFieldFactory,
} from '../orm'

import {
  createAddressFields,
  createGeoPointFields,
  createTimestampFields,
} from './mixins'

import {
  FocusChoices,
  ProgramCategories,
  ParticipantExperienceLevels,
} from './choices'

import { noDuplicateArrayItems } from './validators'


export const UserProfile = modelFactory({
  name: 'UserProfile',
  collection: 'userProfiles',
  fields: [
    ...createTimestampFields(),

    stringFieldFactory({
      name: 'fullName',
      allowNull: false,
      defaultValue: '',
    }),

    // This value should be synced with the User.name value.
    stringFieldFactory({
      name: 'displayName',
      allowNull: false,
      defaultValue: '',
    }),

    stringFieldFactory({
      name: 'pronouns',
      allowNull: false,
      defaultValue: '',
    }),


    // Teachers
    stringFieldFactory({
      name: 'photoUrl',
      allowNull: false,
      defaultValue: '',
    }),

    imageFieldFactory({
      name: 'headerImage',
    }),

    // Privacy policy and terms and conditions
    dateTimeFieldFactory({
      name: 'userTermsAcceptedOn',
    }),

    stringFieldFactory({
      name: 'userTermsAcceptedVersion',
    }),

    // Security
    dateTimeFieldFactory({
      name: 'phoneNumberVerifiedOn',
    }),

    dateTimeFieldFactory({
      name: 'phoneNumberVerifificationSentOn',
    }),

    dateTimeFieldFactory({
      name: 'emailVerifificationSentOn',
    }),

    // Location
    ...createGeoPointFields(),
    ...createAddressFields(),

    stringFieldFactory({
      name: 'timezone',
      allowNull: false,
      defaultValue: '',
    }),

    // Focuses and Interests
    arrayFieldFactory({
      name: 'focusChoices',
      subField: stringFieldFactory({
        name: 'focus',
        allowNull: false,
        choices: FocusChoices.getChoices(),
      }),
      validators: [noDuplicateArrayItems],
    }),

    arrayFieldFactory({
      name: 'programCategories',
      subField: stringFieldFactory({
        name: 'programCategory',
        allowNull: false,
        choices: ProgramCategories.getChoices(),
      }),
      validators: [noDuplicateArrayItems],
    }),

    stringFieldFactory({
      name: 'experienceLevel',
      allowNull: false,
      choices: ParticipantExperienceLevels.getChoices(),
      defaultValue: ParticipantExperienceLevels.NONE,
    }),
  ],
})


// Id = `userId__programId`
export const FavoriteProgram = modelFactory({
  name: 'FavoriteProgram',
  collection: 'favoritePrograms',
  fields: [
    ...createTimestampFields(),

    stringFieldFactory({
      name: 'programId',
      allowNull: false,
      defaultValue: '',
    }),

    stringFieldFactory({
      name: 'userId',
      allowNull: false,
      defaultValue: '',
    }),
  ],
})
