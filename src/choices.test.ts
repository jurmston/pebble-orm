import { choicesFactory } from './choices'


describe('choicesFactory', () => {
  it('should not explode', () => {
    choicesFactory({
      name: 'Test Choices',
      items: [
        { key: 'test', value: 'test', label: 'Test' },
      ],
    })
  })
})