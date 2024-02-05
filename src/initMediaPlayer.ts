import { Controls, Cover, Detail } from "./components";
import { MediaPlayer } from "./states";

export function initMediaPlayer(container: HTMLElement) {
  // Init Media Player
  MediaPlayer.instance();
  // Init components
  const cover = Cover.instance();
  const detail = Detail.instance();
  const controls = Controls.instance();
  // Render components
  cover.renderIn(container);
  detail.renderIn(container);
  controls.renderIn(container);
}
