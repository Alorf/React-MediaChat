import {Position} from "./Position";

export class Image {
  public url?: string;
  public width?: number | string;
  public height?: number | string;
  public fullscreen?: boolean;
  public duration?: number;

  public position?: Position;
  public isBase64?: boolean;

  constructor(
    url?: string,
    width?: number | string,
    height?: number | string,
    fullscreen?: boolean,
    duration?: number,
    position?: Position,
    isBase64?: boolean
  ) {
    this.url = url;
    this.width = width;
    this.height = height;
    this.fullscreen = fullscreen;
    this.duration = duration;
    this.position = position;
    this.isBase64 = isBase64;
  }
}
