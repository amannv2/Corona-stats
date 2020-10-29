export class Cases {
  public totalDeath: string;
  public totalRecovered: string;
  public totalConfirmed: string;
  public active: string;
  public newDeath: string;
  public newRecovered: string;
  public newConfirmed: string;

  constructor(
    totalDeath: string,
    totalRecovered: string,
    totalConfirmed: string,
    active: string,
    newDeath: string,
    newRecovered: string,
    newConfirmed: string
  ) {
    this.totalDeath = totalDeath;
    this.totalRecovered = totalRecovered;
    this.totalConfirmed = totalConfirmed;
    this.active = active;
    this.newDeath = newDeath;
    this.newRecovered = newRecovered;
    this.newConfirmed = newConfirmed;
  }
}
