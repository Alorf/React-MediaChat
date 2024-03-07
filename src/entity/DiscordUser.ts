export class DiscordUser {
  public name?: string;
  public image?: string;
  public anonymous?: boolean;

  constructor(name?: string, image?: string, anonymous?: boolean) {
    this.name = name;
    this.image = image;
    this.anonymous = anonymous;
  }
}
