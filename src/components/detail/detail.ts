import { MediaPlayer } from "../../states";
import "./detail.css";

const detailElem = document.createElement("div");
detailElem.className = "detail";

const component = `
  <p id="title"></p>
  <p id="author"></p>
`;

export class Detail {
  constructor() {
    detailElem.innerHTML = component;
    this.detailComponent = detailElem;
    this.mediaPlayer = MediaPlayer.instance();
  }

  private mediaPlayer: MediaPlayer;
  private static detail: Detail;
  private detailComponent: HTMLDivElement;

  static instance() {
    if (!Detail.detail) Detail.detail = new Detail();
    return Detail.detail;
  }

  renderIn(elem: HTMLElement) {
    elem.appendChild(this.detailComponent);
    this.setDetailData();
    this.setupListener();
  }

  setupListener() {
    document.addEventListener(
      "update-data-track",
      this.updateDetail.bind(this)
    );
  }

  updateDetail(e: any) {
    const { title, author } = e.detail;
    const titleElem = document.getElementById("title");
    const authorElem = document.getElementById("author");
    if (titleElem) titleElem.innerText = title;
    if (authorElem) authorElem.innerText = author;
  }

  setDetailData(): void {
    const track = this.mediaPlayer.getSelectedTrack();
    const titleElem = document.getElementById("title");
    const authorElem = document.getElementById("author");
    if (titleElem) titleElem.innerText = track.title;
    if (authorElem) authorElem.innerText = track.author;
  }
}
