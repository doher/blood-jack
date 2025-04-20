export class Balance {
  constructor(private _value: number = 0) {}

  public get value(): number {
    return this._value;
  }

  public set value(newBalance: number) {
    this._value = newBalance;
  }

  public bet(stake: number): number {
    this._value -= stake;

    return this._value;
  }
}
