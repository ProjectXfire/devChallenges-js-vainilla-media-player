export function convertDurationInString(time: number): string {
  if (isNaN(time)) return "00:00";
  const minLeft = Math.floor(time / 60)
    .toString()
    .padStart(2, "0");
  const minRight = Math.floor(time % 60)
    .toString()
    .padStart(2, "0");
  return `${minLeft}:${minRight}`;
}

export function convertCurrentTimeInString(time: number): string {
  if (isNaN(time)) return "00:00";
  const minLeftCurrent = Math.floor(time / 60)
    .toString()
    .padStart(2, "0");
  const minRightCurrent = Math.floor(time % 60)
    .toString()
    .padStart(2, "0");
  return `${minLeftCurrent}:${minRightCurrent}`;
}

export function getPercentageCurrentTime(
  currentTime: number,
  duration: number
) {
  const percentage = (currentTime / duration) * 100;
  const format = percentage.toFixed(2);
  return format;
}

export function getTimeWithPercentage(
  percentageTime: number,
  duration: number
) {
  const newCurrentTime = duration * (percentageTime / 100);
  return newCurrentTime;
}
