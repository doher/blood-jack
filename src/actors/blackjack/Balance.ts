export class Balance {
  constructor(private _balance: number = 0) {}

  public get value(): number {
    return this._balance;
  }

  public updateBalance(amount: number): number {
    this._balance += amount;

    return this._balance;
  }

  public bet(stake: number): number {
    this._balance -= stake;

    return this._balance;
  }
}
