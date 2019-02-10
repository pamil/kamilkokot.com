export default function formatReadinTime(minutes) {
  if (minutes === 1) {
    return `1 minute read`;
  }

  return `${minutes} minutes read`;
}
