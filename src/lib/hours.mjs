const CLOSED = 'Geschlossen';

/**
 * Builds the short "Mo–Fr 9:00–18:00 • Sa 9:00–13:00" summary line.
 *
 * Deliberately has no hard-coded fallback times: if a day is missing from the
 * content store, its segment is dropped. Showing nothing is recoverable;
 * showing opening hours the shop does not keep is not.
 *
 * @param {{ day: string, time: string, shortDay: string }[]} hours
 * @param {{ separator?: string }} [options]
 * @returns {string}
 */
export function formatHoursLine(hours, { separator = ' • ' } = {}) {
  const list = Array.isArray(hours) ? hours : [];
  const timeFor = (shortDay) => {
    const time = list.find((item) => item?.shortDay === shortDay)?.time?.trim();
    return time && time !== CLOSED ? time : '';
  };

  const weekday = timeFor('Mo');
  const saturday = timeFor('Sa');

  return [
    weekday && `Mo–Fr ${weekday}`,
    saturday && `Sa ${saturday}`
  ].filter(Boolean).join(separator);
}
