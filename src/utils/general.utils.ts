export interface IAnimationData {
  atFrame: number[][];
  atFrameColors: string[][];
}

export interface IBars {
  heights: number[];
  colors: string[];
}

export interface IAnimationState {
  frameDelay: number;
  maxFrameDelay: number;
  minFrameDelay: number;
  currentFrame: number;
  playback: boolean;
}

export const barColors = {
  NOT_SORTED: "#D1D5DB",
  BEING_SORTED: "#247dc7",
  BEING_COMPARED_AGAINST: "#ff3d7f",
  SORTED: "#228b22",
  POTENTIALLY_SORTED: "#816797",
  SELECTED: "#daa520",
} as const;

//returns a random number between min and max (both included); if we don't want the max bound to be included, we can simply remove the plus one
export const randomIntFromBound = (maxBound: number, minBound: number = 5): number => {
  return Math.floor(Math.random() * (maxBound - minBound + 1)) + minBound;
};

export const getWindowDimensions = () => {
  const { clientWidth: width, clientHeight: height } = globalThis.document.documentElement;
  return {
    width,
    height,
  };
};
