import React from "react";
import Moveable from "react-moveable";

export function ImageMoveable({
  data,
  moveableRef,
  fileContainerRef,
  imageRef,
}: {
  data: any;
  moveableRef: React.RefObject<Moveable>;
  fileContainerRef: React.RefObject<HTMLDivElement>;
  imageRef: React.RefObject<HTMLImageElement>;
}) {
  //On image load
  React.useEffect(() => {
    var w = fileContainerRef.current!.clientHeight;

    if (imageRef.current) {
      imageRef.current.addEventListener("load", () => {
        if (imageRef.current!.height > w) {
          imageRef.current!.style.height = `${w}px`;
          imageRef.current!.style.width = "auto";
        } else {
          imageRef.current!.style.width = `${imageRef.current?.width}px`;
          imageRef.current!.style.height = `${imageRef.current?.height}px`;
        }

        moveableRef.current!.updateRect();
      });
    }
  }, []);

  return (
    <>
      <img src={data} ref={imageRef} />

      <Moveable
        ref={moveableRef}
        target={imageRef}
        draggable={true}
        throttleDrag={1}
        edgeDraggable={false}
        startDragRotate={0}
        throttleDragRotate={0}
        rotatable={false}
        snappable={true}
        bounds={{left: 0, top: 0, right: 0, bottom: 0, position: "css"}}
        resizable={true}
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
