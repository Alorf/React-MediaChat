import React, {useEffect} from "react";
import {ShowAuthor} from "./ShowAuthor";
import {ShowText} from "./ShowText";
import {Position} from "../entity/Position";
import {Image} from "../entity/Image";
import {Text} from "../entity/Text";
import {DiscordUser} from "../entity/DiscordUser";

function filePosition(data: Position, selector: any) {
  switch (data.left) {
    case "left":
      selector.style.left = "0%";
      selector.style.transform = "translateX(-0%)";
      break;
    case "center":
      selector.style.left = "50%";
      selector.style.transform = "translateX(-50%)";
      break;
    case "right":
      selector.style.left = "100%";
      selector.style.transform = "translateX(-100%)";
      break;
    default:
      if (typeof data.left === "number" && data.aspectRatio !== undefined) {
        selector.style.transform = "translateX(0%)";
        selector.style.left = data.left * data.aspectRatio + "px";
      }
      break;
  }

  switch (data.top) {
    case "top":
      selector.style.top = "0%";
      selector.style.transform += "translateY(-0%)";
      break;
    case "center":
      selector.style.top = "50%";
      selector.style.transform += "translateY(-50%)";
      break;
    case "bottom":
      selector.style.top = "100%";
      selector.style.transform += "translateY(-100%)";
      break;
    default:
      if (typeof data.top === "number" && data.aspectRatio !== undefined) {
        selector.style.transform += "translateY(0%)";
        selector.style.top = data.top * data.aspectRatio + "px";
      }
      break;
  }
}

export function ShowImage({
  id,
  media,
  onImageEnded,
  author,
  text,
}: {
  id: string;
  media: Image;
  onImageEnded: any;
  author: DiscordUser;
  text: Text;
}) {
  const imageRef = React.useRef<HTMLImageElement>(null);
  const [rect, setRect] = React.useState<DOMRect | undefined>(undefined);
  const [ready, setReady] = React.useState(false);

  useEffect(() => {
    if (imageRef.current && media !== undefined) {
      let imageTag = imageRef.current;

      imageTag.src = media.url ?? "";

      //Set video position
      imageTag.style.position = "absolute";

      /*
      imageTag.style.top =
        media.position.top * media.position.aspectRatio + "px";
      imageTag.style.left =
        media.position.left * media.position.aspectRatio + "px";
      */
      filePosition(media.position!, imageTag);

      if (media.fullscreen) {
        imageTag.style.width = "auto";
        imageTag.style.height = "100%";
      } else {
        const height = media.height !== undefined ? media.height : 0;
        const aspectRatio =
          media.position?.aspectRatio !== undefined
            ? media.position.aspectRatio
            : 1;

        imageTag.style.height = Number(height) * aspectRatio + "px";

        if (media.width === "auto") {
          imageTag.style.width = "auto";
        } else {
          const width = media.width !== undefined ? media.width : 0;
          imageTag.style.width = Number(width) * aspectRatio + "px";
        }
      }

      //setRect(imageTag.getBoundingClientRect());

      //On image ended
      setTimeout(() => {
        onImageEnded(id);
      }, 10000);
    }
  }, [media]);

  useEffect(() => {
    if (imageRef.current) {
      imageRef.current!.onload = () => {
        setRect(imageRef.current!.getBoundingClientRect());

        setReady(true);
      };
    }
  }, []);

  return (
    <>
      <img ref={imageRef} />

      {!author.anonymous && ready && (
        <ShowAuthor author={author} rect={rect} mediaRef={imageRef} />
      )}

      {text !== undefined && ready && (
        <ShowText media={text} id={""} onTextEnded={undefined} />
      )}
    </>
  );
}
