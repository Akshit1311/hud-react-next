"use client";
import Image from "next/image";
import Button from "./components/Button";
import { useEffect, useRef, useState } from "react";
import VideoElem from "./components/VideoElem";

import {
  useAudio,
  useHuddle01,
  useLobby,
  usePeers,
  useRoom,
  useVideo,
} from "@huddle01/react/hooks";
import AudioElem from "./components/AudioElem";

export default function Home() {
  // refs
  const videoRef = useRef<HTMLVideoElement>(null);

  // react
  const { roomState, initialize } = useHuddle01();
  const { joinLobby, leaveLobby } = useLobby();
  const { joinRoom, leaveRoom } = useRoom();
  const {
    fetchAudioStream,
    stopAudioStream,
    produceAudio,
    stopProducingAudio,
    stream: audioStream,
  } = useAudio();
  const {
    produceVideo,
    fetchVideoStream,
    stopVideoStream,
    stopProducingVideo,
    stream: videoStream,
  } = useVideo();
  const { peers } = usePeers();

  const COLORS: { [key in typeof roomState]: string } = {
    IDLE: "text-red-500",
    INIT: "text-pink-500",
    LOBBY: "text-yellow-500",
    ROOM: "text-green-500",
  };

  useEffect(() => {
    if (videoStream && videoRef.current)
      videoRef.current.srcObject = videoStream;
  }, [videoStream]);

  useEffect(() => {
    console.log({ peers });
  }, [peers]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Room State:&nbsp;
          <code className={`font-mono font-bold ${COLORS[roomState]}`}>
            {roomState}
          </code>
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          {/* <Button onClick={sayHello}>SayHello</Button> */}
        </div>
      </div>

      <div className="grid gap-3 place-items-center">
        Peers: {JSON.stringify(peers)}
        <div className="relative bg-zinc-800 aspect-video rounded-lg w-96 overflow-hidden">
          <video
            className="absolute w-full top-1/2 -translate-y-1/2"
            ref={videoRef}
            autoPlay
          />
          {/* <audio ref={audioRef} autoPlay className="" /> */}
        </div>
        <div className=" flex gap-3">
          {Object.values(peers).map(({ cam, peerId }, i) => (
            <>{cam && <VideoElem key={peerId} track={cam} />}</>
          ))}
          {Object.values(peers).map(({ mic, peerId }, i) => (
            <>{mic && <AudioElem key={peerId} track={mic} />}</>
          ))}
        </div>
      </div>

      <div className="">
        <div>Room</div>
        <div className="flex gap-3  w-full">
          <Button
            disabled={!initialize.isCallable}
            onClick={() => {
              initialize("pSNb4vwvAz7bbzQdVYCpHWHPO-BTV2oz");
            }}
          >
            initialize()
          </Button>
          <Button
            disabled={!joinLobby.isCallable}
            onClick={() => {
              joinLobby("ngo-tmvu-oxw");
            }}
          >
            joinLobby()
          </Button>
          <Button disabled={!joinRoom.isCallable} onClick={joinRoom}>
            joinRoom()
          </Button>
          <Button disabled={!leaveLobby.isCallable} onClick={leaveLobby}>
            leaveLobby()
          </Button>
          <Button disabled={!leaveRoom.isCallable} onClick={leaveRoom}>
            leaveRoom()
          </Button>
        </div>

        <div>Audio</div>
        <div className="flex gap-3">
          <Button
            disabled={!fetchAudioStream.isCallable}
            onClick={async () => {
              fetchAudioStream();
            }}
          >
            fetchAudioStream()
          </Button>
          <Button
            disabled={!produceAudio.isCallable}
            onClick={() => {
              audioStream && produceAudio(audioStream);
            }}
          >
            produceAudio()
          </Button>

          <Button
            disabled={!stopAudioStream.isCallable}
            onClick={stopAudioStream}
          >
            stopAudioStream()
          </Button>
          <Button
            disabled={!stopProducingAudio.isCallable}
            onClick={() => {
              stopProducingAudio();
            }}
          >
            stopProducingAudio()
          </Button>
        </div>

        <div>Video</div>
        <div className="flex gap-3">
          <Button
            disabled={!fetchVideoStream.isCallable}
            onClick={fetchVideoStream}
          >
            fetchVideoStream()
          </Button>

          <Button
            disabled={!produceVideo.isCallable}
            onClick={() => produceVideo(videoStream)}
          >
            produceVideo()
          </Button>

          <Button
            disabled={!stopVideoStream.isCallable}
            onClick={stopVideoStream}
          >
            stopVideoStream()
          </Button>

          <Button
            disabled={!stopProducingVideo.isCallable}
            onClick={stopProducingVideo}
          >
            stopProducingVideo()
          </Button>
        </div>
      </div>
    </main>
  );
}
