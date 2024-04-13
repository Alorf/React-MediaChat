import {VideoMoveable} from "../component/VideoMoveable";
import {ImageMoveable} from "../component/ImageMoveable";
import {TextForm} from "../component/TextForm.tsx";
import {TextMoveable} from "../component/TextMoveable";

import {Streamer} from "../component/Streamer";
import nostreamer from "../assets/nostreamer.png";
import "./upload.css";
import React, {useEffect, useState} from "react";
import Moveable from "react-moveable";
import {Video} from "../entity/Video";
import {Image} from "../entity/Image";

import {FileToSend} from "../entity/FileToSend.ts";
import {Position} from "../entity/Position.ts";
import {DiscordUser} from "../entity/DiscordUser.ts";
import {Text} from "../entity/Text.ts";

export function Upload() {
  const [showVideo, setShowVideo] = useState("");
  const [showImage, setShowImage] = useState("");
  const [showText, setShowText] = useState(undefined);
  const [isSearching, setIsSearching] = useState(false);
  const [isBase64, setIsBase64] = useState(false);
  const moveableRef = React.useRef<Moveable>(null);
  const textMoveableRef = React.useRef<Moveable>(null);
  const fileContainerRef = React.useRef<HTMLDivElement>(null);

  const linkRef = React.useRef<HTMLInputElement>(null);
  const discordUsernameRef = React.useRef<HTMLInputElement>(null);
  const greenscreenRef = React.useRef<HTMLInputElement>(null);

  const videoRef = React.useRef<HTMLVideoElement>(null);
  const imageRef = React.useRef<HTMLImageElement>(null);

  const [bgImg, setBgImg] = useState(nostreamer);

  const handleBackgroundImage = (imageURL: any) => {
    setBgImg(imageURL);
  };

  useEffect(() => {
    //load css
    let link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = "/fonts/config.css";
    document.head.appendChild(link);
  }, []);

  const handleTextChange = (text: any) => {
    setShowText(text);
  };

  const send = () => {
    //Get width and height of fileContainerRef
    const fileContainerWidth = fileContainerRef.current?.clientWidth;
    const fileContainerHeight = fileContainerRef.current?.clientHeight;

    const aspectRatio =
      fileContainerWidth && fileContainerHeight ? 1920 / fileContainerWidth : 1;

    var rect = moveableRef.current?.getRect();

    var position = new Position(rect?.top, rect?.left, aspectRatio);

    var duration;
    var video = undefined;
    var image = undefined;
    var text = undefined;

    if (showVideo !== "") {
      video = new Video(
        showVideo,
        rect?.width,
        rect?.height,
        videoRef.current?.muted, //muted
        greenscreenRef.current?.checked,
        false, //fullscreen
        videoRef.current?.currentTime, //currentTime
        position,
        isBase64
      );
    }

    if (showImage !== "") {
      image = new Image(
        showImage,
        rect?.width,
        rect?.height,
        false,
        duration,
        position,
        isBase64
      );
    }

    if (showText !== undefined) {
      let textPosition = textMoveableRef.current?.getRect();
      (showText as Text).position = new Position(
        textPosition?.top,
        textPosition?.left,
        aspectRatio
      );

      text = showText;
    }

    var author = new DiscordUser(undefined, undefined, true);

    var destination = new DiscordUser(
      discordUsernameRef.current?.value !== ""
        ? discordUsernameRef.current?.value
        : undefined,
      undefined,
      false
    );

    var fileToSend = new FileToSend(video, image, text, author, destination);
    //Request to server

    fetch(__API_URL__ + "/sendfile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fileToSend),
    });
  };

  const flush = () => {
    fetch(__API_URL__ + "/flush", {
      body: JSON.stringify({
        user:
          discordUsernameRef.current?.value == ""
            ? undefined
            : discordUsernameRef.current?.value,
      }),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  const skip = () => {
    fetch(__API_URL__ + "/skip", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  const clean = () => {
    if (showVideo !== "") {
      setShowVideo("");
    }

    if (showImage !== "") {
      setShowImage("");
    }

    if (showText != undefined) {
      setShowText(undefined);
    }
  };

  const loadInputFile = (e: any) => {
    if (e.target.files !== null) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = function (e) {
        if (file.type.includes("image")) {
          setShowImage(e.target?.result as string);
          setShowVideo("");
        } else {
          setShowVideo(e.target?.result as string);
          setShowImage("");
        }
      };
      reader.readAsDataURL(file);
      setIsBase64(true);

      //Reset input
      e.target.value = "";
    }
  };

  const getLink = (link: any) => {
    if (link.target.value === "") return;
    setIsBase64(false);
    let url = link.target.value;
    setIsSearching(true);

    try {
      new URL(url);
    } catch (e) {
      setIsSearching(false);
      return;
    }

    fetch(`${__API_URL__}/video-url?url=${url}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(response => response.json())
      .then(fileToSend => {
        if (fileToSend.video != undefined) {
          setShowVideo(fileToSend.video.url);
          setShowImage("");
        }

        setIsSearching(false);
      });
  };

  return (
    <div>
      <div className="flex overflow-x-hidden">
        <div className="p-10 h-screen w-1/4 min-h-full max-h-full bg-base-200 text-base-content flex overflow-auto flex-col form-control justify-between">
          <div>
            <label htmlFor="file" className="label">
              <span className="label-text">Fichier</span>
            </label>
            <input
              id="file"
              type="file"
              className="file-input file-input-bordered w-full max-w-xs"
              onChange={e => loadInputFile(e)}
            />
          </div>
          <div>
            <label htmlFor="link" className="label">
              <span className="label-text">Lien d'un média</span>
              {isSearching && <span className="loading loading-sm"></span>}
            </label>
            <input
              ref={linkRef}
              type="text"
              placeholder="Lien d'un média"
              onBlur={e => getLink(e)}
              className="input input-bordered w-full max-w-xs"
            />
          </div>
          <TextForm onTextChange={handleTextChange} />
          <div>
            <label htmlFor="discord" className="label">
              <span className="label-text">Username Discord</span>
            </label>
            <input
              ref={discordUsernameRef}
              type="text"
              placeholder="Username discord"
              className="input input-bordered w-full max-w-xs"
            />
          </div>
          <div>
            <label htmlFor="greenscreen" className="label cursor-pointer">
              <span className="label-text">GreenScreen</span>
              <input
                ref={greenscreenRef}
                type="checkbox"
                className="checkbox"
              />
            </label>
          </div>
          {/* <Streamer bind:fileContainerBackground={fileContainerBackground}/> */}
          <Streamer onBackgroundImageChange={handleBackgroundImage} />
        </div>
        <div className="flex flex-col w-full h-screen justify-between">
          <div>
            <div
              id="file-container"
              ref={fileContainerRef}
              className="container aspect-video"
              style={{
                backgroundImage: `url(${bgImg})`,
              }}
            >
              {showText && (
                <TextMoveable moveableRef={textMoveableRef} data={showText} />
              )}
              {showVideo && (
                <VideoMoveable
                  moveableRef={moveableRef}
                  data={showVideo}
                  videoRef={videoRef}
                  fileContainerRef={fileContainerRef}
                />
              )}

              {showImage && (
                <ImageMoveable
                  moveableRef={moveableRef}
                  data={showImage}
                  fileContainerRef={fileContainerRef}
                  imageRef={imageRef}
                />
              )}
            </div>
          </div>

          <div className="flex h-full justify-around items-center">
            {/* Clean */}
            <div className="tooltip" data-tip="Clean">
              <button className="btn btn-primary" onClick={clean}>
                <span className="material-symbols-outlined">mop</span>
              </button>
            </div>

            {/* Flush*/}
            <div className="tooltip" data-tip="Flush">
              <button className="btn btn-primary" onClick={flush}>
                <span className="material-symbols-outlined">delete</span>
              </button>
            </div>

            {/* Send*/}
            <div className="tooltip" data-tip="Send">
              <button className="btn btn-primary" onClick={send}>
                <span className="material-symbols-outlined">send</span>
              </button>
            </div>

            {/* Skip*/}
            <div className="tooltip" data-tip="Skip">
              <button className="btn btn-primary" onClick={skip}>
                <span className="material-symbols-outlined">skip_next</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
