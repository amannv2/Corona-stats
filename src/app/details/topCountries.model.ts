export class TopCountries {
  public first: string;
  public second: string;
  public third: string;
  public firstCases: string;
  public secondCases: string;
  public thirdCases: string;

  constructor(
    first: string,
    second: string,
    third: string,
    firstCases: string,
    secondCases: string,
    thirdCases: string
  ) {
    this.first = first;
    this.second = second;
    this.third = third;
    this.firstCases = firstCases;
    this.secondCases = secondCases;
    this.thirdCases = thirdCases;
  }
}
