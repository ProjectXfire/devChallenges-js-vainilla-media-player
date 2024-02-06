import { MediaPlayer } from "../../states";
import { type TCoverElements } from "../../types";
import "./cover.css";

const coverElem = document.createElement("img");
coverElem.src = "/images/cover-1.png";
coverElem.alt = "cover";
coverElem.className = "cover-image";
coverElem.id = "cover-image";

const containerElem = document.createElement("div");
containerElem.className = "cover-container";

const volumen = `
  <input id="volume-slider" class="volume-slider" min="0" max="100" type="range" />
  <button id="volume" class="volume-icon" type="button">
    <img src="/icons/volume.svg" />
  </button>
`;

export class Cover {
  coverElements: TCoverElements = {
    volume: null,
    volumeSlider: null,
    coverImage: null,
  };

  constructor() {
    this.mediaPlayer = MediaPlayer.instance();
  }

  private static cover: Cover;
  private mediaPlayer: MediaPlayer;

  public static instance() {
    if (!Cover.cover) Cover.cover = new Cover();
    return Cover.cover;
  }

  renderIn(elem: HTMLElement) {
    containerElem.appendChild(coverElem);
    containerElem.innerHTML += volumen;
    elem.appendChild(containerElem);
    this.setupElements();
    this.loadCover();
    this.setupListener();
  }

  setupListener() {
    const { volume, volumeSlider } = this.coverElements;
    document.addEventListener("update-data-track", this.updateCover.bind(this));
    volume?.addEventListener("click", this.handleVolume.bind(this));
    volumeSlider?.addEventListener("input", this.handleSliderVolume.bind(this));
  }

  setupElements() {
    const volume = document.getElementById("volume");
    const volumeSlider = document.getElementById("volume-slider");
    const coverImage = document.getElementById("cover-image");
    this.coverElements.volume = volume;
    this.coverElements.volumeSlider = volumeSlider;
    this.coverElements.coverImage = coverImage as HTMLImageElement;
  }

  updateCover(e: any) {
    const { coverUrl } = e.detail;
    const { coverImage } = this.coverElements;
    if (coverImage) coverImage.src = coverUrl;
  }

  loadCover() {
    const track = this.mediaPlayer.getSelectedTrack();
    const { coverImage } = this.coverElements;
    if (coverImage) coverImage.src = track.coverUrl;
  }

  handleSliderVolume() {
    const sliderValue = this.coverElements.volumeSlider as HTMLInputElement;
    const volumeEvent = new CustomEvent("update-volume", {
      detail: { value: sliderValue.value },
    });
    document.dispatchEvent(volumeEvent);
  }

  handleVolume() {
    const { volumeSlider } = this.coverElements;
    const isActive = volumeSlider?.classList.contains("active-slider");
    if (!isActive) {
      volumeSlider?.classList.add("active-slider");
    } else {
      volumeSlider?.classList.remove("active-slider");
    }
  }
}
