import React, {useEffect} from "react";
import {Position} from "../entity/Position";
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

export function ShowText({
  id,
  media,
  onTextEnded,
}: {
  id: string;
  media: Text;
  onTextEnded: any;
}) {
  const spanRef = React.useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (spanRef.current && media !== undefined) {
      let spanTag = spanRef.current;
      //Set span position
      spanTag.style.position = "absolute";

      spanTag.style.color = media.fontColor ?? "white";
      spanTag.style.fontFamily = media.fontFamily ?? "Arial";
      spanTag.style.fontSize =
        media.fontSize != undefined
          ? media.fontSize * Number(media.position!.aspectRatio) + "px"
          : "16px";
      spanTag.innerText = media.textData ?? "";

      filePosition(media.position!, spanTag);

      //setRect(spanTag.getBoundingClientRect());

      if (onTextEnded != undefined) {
        setTimeout(() => {
          onTextEnded(id);
        }, media.duration * 1000);
      }
    }
  }, [media]);

  return (
    <>
      <span
        ref={spanRef}
        style={{
          position: "absolute",
          minWidth: "80%",
          display: "flex",
          justifyContent: "center",
          overflowWrap: "anywhere",
          zIndex: 99,
          textShadow: "4px 4px 2px rgba(0,0,0,0.6)",
          lineHeight: "100%",
          paddingBottom: "15px",
        }}
      ></span>
    </>
  );
}
