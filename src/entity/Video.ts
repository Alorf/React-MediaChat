import {Position} from "./Position";

export class Video {
  public url?: string;
  public width?: number | string;
  public height?: number | string;

  public muted?: boolean;
  public greenscreen?: boolean;
  public fullscreen?: boolean;

  public currentTime?: number;

  public position?: Position;

  public isBase64?: boolean;

  constructor(
    url?: string,
    width?: number | string,
    height?: number | string,
    muted?: boolean,
    greenscreen?: boolean,
    fullscreen?: boolean,
    currentTime?: number,
    position?: Position,
    isBase64?: boolean
  ) {
    this.url = url;
    this.width = width;
    this.height = height;
    this.muted = muted;
    this.greenscreen = greenscreen;
    this.fullscreen = fullscreen;
    this.currentTime = currentTime;
    this.position = position;
    this.isBase64 = isBase64;
  }
}
