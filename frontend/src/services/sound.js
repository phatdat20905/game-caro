// src/services/sound.js
import { Howl } from 'howler';

const BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

export const playClick = () => new Howl({ src: [`${BASE}/sounds/click.wav`], volume: 0.5 }).play();
export const playWin = () => new Howl({ src: [`${BASE}/sounds/win.mp3`], volume: 0.7 }).play();
export const playLose = () => new Howl({ src: [`${BASE}/sounds/lose.mp3`], volume: 0.7 }).play();
export const playNotify = () => new Howl({ src: [`${BASE}/sounds/notify.wav`], volume: 0.6 }).play();
