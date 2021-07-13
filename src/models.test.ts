import { modelFactory, Model } from './models'
import { stringFieldFactory } from './fields/string'


let TestModel: Model | null = null

beforeAll(() => {
  TestModel = modelFactory({
    name: 'Test',
    collection: 'tests',
    fields: [
      stringFieldFactory({
        name: 'name',
        isRequired: true,
        defaultValue: '',
      }),

      stringFieldFactory({
        name: 'testDefault',
        defaultValue: '',
      }),

      stringFieldFactory({
        name: 'test',
      }),
    ]
  })
})

describe('modelFactory', () => {
  it('should not explode', () => {
    const Test = modelFactory({
      name: 'test',
      collection: 'test',
      fields: [
        stringFieldFactory({
          name: 'name',
          isRequired: true,
        })
      ],
    })

    expect(Test.name).toBe('test')
  })

  it('should create an instance correctly', () => {
    const instance = TestModel?.create({ id: '123', name: 'test' })

    expect(instance).toEqual({
      id: '123',
      name: 'test',
      testDefault: '',
    })
  })

  it('should deserialize from db correctly', () => {
    const instance = TestModel?.fromDb('123', {
      name: 'test',
      test: undefined,  // undefined values should be removed.
    })

    expect(instance).toEqual({
      name: 'test',
      testDefault: '',
      id: '123',
    })
  })

  it('should serialize to the db correctly', () => {
    const record = TestModel?.toDb({
      name: 'test',
      id: '123',
    })

    expect(record).toEqual({
      name: 'test',
    })
  })

  it('should deserialize from the api correctly', () => {
    const record = TestModel?.fromApi({
      name: 'test',
      id: '123',
      test: undefined,
    })

    expect(record).toEqual({
      name: 'test',
      id: '123',
      testDefault: '',
    })
  })

  it('should serialize to the api correctly', () => {
    const record = TestModel?.toApi({
      name: 'test',
      id: '123',
    })

    expect(record).toEqual({
      name: 'test',
      id: '123',
    })
  })

  it('should create new instances correctly', () => {
    const instance = TestModel?.create({
      name: 'test',
    })

    expect(instance).toEqual({
      name: 'test',
      testDefault: '',
    })
  })

  it('should throw when validating an instance with extra field', () => {
    expect(() => {
      TestModel?.validate({
        id: '123',
        name: 'test',
        extra: 'stuff',
      })
    }).toThrow()
  })

  it('should throw when validating an instance missing required field', () => {
    expect(() => {
      TestModel?.validate({
        id: '123',
      })
    }).toThrow()
  })

  it('should throw when validating an instance has invalid field type', () => {
    expect(() => {
      TestModel?.validate({
        id: '123',
        name: 'test',
        test: 123,
      })
    }).toThrow()
  })

  it('should throw when the id field is included in fields', () => {
    expect(() => {
      modelFactory({
        name: 'test',
        collection: 'test',
        fields: [
          stringFieldFactory({
            name: 'id',
            isRequired: true,
          })
        ],
      })
    }).toThrow()
  })

  it('should throw when a non-string is passed as an ID', () => {
    expect(() => {
      TestModel?.validate({
        id: 34,
        name: 'test',
        test: 123,
      })
    }).toThrow()
  })

})