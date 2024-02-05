import { MediaPlayer } from "../../states";
import { type TControlsElements } from "../../types";
import "./controls.css";

const controlsElem = document.createElement("div");

const progress = `
  <div class="progress">
    <div class="progress__time">
      <p id="track-current">00:00</p>
      <p id="track-time">00:00</p>
    </div>
    <div class="progress__bar">
      <div class="progress__bar-background"></div>
      <div id="track-bar" class="progress__bar-track"></div>
      <div id="track-background" class="progress__bar-action"></div>
    </div>
  </div>
`;

const controls = `
  <div class="controls">
    <button class="controls__action" type="button" id="previous">
      <img src="/icons/Stop_and_play_fill-1.svg" alt="control" />
    </button>
    <button class="controls__action play is-active" type="button" id="play">
      <img src="/icons/Play_fill.svg" alt="control" />
    </button>
    <button class="controls__action play" type="button" id="pause">
      <img src="/icons/Pause.svg" alt="control" />
    </button>
    <button class="controls__action" type="button" id="next">
      <img src="/icons/Stop_and_play_fill.svg" alt="control" />
    </button>
  </div>
`;

export class Controls {
  constructor() {
    controlsElem.innerHTML = progress;
    controlsElem.innerHTML += controls;
    this.controlsComponent = controlsElem;
    this.mediaPlayer = MediaPlayer.instance();
  }

  private static controls: Controls;
  private mediaPlayer: MediaPlayer;
  private controlsComponent: HTMLDivElement;
  private isPlaying: boolean = false;
  private elements: TControlsElements = {
    playElem: null,
    pauseElem: null,
    previousElem: null,
    nextElem: null,
    currentTimeElem: null,
    timeElem: null,
    trackBar: null,
    trackBackground: null,
  };

  public static instance(): Controls {
    if (!Controls.controls) Controls.controls = new Controls();
    return Controls.controls;
  }

  renderIn(elem: HTMLElement) {
    elem.appendChild(this.controlsComponent);
    this.setupElements();
    this.setupListener();
  }

  getIsPlaying() {
    return this.isPlaying;
  }

  setIsPlaying(value: boolean) {
    this.isPlaying = value;
  }

  setTrackTime(time: string) {
    const startTimeElem = document.getElementById("track-time");
    if (startTimeElem) startTimeElem.innerText = time;
  }

  setCurrentTime(currentTime: string) {
    const currentTimeElem = document.getElementById("track-current");
    if (currentTimeElem) currentTimeElem.innerText = currentTime;
  }

  updateProgressBar(currentTimeInPercentage: number) {
    const trackBarTimeElem = document.getElementById("track-bar");
    if (trackBarTimeElem)
      trackBarTimeElem.style.width = `${currentTimeInPercentage}%`;
  }

  setupElements() {
    this.elements.playElem = document.getElementById("play");
    this.elements.pauseElem = document.getElementById("pause");
    this.elements.previousElem = document.getElementById("previous");
    this.elements.nextElem = document.getElementById("next");
    this.elements.currentTimeElem = document.getElementById("track-current");
    this.elements.timeElem = document.getElementById("track-time");
    this.elements.trackBar = document.getElementById("track-bar");
    this.elements.trackBackground = document.getElementById("track-background");
  }

  setupListener() {
    const { playElem, pauseElem, nextElem, previousElem, trackBackground } =
      this.elements;
    playElem?.addEventListener("click", this.play.bind(this));
    pauseElem?.addEventListener("click", this.pause.bind(this));
    previousElem?.addEventListener("click", this.previous.bind(this));
    nextElem?.addEventListener("click", this.next.bind(this));
    trackBackground?.addEventListener("click", this.changeTimeTrack.bind(this));
    document.addEventListener(
      "update-track-time",
      this.listenCurrentTime.bind(this)
    );
  }

  private listenCurrentTime(e: any) {
    const { minDuration, minCurrentTime, percentageCurrentTime } = e.detail;
    if (this.elements.timeElem) this.elements.timeElem.innerText = minDuration;
    if (this.elements.currentTimeElem)
      this.elements.currentTimeElem.innerText = minCurrentTime;
    if (this.elements.trackBar)
      this.elements.trackBar.style.width = `${percentageCurrentTime}%`;
  }

  changeTimeTrack(e: MouseEvent): void {
    const trackBgElem = this.elements.trackBackground;
    if (!trackBgElem) return;
    const currentPos = e.clientX - trackBgElem.getBoundingClientRect().left;
    const sizeElem = trackBgElem.offsetWidth;
    const currentPosPercentage = ((currentPos / sizeElem) * 100).toFixed(2);
    this.mediaPlayer.changeCurrentTime(Number(currentPosPercentage));
  }

  play() {
    const { playElem, pauseElem } = this.elements;
    playElem?.classList.remove("is-active");
    pauseElem?.classList.add("is-active");
    this.mediaPlayer.startPlaying();
  }

  pause() {
    const { playElem, pauseElem } = this.elements;
    playElem?.classList.add("is-active");
    pauseElem?.classList.remove("is-active");
    this.mediaPlayer.pausePlaying();
  }

  next() {
    const { playElem, pauseElem } = this.elements;
    playElem?.classList.remove("is-active");
    pauseElem?.classList.add("is-active");
    this.mediaPlayer.nextPlaying();
  }

  previous() {
    const { playElem, pauseElem } = this.elements;
    playElem?.classList.remove("is-active");
    pauseElem?.classList.add("is-active");
    this.mediaPlayer.previousPlaying();
  }
}
