export interface ChoiceItem<T extends string | number> {
  key: string,
  value: T,
  label: string,
  description?: string,
}

interface ChoiceMethods<T extends string | number> {
  getLabel: (value: T) => string,
  getKey: (value: T) => string,
  getChoices: () => T[],
  getKeys: () => string[],
  getItems: () => ChoiceItem<T>[],
  getDescription: (value: T) => string,
  isValidChoice: (value: T) => boolean,
  name: string,
  description: string,
}

export type Choices<T extends string | number> = ChoiceMethods<T>
  & { [keys: string]: any }

interface ChoicesOptions<T extends string | number> {
  items: ChoiceItem<T>[],
  name: string,
  description?: string,
}

/**
 * Creates a new Choices object.
 */
export function choicesFactory<T extends string | number>({
  items,
  name,
  description = '',
}: ChoicesOptions<T>): Choices<T> {
  const _choiceMap: Record<string, T> = {}
  const _keyMap: Record<string | number, string> = {}
  const _labelMap: Record<string | number, string> = {}
  const _descriptionMap: Record<string | number, string> = {}
  const _choices: T[] = []

  items.forEach(({ key, value, label, description: itemDescription }) => {
    _choiceMap[key] = value
    _labelMap[value] = label
    _keyMap[value] = key
    _descriptionMap[value] = itemDescription ?? ''
    _choices.push(value)
  })

  function getLabel(value: T): string {
    return _labelMap[value]
  }

  function getKey(value: T): string {
    return _keyMap[value]
  }

  function getChoices(): T[] {
    return _choices
  }

  function getItems(): ChoiceItem<T>[] {
    return items
  }

  function getKeys(): string[] {
    return Object.keys(_choiceMap)
  }

  function getDescription(value: T): string {
    return _descriptionMap[value]
  }

  function isValidChoice(value: T): boolean {
    return _choices.includes(value)
  }

  return {
    getLabel,
    getChoices,
    getItems,
    getKey,
    getKeys,
    getDescription,
    isValidChoice,
    name,
    description,
    ..._choiceMap,
  }
}
