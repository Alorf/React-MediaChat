import {useEffect, useState} from "react";
import {FileToSend} from "../entity/FileToSend";
import {ShowVideo} from "../component/ShowVideo";
import {ShowImage} from "../component/ShowImage";
import {io} from "socket.io-client";
import {useSearchParams} from "react-router-dom";
import {ObsEnableSourceFilter} from "../assets/obs.js";
import {ShowText} from "../component/ShowText.js";
//import "../assets/obs.js";

export function Stream() {
  const [searchParams] = useSearchParams();
  const key = searchParams.get("key");
  const potato = searchParams.get("potato");

  let [data, setData] = useState([]);
  const [queue, setQueue] = useState(false);

  useEffect(() => {
    const socket = __API_URL__ == "" ? io() : io(__API_URL__);

    socket.on("connect", function () {
      socket.emit("msg", {data: "StreamConnected"});
      socket.emit("join", key);
    });

    socket.on("setup", function (data) {
      setQueue(data.queue);
    });

    socket.io.on("reconnect", () => {
      socket.emit("msg", {data: "StreamReconnected"});
    });

    socket.on("disconnect", function () {
      socket.emit("msg", {data: "StreamDisconnected"});
      socket.emit("leave", key);
    });

    socket.on("sendFile", function (data: any) {
      ObsEnableSourceFilter(false);

      //Set id to data
      data.id = Math.random().toString(36).substring(7);

      if (data.video !== undefined) {
        //@ts-ignore
        ObsEnableSourceFilter(data.video.greenscreen);
      }

      if (data.author !== undefined) {
        if (potato === "true") {
          data.author.anonymous = true;
        }
      }

      setData(curr => [...curr, data]);
    });

    socket.on("skip", function () {
      //Skip media
      setData(curr => curr.slice(1));
    });

    socket.on("flush", function () {
      setData([]);
    });

    document.querySelectorAll("style").forEach(e => {
      //May cause issue when in production
      e.remove();
    });

    document.querySelectorAll("link").forEach(e => {
      //May cause issue when in production
      e.remove();
    });

    //load css
    let link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = "/fonts/config.css";
    document.head.appendChild(link);

    //Remove overflow
    document.body.style.overflow = "hidden";
  }, []);

  const handleMediaEnded = (id: string) => {
    if (queue) {
      if (data[0].id === id) {
        setData(curr => curr.slice(1));
      }
    } else {
      setData(curr => curr.filter((media: {id: string}) => media.id !== id));
    }
  };

  return (
    <>
      {data.map((data: any, index) => {
        if (queue === true) {
          if (index == 0) {
            if (data.video !== undefined) {
              return (
                <ShowVideo
                  key={`video-${data.id}`}
                  id={data.id}
                  media={data.video}
                  author={data.author}
                  onVideoEnded={handleMediaEnded}
                  text={data.text}
                />
              );
            }

            if (data.image !== undefined) {
              return (
                <ShowImage
                  key={`image-${data.id}`}
                  id={data.id}
                  media={data.image}
                  author={data.author}
                  onImageEnded={handleMediaEnded}
                  text={data.text}
                />
              );
            }

            if (data.text !== undefined) {
              return (
                <ShowText
                  key={`imageText-${data.id}`}
                  id={data.id}
                  media={data.text}
                  onTextEnded={handleMediaEnded}
                />
              );
            }
          }
        } else {
          if (data.video !== undefined) {
            return (
              <ShowVideo
                key={`video-${data.id}`}
                id={data.id}
                media={data.video}
                author={data.author}
                onVideoEnded={handleMediaEnded}
                text={data.text}
              />
            );
          }

          if (data.image !== undefined) {
            return (
              <ShowImage
                key={`image-${data.id}`}
                id={data.id}
                media={data.image}
                author={data.author}
                onImageEnded={handleMediaEnded}
                text={data.text}
              />
            );
          }

          if (data.text !== undefined) {
            return (
              <ShowText
                key={`imageText-${data.id}`}
                id={data.id}
                media={data.text}
                onTextEnded={handleMediaEnded}
              />
            );
          }
        }
      })}
    </>
  );
}
