// src/components/game/VoiceChat.jsx
import { useEffect, useRef, useState } from 'react';
import { getSocket } from '../../services/socket.js';
import SimplePeer from 'simple-peer';

export default function VoiceChat({ roomId }) {
  const socket = getSocket();
  const peerRef = useRef(null);
  const audioRef = useRef(null);
  const streamRef = useRef(null);
  
  const [isMuted, setIsMuted] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isEnabled) return;

    const setupVoiceChat = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        
        const peer = new SimplePeer({ 
          initiator: true, 
          stream, 
          trickle: false 
        });

        peer.on('signal', signal => {
          socket.emit('offer', { roomId, offer: signal });
        });

        peer.on('stream', remoteStream => {
          if (audioRef.current) {
            audioRef.current.srcObject = remoteStream;
            setIsConnected(true);
          }
        });

        peer.on('error', err => {
          console.error('Peer error:', err);
          setError('Voice chat connection failed');
          setIsConnected(false);
        });

        socket.on('answer', ({ answer }) => {
          try {
            peer.signal(answer);
          } catch (err) {
            console.error('Signal error:', err);
          }
        });

        socket.on('offer', ({ offer }) => {
          try {
            peer.signal(offer);
            peer.on('signal', signal => {
              socket.emit('answer', { roomId, answer: signal });
            });
          } catch (err) {
            console.error('Offer signal error:', err);
          }
        });

        peerRef.current = peer;
      } catch (err) {
        console.error('Media access error:', err);
        setError('Microphone access denied');
      }
    };

    setupVoiceChat();

    return () => {
      if (peerRef.current) {
        peerRef.current.destroy();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      socket.off('answer');
      socket.off('offer');
    };
  }, [socket, roomId, isEnabled]);

  const toggleMute = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVoiceChat = () => {
    setIsEnabled(prev => !prev);
    if (isEnabled) {
      // Disable voice chat
      if (peerRef.current) peerRef.current.destroy();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      setIsConnected(false);
      setIsMuted(false);
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">🎙️</span>
          <h3 className="text-lg font-bold text-white">Voice Chat</h3>
        </div>
        
        {isConnected && (
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-400 font-semibold">Connected</span>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {/* Enable/Disable Voice Chat */}
        <button
          onClick={toggleVoiceChat}
          className={`w-full px-4 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 ${
            isEnabled
              ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
              : 'bg-white/10 text-white/70 hover:bg-white/20'
          }`}
        >
          {isEnabled ? '✓ Voice Chat Enabled' : 'Enable Voice Chat'}
        </button>

        {/* Mute/Unmute Button */}
        {isEnabled && (
          <button
            onClick={toggleMute}
            className={`w-full px-4 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 ${
              isMuted
                ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg'
                : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
            }`}
          >
            {isMuted ? '🔇 Unmute' : '🔊 Mute'}
          </button>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
            <p className="text-red-200 text-sm">⚠️ {error}</p>
          </div>
        )}

        {/* Info */}
        {!isEnabled && (
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
            <p className="text-blue-200 text-xs">
              💡 Enable voice chat to talk with your opponent in real-time
            </p>
          </div>
        )}
      </div>

      {/* Hidden Audio Element */}
      <audio ref={audioRef} autoPlay className="hidden" />
    </div>
  );
}
