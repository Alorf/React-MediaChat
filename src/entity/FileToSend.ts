import {Video} from "./Video";
import {Image} from "./Image";
import {Text} from "./Text";
import {DiscordUser} from "./DiscordUser";

export class FileToSend {
  public video?: Video;
  public image?: Image;
  public text?: Text;
  public author?: DiscordUser;
  public destination?: DiscordUser;

  constructor(
    video?: Video,
    image?: Image,
    text?: Text,
    author?: DiscordUser,
    destination?: DiscordUser
  ) {
    this.video = video;
    this.image = image;
    this.text = text;
    this.author = author;
    this.destination = destination;
  }
}
