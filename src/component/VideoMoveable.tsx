import * as React from "react";
import Moveable from "react-moveable";

export function VideoMoveable({
  data,
  moveableRef,
  fileContainerRef,
  videoRef,
}: {
  data: any;
  moveableRef: React.RefObject<Moveable>;
  fileContainerRef: React.RefObject<HTMLDivElement>;
  videoRef: React.RefObject<HTMLVideoElement>;
}) {
  React.useEffect(() => {
    if (videoRef.current) {
      videoRef.current.src = data;
    }
  }, [data]);

  //On video load
  React.useEffect(() => {
    var w = fileContainerRef.current?.clientHeight ?? 1080;
    if (videoRef.current == null) return;

    videoRef.current?.addEventListener("loadedmetadata", () => {
      if (moveableRef.current) {
        if (Number(videoRef.current?.videoHeight) > w) {
          videoRef.current!.style.height = `${w}px`;
          videoRef.current!.style.width = "auto";
        } else {
          videoRef.current!.style.width = `${videoRef.current!.videoWidth}px`;
          videoRef.current!.style.height = `${videoRef.current!.videoHeight}px`;
        }

        moveableRef.current.updateRect();
      }
    });
  }, []);

  return (
    <>
      <video
        ref={videoRef}
        controls
        style={{
          position: "relative",
          display: "block",
        }}
      />

      <Moveable
        ref={moveableRef}
        target={videoRef}
        hideDefaultLines={false}
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
