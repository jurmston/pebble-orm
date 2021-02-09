import {
  ModelInstance,
  dateTimeFieldFactory,
  modelFactory,
  stringFieldFactory,
  numberFieldFactory,
  booleanFieldFactory,
  imageFieldFactory,
  arrayFieldFactory,
  submodelFieldFactory,
} from '../orm'

import {
  ProgramCategories,
  VisibilityTypes,
  ExperienceLevels,
  LocationTypes,
  DurationTypes,
  ProgramCostTypes,
  RegistrationStatuses,
  RegistrationTypes,
  PublicationStatuses,
} from './choices'

import {
  isValidJson,
  noEmptyString,
} from './validators'

import {
  createTimestampFields,
  createAddressFields,
  createGeoPointFields,
} from './mixins'

import { SurveyQuestion } from './surveys'
import { User } from '../users'


// Subcollection on programs
export const ProgramAgreement = modelFactory({
  name: 'ProgramAgreement',
  description: 'An agreement clause for a program.',
  tags: ['Programs'],
  fields: [
    stringFieldFactory({
      name: 'title',
      allowNull: false,
      defaultValue: '',
    }),

    stringFieldFactory({
      name: 'text',
      allowNull: false,
      defaultValue: '',
    }),
  ],
})



export const Program = modelFactory({
  name: 'Program',
  collection: 'programs',
  description: 'A program or event',
  tags: ['Programs'],
  fields: [
    ...createTimestampFields(),

    stringFieldFactory({
      name: 'ownerId',
    }),

    stringFieldFactory({
      name: 'orgId',
    }),

    stringFieldFactory({
      name: 'status',
      allowNull: false,
      choices: PublicationStatuses.getChoices(),
      defaultValue: PublicationStatuses.DRAFT,
    }),

    // Basic Info
    stringFieldFactory({
      name: 'name',
      allowNull: false,
      validators: [noEmptyString],
      defaultValue: '',
    }),

    stringFieldFactory({
      name: 'category',
      allowNull: false,
      choices: ProgramCategories.getChoices(),
      customSchema: { '$ref': '#/components/schemas/ProgramCategories' },
    }),

    stringFieldFactory({
      name: 'experienceLevel',
      allowNull: false,
      choices: ExperienceLevels.getChoices(),
      defaultValue: ExperienceLevels.ALL,
    }),

    stringFieldFactory({
      name: 'visibility',
      allowNull: false,
      choices: VisibilityTypes.getChoices(),
      defaultValue: VisibilityTypes.PRIVATE,
    }),

    // Location
    ...createAddressFields(),
    ...createGeoPointFields(),

    stringFieldFactory({
      name: 'locationType',
      allowNull: false,
      choices: LocationTypes.getChoices(),
      defaultValue: LocationTypes.TBD,
    }),

    stringFieldFactory({
      name: 'locationName',
      allowNull: false,
      defaultValue: '',
    }),

    stringFieldFactory({
      name: 'locationDescription',
      allowNull: false,
      defaultValue: '',
    }),

    stringFieldFactory({
      name: 'virtualLink',
      allowNull: false,
      defaultValue: '',
    }),

    // Date and Time
    dateTimeFieldFactory({
      name: 'start',
    }),

    dateTimeFieldFactory({
      name: 'end',
    }),

    stringFieldFactory({
      name: 'timezone',
    }),

    stringFieldFactory({
      name: 'durationType',
      allowNull: false,
      defaultValue: DurationTypes.SINGLE,
      choices: DurationTypes.getChoices(),
    }),

    // Content
    imageFieldFactory({
      name: 'headerImage',
    }),

    stringFieldFactory({
      name: 'description',
      allowNull: false,
      defaultValue: '',
    }),

    stringFieldFactory({
      name: 'listingContent',
      allowNull: false,
      defaultValue: '[]',
      validators: [isValidJson],
    }),

    // Agreement
    arrayFieldFactory({
      name: 'agreements',
      subField: submodelFieldFactory({
        name: 'agreement',
        model: ProgramAgreement,
      }),
    }),

    // Registration Settings
    stringFieldFactory({
      name: 'registrationType',
      allowNull: false,
      defaultValue: RegistrationTypes.OPEN,
      choices: RegistrationTypes.getChoices(),
    }),

    stringFieldFactory({
      name: 'costType',
      allowNull: false,
      defaultValue: ProgramCostTypes.FREE,
      choices: ProgramCostTypes.getChoices(),
    }),

    numberFieldFactory({
      name: 'cost',
      description: 'For DONATION type events this represents the suggested dontation.',
      allowNull: false,
      defaultValue: 0,
    }),

    numberFieldFactory({
      name: 'fee',
      description: 'For PAID programs only, the amount of the payment processing fee.',
      allowNull: false,
      defaultValue: 0,
    }),

    booleanFieldFactory({
      name: 'includeFeeInCost',
      defaultValue: false,
    }),


    // TODO: add application fee
    booleanFieldFactory({
      name: 'hasAttendeeLimit',
      defaultValue: false,
    }),

    numberFieldFactory({
      name: 'maxAttendees',
      description: 'Maximum amount of confirmed registrations.',
      allowNull: false,
      defaultValue: 0,
    }),

    stringFieldFactory({
      name: 'registrationEmailText',
      allowNull: false,
      defaultValue: '',
    }),

    arrayFieldFactory({
      name: 'questions',
      description: 'Allows the teacher to ask additional questions to gather info for the program.',
      subField: submodelFieldFactory({
        name: 'question',
        model: SurveyQuestion,
      }),
    }),
  ],
})


// Id = `userId__programId`
export const Registration = modelFactory({
  name: 'Registration',
  collection: 'registrations',
  description: '',
  tags: ['Programs'],
  fields: [
    ...createTimestampFields(),

    stringFieldFactory({
      name: 'userId',
      allowNull: false,
    }),

    stringFieldFactory({
      name: 'programId',
      allowNull: false,
    }),

    stringFieldFactory({
      name: 'status',
      allowNull: false,
      defaultValue: RegistrationStatuses.DRAFT,
      choices: RegistrationStatuses.getChoices(),
    }),

    // Contact Information
    // This info should be pulled for the user profile, but can be overidden on
    // the registration form.
    stringFieldFactory({
      name: 'fullName',
      allowNull: false,
    }),

    stringFieldFactory({
      name: 'email',
      allowNull: false,
      defaultValue: '',
    }),

    stringFieldFactory({
      name: 'phoneNumber',
      allowNull: false,
      defaultValue: '',
    }),

    booleanFieldFactory({
      name: 'teacherCanViewContactInfo',
      allowNull: false,
      defaultValue: true,
    }),

    // Billing Address
    stringFieldFactory({
      name: 'billingFormattedAddress',
      allowNull: false,
      defaultValue: '',
    }),

    stringFieldFactory({
      name: 'signatureName',
      allowNull: false,
      validators: [noEmptyString],
    }),

    stringFieldFactory({
      name: 'signatureDate',
      allowNull: false,
      validators: [noEmptyString],
    }),

    arrayFieldFactory({
      name: 'answers',
      subField: stringFieldFactory({
        name: 'answer',
      }),
      validators: [/* TODO: add validator to match questions length */],
      description: 'List of answers to the registration questions.',
    }),
  ],
})


// Id should be `programId__userId
export const ProgramManager = modelFactory({
  name: 'ProgramManager',
  collection: 'programManagers',
  description: '',
  tags: ['Programs'],
  fields: [
    ...createTimestampFields(),

    stringFieldFactory({
      name: 'programId',
      allowNull: false,
      validators: [noEmptyString],
    }),

    stringFieldFactory({
      name: 'userId',
      allowNull: false,
      validators: [noEmptyString],
    }),

    booleanFieldFactory({
      name: 'isTeacher',
      allowNull: false,
      defaultValue: false,
    }),

    booleanFieldFactory({
      name: 'isAdmin',
      allowNull: false,
      defaultValue: false,
    }),
  ],
})


export function createRegistrationForProgram(program: ModelInstance, user: User) {
  const registrationId = `${user.id}__${program.id}`

  const registration = Registration.fromDb(registrationId, {
    programId: program.id,
    userId: user.id,
    fullName: user.name,
    email: user.email,
    phoneNumber: user.phoneNumber,
    answers: program.questions.map(() => ''),
  })

  return registration
}