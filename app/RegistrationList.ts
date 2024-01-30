export class PlayerId {
  value: string;
  public static create(id: string): PlayerId {
    return new PlayerId(id);
  }
  private constructor(value: string) {
    this.value = value;
  }
}

export interface Player {
  id: PlayerId;
  name: string;
}

export class RegistrationList {
  private registrationList: { [rank: number]: Player } = {};
  public static create(input: {
    [rank: number]: Player;
  }): RegistrationList | RegistrationListCreateError {
    const uniqueIds = new Set(
      Object.values(input).map((player) => player.id.value)
    ).size;
    if (uniqueIds !== Object.values(input).length) {
      return 'PlayerNotUnique';
    }
    return new RegistrationList(input);
  }
  private constructor(list: { [rank: number]: Player }) {
    this.registrationList = list;
  }

  addPlayer(
    rank: number,
    player: Player
  ): RegistrationList | RegistrationListAddPlayerError {
    if (this.registrationList[rank]?.id.value === player.id.value) {
      return this;
    }
    if (this.registrationList[rank]) {
      return 'Rank already taken';
    }
    if (this.playerExists(player)) {
      return 'Player already exists';
    }

    return new RegistrationList({ ...this.registrationList, [rank]: player });
  }
  private playerExists(player: Player): boolean {
    return (
      Object.values(this.registrationList).find((p) => p.id === player.id) !==
      undefined
    );
  }

  getList(): { [rank: number]: Player } {
    return this.registrationList;
  }

  removePlayer(id: PlayerId): RegistrationList {
    const filtered = Object.entries(this.registrationList).filter(
      ([key, value]) => {
        return value.id.value !== id.value;
      }
    );
    return new RegistrationList(Object.fromEntries(filtered));
  }

  editPlayer(
    id: PlayerId,
    details: { name: string; rank: number }
  ): RegistrationList | 'Rank already taken' {
    if (
      this.registrationList[details.rank]?.id.value !== id.value &&
      this.registrationList[details.rank]
    ) {
      return 'Rank already taken';
    }
    const edited = Object.entries(this.registrationList).map(([key, value]) => {
      if (value.id.value === id.value) {
        return [String(details.rank), { id, name: details.name }];
      } else {
        return [key, value];
      }
    });
    return new RegistrationList(Object.fromEntries(edited));
  }
}

type RegistrationListCreateError = 'PlayerNotUnique';
export type RegistrationListAddPlayerError =
  | 'Player already exists'
  | 'Rank already taken';
