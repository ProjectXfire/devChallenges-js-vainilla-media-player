import { MediaPlayer } from "../../states";
import "./cover.css";

const coverElem = document.createElement("img");
coverElem.src = "/images/cover-1.png";
coverElem.alt = "cover";
coverElem.className = "cover-image";

export class Cover {
  coverComponent: HTMLImageElement;

  constructor() {
    this.coverComponent = coverElem;
    this.mediaPlayer = MediaPlayer.instance();
  }

  private static cover: Cover;
  private mediaPlayer: MediaPlayer;

  public static instance() {
    if (!Cover.cover) Cover.cover = new Cover();
    return Cover.cover;
  }

  renderIn(elem: HTMLElement) {
    elem.appendChild(this.coverComponent);
    this.loadCover();
    this.setupListener();
  }

  setupListener() {
    document.addEventListener("update-data-track", this.updateCover.bind(this));
  }

  updateCover(e: any) {
    const { coverUrl } = e.detail;
    this.coverComponent.src = coverUrl;
  }

  loadCover() {
    const track = this.mediaPlayer.getSelectedTrack();
    this.coverComponent.src = track.coverUrl;
  }
}
