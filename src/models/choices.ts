import { choicesFactory } from '../orm'

export const TestChoices = choicesFactory<string>({
  items: [
    { key: 'TEST', value: 'TEST', label: 'Test' },
  ],
  name: 'TestChoices',
  type: 'string',
  description: '',
})
