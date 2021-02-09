import { baseFieldFactory } from './base'


describe('baseFieldFactory', () => {
  it('should not explode', () => {
    baseFieldFactory({
      name: 'test',
      checkType: value => { return },
    })
  })

  it('should return undefined when no defaultValue provided', () => {
    const field = baseFieldFactory({
      name: 'test',
      checkType: value => { return },
    })

    expect(field.getDefault()).toBeUndefined()
  })

  it('should returned correct default value', () => {
    const field1 = baseFieldFactory({
      name: 'test',
      defaultValue: 'test',
      checkType: value => { return },
    })

    expect(field1.getDefault()).toBe('test')

    const field2 = baseFieldFactory({
      name: 'test',
      defaultValue: () => 'test',
      checkType: value => { return },
    })

    expect(field2.getDefault()).toBe('test')
  })
})
