export default interface IImageDim {
  xOriginal: number
  yOriginal: number
  xCurrent: number
  yCurrent: number
}

export function makeIImageDim(
  xOrig: number,
  yOrig: number,
  xCurr: number,
  yCurr: number
): IImageDim {
  return {
    xOriginal: xOrig,
    yOriginal: yOrig,
    xCurrent: xCurr,
    yCurrent: yCurr,
  }
}
