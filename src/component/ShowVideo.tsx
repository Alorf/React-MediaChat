import React, {useEffect} from "react";
import {ShowAuthor} from "./ShowAuthor";
import {ShowText} from "./ShowText";
import {Position} from "../entity/Position";
import {Video} from "../entity/Video";
import {DiscordUser} from "../entity/DiscordUser";
import {Text} from "../entity/Text";

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
      selector.style.transform = "translateX(0%)";
      selector.style.left = Number(data.left) * Number(data.aspectRatio) + "px";
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
      selector.style.transform += "translateY(0%)";
      selector.style.top = Number(data.top) * Number(data.aspectRatio) + "px";
      break;
  }
}

export function ShowVideo({
  id,
  media,
  onVideoEnded,
  author,
  text,
}: {
  id: string;
  media: Video;
  onVideoEnded: any;
  author: DiscordUser;
  text: Text;
}) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [rect, setRect] = React.useState<DOMRect | undefined>(undefined);
  const [ready, setReady] = React.useState(false);

  useEffect(() => {
    if (videoRef.current && media !== undefined) {
      let videoTag = videoRef.current;

      if (!media.isBase64) {
        videoTag.src =
          __API_URL__ + "/cors?url=" + encodeURIComponent(media.url!);
      } else {
        videoTag.src = media.url ?? "";
      }

      videoTag.muted = media.muted ?? false;
      videoTag.currentTime = media.currentTime ?? 0;

      //Set video position
      videoTag.style.position = "absolute";
      /*
      videoTag.style.top =
        media.position.top * media.position.aspectRatio + "px";
      videoTag.style.left =
        media.position.left * media.position.aspectRatio + "px";
        */
      filePosition(media.position!, videoTag);

      if (media.fullscreen) {
        videoTag.style.width = "auto";
        videoTag.style.height = "100%";
      } else {
        videoTag.style.height =
          Number(media.height) * Number(media.position!.aspectRatio) + "px";
        videoTag.style.width =
          media.width === "auto"
            ? "auto"
            : Number(media.width) * Number(media.position!.aspectRatio) + "px";
      }

      videoTag.play();

      //On video ended
      videoTag.onended = () => {
        onVideoEnded(id);
      };
    }
  }, [media]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener("loadeddata", () => {
        setRect(videoRef.current!.getBoundingClientRect());
        setReady(true);
      });
    }
  }, []);

  return (
    <>
      <video crossOrigin="anonymous" ref={videoRef} />

      {!author.anonymous && !media.greenscreen && ready && (
        <ShowAuthor author={author} rect={rect} mediaRef={videoRef} />
      )}

      {text !== undefined && ready && (
        <ShowText media={text} id={""} onTextEnded={undefined} />
      )}
    </>
  );
}
