import { v4 } from 'uuid';

export class Id {
  value: string;
  public static random(): Id {
    return new Id(v4());
  }
  public static create(id: string): Id {
    return new Id(id);
  }
  private constructor(value: string) {
    this.value = value;
  }
  public equals(other: Id): boolean {
    return this.value === other.value;
  }
}
