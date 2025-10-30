// src/services/sound.js
import { Howl } from 'howler';

export const playClick = () => new Howl({ src: ['/sounds/click.wav'] }).play();
export const playWin = () => new Howl({ src: ['/sounds/win.mp3'] }).play();
export const playLose = () => new Howl({ src: ['/sounds/lose.mp3'] }).play();