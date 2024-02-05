import { initMediaPlayer } from "./initMediaPlayer.ts";
import "./style.css";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <article class="media-player" id="media-player">
  </article>
`;

const mediaPlayerElem = document.getElementById("media-player")!;

initMediaPlayer(mediaPlayerElem);
