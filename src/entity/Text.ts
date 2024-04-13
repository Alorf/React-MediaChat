import {Position} from "./Position";

export class Text {
  public textData?: string;
  public fontFamily?: string;
  public fontColor?: string;
  public fontSize?: number;
  public duration?: number;

  public position?: Position;

  constructor(
    textData?: string,
    fontFamily?: string,
    fontColor?: string,
    fontSize?: number,
    duration?: number,
    position?: Position
  ) {
    this.textData = textData;
    this.fontFamily = fontFamily;
    this.fontColor = fontColor;
    this.fontSize = fontSize;
    this.duration = duration;
    this.position = position;
  }
}
