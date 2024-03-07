import {Position} from "./Position";

export class Text {
  public textData?: string;
  public fontFamily?: string;
  public fontColor?: string;
  public fontSize?: number;

  public position?: Position;

  constructor(
    textData?: string,
    fontFamily?: string,
    fontColor?: string,
    fontSize?: number,
    position?: Position
  ) {
    this.textData = textData;
    this.fontFamily = fontFamily;
    this.fontColor = fontColor;
    this.fontSize = fontSize;
    this.position = position;
  }
}
