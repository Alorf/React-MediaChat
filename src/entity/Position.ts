export class Position {
  top?: number | string;
  left?: number | string;
  aspectRatio?: number;

  constructor(
    top?: number | string,
    left?: number | string,
    aspectRatio?: number
  ) {
    this.top = top;
    this.left = left;
    this.aspectRatio = aspectRatio;
  }
}
