"use client";
import { useEffect, useRef, useState } from "react";

import { useAppUtils } from "@huddle01/react/app-utils";
import {
  useAcl,
  useAudio,
  useEventListener,
  useHuddle01,
  useLobby,
  usePeers,
  useRoom,
  useVideo,
  useScreenShare,
} from "@huddle01/react/hooks";

import AudioElem from "./components/AudioElem";
import Button from "./components/Button";
import Input from "./components/Input";
import VideoElem from "./components/VideoElem";

export default function Home() {
  // state
  const [peerId, setPeerId] = useState("");
  const [dName, setDName] = useState("");
  const [projectId, setProjectId] = useState("");
  const [roomId, setRoomId] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [avatarLink, setAvatarLink] = useState("");
  const [peerIdToKick, setPeerIdToKick] = useState("");

  // refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const screenRef = useRef<HTMLVideoElement>(null);

  // react
  const { roomState, initialize, me } = useHuddle01();
  const { joinLobby, leaveLobby, isLobbyJoined, previewPeers } = useLobby();
  const { joinRoom, leaveRoom, endRoom, lobbyPeers } = useRoom();
  const {
    fetchAudioStream,
    stopAudioStream,
    produceAudio,
    stopProducingAudio,
    stream: audioStream,
    micDevices,
    enumerateMicDevices,
    isAudioOn,
  } = useAudio();
  const {
    produceVideo,
    fetchVideoStream,
    stopVideoStream,
    stopProducingVideo,
    stream: videoStream,
    camDevices,
    enumerateCamDevices,
    isVideoOn,
  } = useVideo();

  const {
    fetchScreenShare,
    produceScreenShare,
    stopScreenShare,
    stopProducingScreenShare,
    stream: screenShareStream,
  } = useScreenShare();

  const { peers } = usePeers();

  const { changePeerRole, kickPeer, admitPeer, denyPeer, changeRoomControls } =
    useAcl();

  const COLORS: { [key in typeof roomState]: string } = {
    IDLE: "text-red-500",
    INIT: "text-pink-500",
    LOBBY: "text-yellow-500",
    ROOM: "text-green-500",
  };
  const MEDIA_COLORS = {
    false: "text-red-500",
    true: "text-green-500",
  };

  useEffect(() => {
    if (videoStream && videoRef.current)
      videoRef.current.srcObject = videoStream;
  }, [videoStream]);

  useEventListener("app:mic-on", () => {
    console.log("app:mice-on", { audioStream });
  });
  useEventListener("room:me-role-update", (role) => {
    console.log("room:me-role-update", { role });
  });

  useEventListener("room:data-received", (data) => {
    console.log("Data recvvvvvved", { data });
  });

  useEffect(() => {
    if (screenShareStream && screenRef.current)
      screenRef.current.srcObject = screenShareStream;
  }, [screenShareStream]);

  const { setDisplayName, changeAvatarUrl, sendData } = useAppUtils();

  useEffect(() => {
    const localRoomId = localStorage.getItem("roomId");
    const localProjectId = localStorage.getItem("projectId");

    setRoomId(localRoomId || process.env.NEXT_PUBLIC_ROOM_ID || "");
    setProjectId(localProjectId || process.env.NEXT_PUBLIC_PROJECT_ID || "");
  }, []);

  return (
    <main className="grid min-h-screen flex-col place-items-center ">
      <div className="grid gap-3 place-items-center">
        <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
          <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
            Room State:&nbsp;
            <code className={`font-mono font-bold ${COLORS[roomState]}`}>
              {roomState}
            </code>
          </p>
          <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
            isVideoOn:&nbsp;
            <code>{isVideoOn.toString()}</code>
          </p>
          ``
          <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
            isAudioOn:&nbsp;
            <code>{isAudioOn.toString()}</code>
          </p>
        </div>
        <div className="break-words whitespace-normal">
          Peers: {JSON.stringify(peers)}
        </div>
        <div>Me: {JSON.stringify(me)}</div>
        <div>PreviewPeers: {JSON.stringify(previewPeers)}</div>
        <div className="relative bg-zinc-800 aspect-video rounded-lg w-96 overflow-hidden">
          <video
            className="absolute w-full top-1/2 -translate-y-1/2"
            ref={videoRef}
            autoPlay
          />
        </div>
        <span> Video </span>
        <div className="relative bg-zinc-800 aspect-video rounded-lg w-96 overflow-hidden">
          <video
            className="absolute w-full top-1/2 -translate-y-1/2"
            ref={screenRef}
            autoPlay
            muted
          />
        </div>
        <span> Screen share </span>
        <div className=" flex gap-3">
          {Object.values(peers).map(
            (
              { cam, peerId, avatarUrl, shareVideo, shareAudio, displayName },
              i
            ) => (
              <>
                {shareVideo && (
                  <VideoElem
                    key={`screen-video-${peerId}`}
                    track={shareVideo}
                  />
                )}
                {shareAudio && (
                  <AudioElem
                    key={`screen-audio-${peerId}`}
                    track={shareAudio}
                  />
                )}
                {cam && <VideoElem key={`cam-${peerId}`} track={cam} />}
              </>
            )
          )}
          {Object.values(peers).map(({ mic, peerId }, i) => (
            <>{mic && <AudioElem key={`mic-${peerId}`} track={mic} />}</>
          ))}
        </div>
      </div>
      <div className="lg:grid-cols-3  grid w-full p-16">
        <div className="col-span-2	">
          <Input
            type="text"
            placeholder="Project ID"
            value={projectId}
            onChange={(e) => {
              localStorage.setItem("projectId", e.target.value);
              setProjectId(e.target.value);
            }}
          />
          <Input
            type="text"
            value={roomId}
            placeholder="Room ID "
            onChange={(e) => {
              localStorage.setItem("roomId", e.target.value);
              setRoomId(e.target.value);
            }}
          />
          <Input
            type="text"
            value={accessToken}
            placeholder="Access Token"
            onChange={(e) => {
              localStorage.setItem("accessToken", e.target.value);
              setAccessToken(e.target.value);
            }}
          />

          <div>Room</div>
          <div className="flex gap-3  w-full">
            <Button
              disabled={!initialize.isCallable}
              onClick={() => {
                initialize(projectId);
                // initialize("73p6-3gfkjMn5OmG6Ip_bsaM8t7ZYQqn"); // Local
                // initialize("pSNb4vwvAz7bbzQdVYCpHWHPO-BTV2oz"); // Prod
              }}
            >
              initialize()
            </Button>
            <Button
              disabled={!joinLobby.isCallable}
              onClick={() => {
                if (accessToken) joinLobby(roomId, accessToken);
                else joinLobby(roomId); //Local
                // joinLobby("sun-yyot-hus"); // Prod
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
            <Button disabled={!endRoom.isCallable} onClick={endRoom}>
              endRoom()
            </Button>
          </div>

          <div>Audio</div>
          <div className="flex gap-3">
            <Button
              disabled={!enumerateMicDevices.isCallable}
              onClick={async () => {
                const enumMicDevices = await enumerateMicDevices();
                console.log({ enumMicDevices });
              }}
            >
              enumerateMicDevices()
            </Button>
            <Button
              disabled={!fetchAudioStream.isCallable}
              onClick={async () => {
                const fetchedStream = await fetchAudioStream(
                  micDevices[0]?.deviceId
                );
                console.log({ fetchedStream });
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
              disabled={!enumerateCamDevices.isCallable}
              onClick={async () => {
                const enumCamDevices = await enumerateCamDevices();
                console.log({ enumCamDevices });
              }}
            >
              enumerateCamDevices()
            </Button>

            <Button
              disabled={!fetchVideoStream.isCallable}
              onClick={async () => {
                const fetchedStream = await fetchVideoStream(
                  camDevices[0]?.deviceId
                );
                console.log({ fetchedStream });
              }}
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
          <div>Screen Share</div>
          <div className="flex gap-3">
            <Button
              disabled={!fetchScreenShare.isCallable}
              onClick={fetchScreenShare}
            >
              fetchScreenShare()
            </Button>
            <Button
              disabled={!produceScreenShare.isCallable}
              onClick={() => {
                produceScreenShare(screenShareStream);
              }}
            >
              produceScreenShareVideo()
            </Button>
            <Button
              disabled={!stopScreenShare.isCallable}
              onClick={stopScreenShare}
            >
              stopScreenShare()
            </Button>

            <Button
              disabled={!stopProducingScreenShare.isCallable}
              onClick={stopProducingScreenShare}
            >
              stopProducingScreenShare()
            </Button>
          </div>
          <div>ACL</div>
          <div className="gap-3">
            <Input
              type="text"
              value={peerId}
              placeholder="Peer ID"
              onChange={(e) => setPeerId(e.target.value)}
            />

            <Button
              disabled={!changePeerRole.isCallable}
              onClick={() => changePeerRole(peerId, "host")}
            >
              changePeerRole(host)
            </Button>
            <Button
              disabled={!changePeerRole.isCallable}
              onClick={() => changePeerRole(peerId, "peer")}
            >
              changePeerRole(peer)
            </Button>

            <Button
              disabled={!changePeerRole.isCallable}
              onClick={() => changePeerRole(peerId, "listener")}
            >
              changePeerRole(listener)
            </Button>
            <Button
              disabled={!changePeerRole.isCallable}
              onClick={() => changePeerRole(me.meId, "listener")}
            >
              changePeerRole(melistener)
            </Button>
            <Button
              disabled={!changePeerRole.isCallable}
              onClick={() => changePeerRole(peerId, "speaker")}
            >
              changePeerRole(speaker)
            </Button>

            <br />
            <Input
              type="text"
              value={peerIdToKick}
              placeholder="Peer ID to kick"
              onChange={(e) => setPeerIdToKick(e.target.value)}
            />

            <Button
              disabled={!kickPeer.isCallable}
              onClick={() => kickPeer(peerIdToKick)}
            >
              kickPeer()
            </Button>
          </div>
          <div>App Utils</div>
          <div className="flex gap-3">
            <Input
              type="text"
              value={dName}
              placeholder="Display Name"
              onChange={(e) => setDName(e.target.value)}
            />

            <Button
              disabled={!setDisplayName.isCallable}
              onClick={() => setDisplayName(dName)}
            >
              setDisplayName()
            </Button>
            <Input
              type="text"
              value={avatarLink}
              placeholder="Avatar URL"
              onChange={(e) => setAvatarLink(e.target.value)}
            />

            <Button
              disabled={!changeAvatarUrl.isCallable}
              onClick={() => changeAvatarUrl(avatarLink)}
            >
              changeAvatarUrl()
            </Button>
          </div>

          <div className="flex gap-3 my-3">
            <Button
              disabled={!changeRoomControls.isCallable}
              onClick={() => changeRoomControls("roomLocked", true)}
            >
              lockRoom()
            </Button>
            <Button
              disabled={!changeRoomControls.isCallable}
              onClick={() => changeRoomControls("roomLocked", false)}
            >
              unlockRoom()
            </Button>
          </div>

          <Button
            disabled={!sendData.isCallable}
            onClick={() => sendData("*", { hello: "hello workrk" })}
          >
            sendData()
          </Button>
        </div>

        <div>{JSON.stringify(lobbyPeers)}</div>

        <div>
          <Button
            disabled={!admitPeer.isCallable}
            onClick={() => admitPeer(lobbyPeers.map(({ peerId }) => peerId))}
          >
            Admit All
          </Button>
          <Button
            disabled={!denyPeer.isCallable}
            onClick={() => denyPeer(lobbyPeers.map(({ peerId }) => peerId))}
          >
            Deny All
          </Button>
          {lobbyPeers.map(({ displayName, walletAddress, peerId }) => {
            return (
              <div key={peerId}>
                <Button
                  disabled={!admitPeer.isCallable}
                  onClick={() => admitPeer([peerId])}
                >
                  Admit Peer
                </Button>
                <Button
                  disabled={!denyPeer.isCallable}
                  onClick={() => denyPeer([peerId])}
                >
                  Deny Peer
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
