/**
   * Formats a time duration in hours into a human-readable string.
   * The function converts hours into minutes and returns a string representation
   * in the format "Xh" if the duration is in hours or "Xh Ym" if it includes minutes.
   * @function
   * @param {number} hours - The time duration in hours.
   * @returns {string} - A human-readable time string in the format "Xh" or "Xh Ym".
   */
export function formatTime(hours) {
  const minutes = Math.round(hours * 60);

  if (minutes < 60) {
    return `${minutes}m`;
  } else {
    const hoursPart = Math.floor(minutes / 60);
    const minutesPart = minutes % 60;

    if (minutesPart === 0) {
      return `${hoursPart}h`;
    } else {
      return `${hoursPart}h ${minutesPart}m`;
    }
  }
}