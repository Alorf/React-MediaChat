import React from "react";
import anime from "animejs";

export function ShowAuthor({
  author,
  rect,
  mediaRef,
}: {
  author: any;
  rect: any;
  mediaRef: any;
}) {
  const authorImageRef = React.useRef<HTMLSpanElement>(null);
  const authorNameRef = React.useRef<HTMLSpanElement>(null);
  const senderRef = React.useRef<HTMLDivElement>(null);
  const animationRef = React.useRef(null);

  const [authorName] = React.useState(author.name);
  const [authorImage] = React.useState(author.image);
  const [animationPlaying, setAnimationPlaying] = React.useState(false);
  const [stream, setStream] = React.useState<MediaStream | undefined>(
    undefined
  );

  React.useEffect(() => {
    //Set position of div
    if (rect === undefined) return;

    senderRef.current!.style.left =
      (rect.x - 100 < 0 ? 0 : +(rect.x - 100)) + "px";
    senderRef.current!.style.top =
      (rect.y - 100 < 0 ? 0 : +(rect.y - 100)) + "px";

    shake();
  }, [rect]);

  React.useEffect(() => {
    authorImageRef.current!.style.backgroundImage = `url(${authorImage})`;
  }, [authorImage]);

  React.useEffect(() => {
    authorNameRef.current!.innerText = authorName;
  }, [authorName]);

  React.useEffect(() => {
    if (mediaRef === undefined) return;

    //If it is a video
    if (mediaRef.current instanceof HTMLVideoElement) {
      try {
        setStream(mediaRef.current.captureStream());
      } catch (e) {
        console.log(e);
      }
    }
  }, []);

  React.useEffect(() => {
    if (!stream) return;

    const audioContext = new (window.AudioContext || window.AudioContext)();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    source.connect(analyser);

    const data = new Uint8Array(analyser.frequencyBinCount);

    function update() {
      analyser.getByteFrequencyData(data);
      const volume = data.reduce((a, b) => a + b, 0) / data.length;
      const scale = 1 + volume / 256 / 2; // 1 est l'échelle de départ

      // @ts-ignore
      animationRef.current!.set(authorImageRef.current!, {
        scale: scale,
      });

      requestAnimationFrame(update);
    }

    update();

    return () => {
      // Clean up when the component is unmounted
      source.disconnect();
      analyser.disconnect();
    };
  }, [stream]);

  function shake() {
    if (animationPlaying) return;
    setAnimationPlaying(true);

    // @ts-ignore
    animationRef.current = anime({
      targets: authorImageRef.current!,
      translateX: anime.random(-2, 2),
      translateY: anime.random(-2, 2),
      rotate: anime.random(-1, 1),
      easing: "easeInOutQuad",
      duration: 750,
      complete: shake,
    });
  }

  return (
    <div
      ref={senderRef}
      style={{
        padding: "1em",
        display: "flex",
        position: "absolute",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <span
        ref={authorImageRef}
        style={{
          display: "flex",
          flexGrow: 0,
          flexShrink: 0,
          padding: "2px",
          height: "128px",
          width: "128px",
          borderRadius: "50%",
          border: "#00fe77 10px solid",
          boxShadow:
            "inset 0px 0px 30px 10px hsla(148, 100%, 50%, 0.61), 0px 0px 30px 10px hsla(148, 100%, 50%, 0.61)",
          backgroundSize: "cover",
        }}
      ></span>
      <span
        ref={authorNameRef}
        style={{
          textAlign: "center",
          color: "white",
          fontSize: "2.5em",
          fontFamily:
            "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif",
          zIndex: 99,
          textShadow: "4px 4px 2px rgba(0,0,0,0.6)",
        }}
      ></span>
    </div>
  );
}
