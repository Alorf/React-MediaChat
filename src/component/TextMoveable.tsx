import * as React from "react";
import Moveable from "react-moveable";

export function TextMoveable({
  data,
  moveableRef,
}: {
  data: any;
  moveableRef: React.RefObject<Moveable>;
}) {
  const spanRef = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    if (spanRef.current) {
      //Set value of data to spanRef
      spanRef.current.innerText = data.textData;

      spanRef.current.style.color = data.fontColor ?? "white";
      spanRef.current.style.fontFamily = data.fontFamily;
      spanRef.current.style.fontSize =
        data.fontSize != undefined ? data.fontSize + "px" : "16px";

      moveableRef.current?.updateRect();
    }
  }, [data]);

  return (
    <>
      <span
        ref={spanRef}
        style={{
          position: "absolute",
          overflowWrap: "anywhere",
          zIndex: 99,
          cursor: "pointer",
          textShadow: "4px 4px 2px rgba(0,0,0,0.6)",
          lineHeight: "100%",
        }}
      ></span>

      <Moveable
        ref={moveableRef}
        target={spanRef}
        draggable={true}
        throttleDrag={1}
        edgeDraggable={false}
        startDragRotate={0}
        throttleDragRotate={0}
        rotatable={false}
        snappable={true}
        bounds={{left: 0, top: 0, right: 0, bottom: 0, position: "css"}}
        resizable={false}
        scalable={false}
        origin={false}
        keepRatio={true}
        renderDirections={["nw", "n", "ne", "w", "e", "sw", "s", "se"]}
        onDrag={e => {
          e.target.style.transform = e.transform;
        }}
        onRotate={e => {
          e.target.style.transform = e.afterTransform;
        }}
        onResize={e => {
          e.target.style.width = `${e.width}px`;
          e.target.style.height = `${e.height}px`;
          e.target.style.transform = e.drag.transform;
        }}
        onScale={e => {
          e.target.style.transform = e.drag.transform;
        }}
      />
    </>
  );
}
