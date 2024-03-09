export type PairingFilter<T> = {
  player1: T;
  player2: T;
};
export type InactivePairingFilter<T> = {
  filter: PairingFilter<T>;
};
