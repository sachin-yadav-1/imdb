import type { Actor } from '../../../store/actors/types';
import type { Producer } from '../../../store/producers/types';

export const getPersonOptionLabel = (option: Actor | Producer): string => option.name;

export const isPersonOptionEqualToValue = (option: Actor | Producer, value: Actor | Producer): boolean =>
  option.id === value.id;
