// src/services/sound.js
import { Howl } from 'howler';

const BASE = import.meta.env.VITE_API_URL.replace('/api', '');

export const playClick = () => new Howl({ src: [`${BASE}/sounds/click.wav`] }).play();
export const playWin = () => new Howl({ src: [`${BASE}/sounds/win.mp3`] }).play();
export const playLose = () => new Howl({ src: [`${BASE}/sounds/lose.mp3`] }).play();