// src/components/game/VoiceChat.jsx
import { useEffect, useRef } from 'react';
import { getSocket } from '../../services/socket.js';
import SimplePeer from 'simple-peer';

export default function VoiceChat({ roomId }) {
  const socket = getSocket();
  const peerRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      const peer = new SimplePeer({ initiator: true, stream, trickle: false });

      peer.on('signal', signal => {
        socket.emit('offer', { roomId, offer: signal });
      });

      peer.on('stream', remoteStream => {
        audioRef.current.srcObject = remoteStream;
      });

      socket.on('answer', ({ answer }) => peer.signal(answer));
      socket.on('offer', ({ offer }) => {
        peer.signal(offer);
        peer.on('signal', signal => socket.emit('answer', { roomId, answer: signal }));
      });

      peerRef.current = peer;
    });

    return () => {
      peerRef.current?.destroy();
    };
  }, [socket, roomId]);

  return <audio ref={audioRef} autoPlay className="hidden" />;
}