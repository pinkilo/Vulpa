/**
 *
 * @param iMin inclusive minimum
 * @param eMax exclusive maximum
 * @param {boolean=[true]} round down to integer
 */
const randFromRange = (iMin: number, eMax: number, round = true): number => {
  let val = iMin + Math.random() * eMax
  if (round) val = Math.floor(val)
  return val
}

export { randFromRange }
