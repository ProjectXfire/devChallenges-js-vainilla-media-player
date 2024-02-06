import { type TTrack } from "../types";
import { tracks } from "../data";
import {
  convertCurrentTimeInString,
  convertDurationInString,
  getPercentageCurrentTime,
  getTimeWithPercentage,
} from "../helper";

export class MediaPlayer {
  constructor() {
    this.tracks = tracks;
    this.audio = new Audio();
    this.audio.src = tracks[this.currentIndexSong].audioUrl;
    this.audio.volume = 0.5;
    this.selectedTrack = tracks[this.currentIndexSong];
    this.tracks = tracks;
    this.setupListener();
  }

  private static mediaPlayer: MediaPlayer;
  private currentIndexSong: number = 0;
  private tracks: TTrack[] = [];
  private audio: HTMLAudioElement;
  private selectedTrack: TTrack;

  public static instance(): MediaPlayer {
    if (!MediaPlayer.mediaPlayer) MediaPlayer.mediaPlayer = new MediaPlayer();
    return MediaPlayer.mediaPlayer;
  }

  setupListener() {
    this.audio.addEventListener("timeupdate", this.calculateTime.bind(this));
    this.audio.addEventListener("ended", this.autoPlay.bind(this));
    document.addEventListener("update-volume", this.updateVolumen.bind(this));
  }

  getSelectedTrack(): TTrack {
    return this.selectedTrack;
  }

  private calculateTime() {
    const { duration, currentTime } = this.audio;
    const minDuration = convertDurationInString(duration);
    const minCurrentTime = convertCurrentTimeInString(currentTime);
    const percentageCurrentTime = getPercentageCurrentTime(
      currentTime,
      duration
    );
    const calculateEvent = new CustomEvent("update-track-time", {
      detail: { minDuration, minCurrentTime, percentageCurrentTime },
    });
    document.dispatchEvent(calculateEvent);
  }

  private updateInfoTrack() {
    const infoDataEvent = new CustomEvent("update-data-track", {
      detail: {
        coverUrl: this.selectedTrack.coverUrl,
        title: this.selectedTrack.title,
        author: this.selectedTrack.author,
      },
    });
    document.dispatchEvent(infoDataEvent);
  }

  private autoPlay() {
    const nextSongIndex = this.currentIndexSong + 1;
    if (nextSongIndex < this.tracks.length) {
      this.currentIndexSong = nextSongIndex;
      this.selectedTrack = tracks[nextSongIndex];
    } else {
      this.currentIndexSong = 0;
      this.selectedTrack = tracks[0];
    }
    this.audio.src = this.selectedTrack.audioUrl;
    this.updateInfoTrack();
    this.startPlaying();
  }

  private updateVolumen(e: any) {
    const { value } = e.detail;
    this.audio.volume = value / 100;
  }

  changeCurrentTime(newTimePercentage: number) {
    const { duration } = this.audio;
    const newTime = getTimeWithPercentage(newTimePercentage, duration);
    this.audio.currentTime = newTime;
  }

  startPlaying() {
    this.audio.play();
  }

  pausePlaying() {
    this.audio.pause();
  }

  nextPlaying() {
    const newIndex = this.currentIndexSong + 1;
    if (newIndex < this.tracks.length) {
      this.currentIndexSong = newIndex;
      this.selectedTrack = this.tracks[newIndex];
    } else {
      this.currentIndexSong = 0;
      this.selectedTrack = this.tracks[0];
    }
    this.updateInfoTrack();
    this.audio.src = this.selectedTrack.audioUrl;
    this.startPlaying();
  }

  previousPlaying() {
    const newIndex = this.currentIndexSong - 1;
    if (newIndex < 0) {
      this.currentIndexSong = this.tracks.length - 1;
      this.selectedTrack = this.tracks[this.tracks.length - 1];
    } else {
      this.currentIndexSong = newIndex;
      this.selectedTrack = this.tracks[newIndex];
    }
    this.updateInfoTrack();
    this.audio.src = this.selectedTrack.audioUrl;
    this.startPlaying();
  }
}
