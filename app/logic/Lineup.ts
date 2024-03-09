import { DoublesPairing } from './DoublesPairing';

export interface Lineup<T> {
  activePlayers: T[];
  inactivePlayers: T[];
  variations: DoublesPairing<{ position: number; value: T }>[][];
}
