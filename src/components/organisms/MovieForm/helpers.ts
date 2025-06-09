import type { Actor } from '../../../store/actors/types';
import type { Producer } from '../../../store/producers/types';

export const getPersonOptionLabel = (option: unknown): string => {
  const person = option as Actor | Producer;
  return person.name;
};

export const isPersonOptionEqualToValue = (option: unknown, value: unknown): boolean => {
  const optionPerson = option as Actor | Producer;
  const valuePerson = value as Actor | Producer;
  return optionPerson.id === valuePerson.id;
};
