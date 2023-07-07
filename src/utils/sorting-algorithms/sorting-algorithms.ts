import { swapTwo, addFrame } from "./sorting-algorithms.utils";
import { barColors } from "../general.utils";

import type { IBars, IAnimationData } from "../general.utils";

interface ISortReturn {
  sortedArray: number[];
  animationData: IAnimationData;
}

//#region Bubble Sort
function bubbleSort(barData: IBars): ISortReturn {
  const localArr = [...barData.heights];
  const localColors = [...barData.colors];
  const animationData: IAnimationData = {
    atFrame: [],
    atFrameColors: [],
  };

  addFrame(animationData, localArr, localColors);

  for (let indexA = 0; indexA < localArr.length; indexA++) {
    for (let indexB = 0; indexB < localArr.length - indexA - 1; indexB++) {
      const a = indexB + 1;
      const b = indexB;
      if (localArr[a] < localArr[b]) {
        localColors[a] = barColors.BEING_SORTED;
        localColors[b] = barColors.BEING_COMPARED_AGAINST;
        addFrame(animationData, localArr, localColors);
        localColors[a] = barColors.SELECTED;
        localColors[b] = barColors.SELECTED;
        swapTwo(localArr, a, b);
        addFrame(animationData, localArr, localColors);
        localColors[a] = barColors.NOT_SORTED;
        localColors[b] = barColors.NOT_SORTED;
      } else {
        localColors[a] = barColors.BEING_SORTED;
        localColors[b] = barColors.BEING_COMPARED_AGAINST;
        addFrame(animationData, localArr, localColors);
        localColors[a] = barColors.NOT_SORTED;
        localColors[b] = barColors.NOT_SORTED;
      }
    }
    localColors[localArr.length - indexA - 1] = barColors.SORTED;
    addFrame(animationData, localArr, localColors);
  }
  return { sortedArray: localArr, animationData };
}
//#endregion

//#region Insertion Sort
function insertionSort(barData: IBars): ISortReturn {
  const localArr = [...barData.heights];
  const localColors = [...barData.colors];
  const animationData: IAnimationData = {
    atFrame: [],
    atFrameColors: [],
  };

  addFrame(animationData, localArr, localColors);

  for (let indexA = 1; indexA < localArr.length; indexA++) {
    for (let indexB = indexA - 1; indexB > -1; indexB--) {
      const a = indexB + 1;
      const b = indexB;

      const exColorA = localColors[a];
      const exColorB = localColors[b];

      if (localArr[a] < localArr[b]) {
        localColors[a] = barColors.BEING_COMPARED_AGAINST;
        localColors[b] = barColors.BEING_SORTED;
        addFrame(animationData, localArr, localColors);
        localColors[a] = barColors.SELECTED;
        localColors[b] = barColors.SELECTED;
        swapTwo(localArr, a, b);
        addFrame(animationData, localArr, localColors);
        localColors[a] = exColorA;
        localColors[b] = exColorB;
      } else {
        localColors[a] = barColors.BEING_SORTED;
        localColors[b] = barColors.BEING_COMPARED_AGAINST;
        addFrame(animationData, localArr, localColors);
        localColors[a] = exColorA;
        localColors[b] = exColorB;
      }
    }
    localColors[indexA - 1] = barColors.POTENTIALLY_SORTED;
    addFrame(animationData, localArr, localColors);
  }
  localColors[localColors.length - 1] = barColors.POTENTIALLY_SORTED;
  addFrame(animationData, localArr, localColors);

  //Sort Compeleted
  localColors.fill(barColors.SORTED);
  addFrame(animationData, localArr, localColors);
  return { sortedArray: localArr, animationData };
}
//#endregion

//#region Selection Sort
function selectionSort(barData: IBars): ISortReturn {
  const localArr = [...barData.heights];
  const localColors = [...barData.colors];
  const animationData: IAnimationData = {
    atFrame: [],
    atFrameColors: [],
  };

  addFrame(animationData, localArr, localColors);

  let currentMin: number;

  for (let indexA = 0; indexA < localArr.length; indexA++) {
    currentMin = indexA;
    localColors[indexA] = barColors.SELECTED;
    addFrame(animationData, localArr, localColors);

    for (let indexB = indexA + 1; indexB < localArr.length; indexB++) {
      localColors[indexB] = barColors.BEING_COMPARED_AGAINST;
      addFrame(animationData, localArr, localColors);

      if (localArr[indexB] < localArr[currentMin]) {
        if (currentMin !== indexA) {
          localColors[currentMin] = barColors.NOT_SORTED;
        }
        currentMin = indexB;
        localColors[currentMin] = barColors.BEING_SORTED;
        addFrame(animationData, localArr, localColors);
      } else {
        localColors[indexB] = barColors.NOT_SORTED;
      }
    }
    if (currentMin !== indexA) {
      swapTwo(localArr, currentMin, indexA);
    }
    addFrame(animationData, localArr, localColors);

    localColors[currentMin] = barColors.NOT_SORTED;
    localColors[indexA] = barColors.SORTED;
  }
  localColors[localColors.length - 1] = barColors.SORTED;
  addFrame(animationData, localArr, localColors);

  return { sortedArray: localArr, animationData };
}
//#endregion

//#region Merge Sort
function merge(
  localArr: number[],
  localColors: string[],
  animationData: IAnimationData,
  left: number,
  middle: number,
  right: number,
): void {
  //size of left and right sub-arrays
  const leftArraySize = middle - left + 1;
  const rightArraySize = right - middle;

  const leftArr: number[] = new Array(leftArraySize);
  const rightArr: number[] = new Array(rightArraySize);

  //fill left and right sub-arrays
  for (let index = 0; index < leftArraySize; index++) {
    leftArr[index] = localArr[left + index];
  }
  for (let index = 0; index < rightArraySize; index++) {
    rightArr[index] = localArr[middle + 1 + index];
  }

  let indexOfLeftSubArray = 0;
  let indexOfRightSubArray = 0;
  let indexOfMergedArray = left;
  //marge temp arrays to real array

  while (indexOfLeftSubArray < leftArraySize && indexOfRightSubArray < rightArraySize) {
    const exColorM = localColors[indexOfMergedArray];
    if (leftArr[indexOfLeftSubArray] <= rightArr[indexOfRightSubArray]) {
      const comparedElementIndex = localArr.indexOf(rightArr[indexOfLeftSubArray]); //Might be wrong if there are multiple of a single num
      const exColorL = localColors[comparedElementIndex];
      localColors[comparedElementIndex] = barColors.BEING_COMPARED_AGAINST;
      localColors[indexOfMergedArray] = barColors.BEING_SORTED;
      localArr[indexOfMergedArray] = leftArr[indexOfLeftSubArray];
      addFrame(animationData, localArr, localColors);
      localColors[comparedElementIndex] = exColorL;

      indexOfLeftSubArray++;
    } else {
      const comparedElementIndex = localArr.indexOf(rightArr[indexOfRightSubArray]); //Might be wrong if there are multiple of a single num
      const exColorR = localColors[comparedElementIndex];
      localColors[comparedElementIndex] = barColors.BEING_COMPARED_AGAINST;
      localColors[indexOfMergedArray] = barColors.BEING_SORTED;
      localArr[indexOfMergedArray] = rightArr[indexOfRightSubArray];
      addFrame(animationData, localArr, localColors);
      localColors[comparedElementIndex] = exColorR;

      indexOfRightSubArray++;
    }
    localColors[indexOfMergedArray] = exColorM;
    addFrame(animationData, localArr, localColors);

    indexOfMergedArray++;
  }

  while (indexOfLeftSubArray < leftArraySize) {
    //extra element in left array
    const comparedElementIndex = localArr.indexOf(rightArr[indexOfLeftSubArray]); //Might be wrong if there are multiple of a single num
    const exColorM = localColors[indexOfMergedArray];
    const exColorL = localColors[comparedElementIndex];

    localArr[indexOfMergedArray] = leftArr[indexOfLeftSubArray];
    localColors[comparedElementIndex] = barColors.BEING_COMPARED_AGAINST;
    localColors[indexOfMergedArray] = barColors.BEING_SORTED;
    addFrame(animationData, localArr, localColors);
    localColors[indexOfMergedArray] = exColorM;
    localColors[comparedElementIndex] = exColorL;
    addFrame(animationData, localArr, localColors);

    indexOfLeftSubArray++;
    indexOfMergedArray++;
  }

  while (indexOfRightSubArray < rightArraySize) {
    //extra element in right array
    const comparedElementIndex = localArr.indexOf(rightArr[indexOfRightSubArray]); //Might be wrong if there are multiple of a single num
    const exColorM = localColors[indexOfMergedArray];
    const exColorR = localColors[comparedElementIndex];
    localArr[indexOfMergedArray] = rightArr[indexOfRightSubArray];
    localColors[comparedElementIndex] = barColors.BEING_COMPARED_AGAINST;
    localColors[indexOfMergedArray] = barColors.BEING_SORTED;
    addFrame(animationData, localArr, localColors);
    localColors[indexOfMergedArray] = exColorM;
    localColors[comparedElementIndex] = exColorR;
    addFrame(animationData, localArr, localColors);

    indexOfRightSubArray++;
    indexOfMergedArray++;
  }
}

function runMergeSort(
  localArr: number[],
  localColors: string[],
  animationData: IAnimationData,
  start: number,
  end: number,
): void {
  if (start < end) {
    const middle = Math.floor((start + end) / 2);
    //left side
    runMergeSort(localArr, localColors, animationData, start, middle);
    localColors.fill(barColors.POTENTIALLY_SORTED, start, middle + 1);
    addFrame(animationData, localArr, localColors);
    //right side
    runMergeSort(localArr, localColors, animationData, middle + 1, end);
    localColors.fill(barColors.POTENTIALLY_SORTED, middle + 1, end + 1);
    addFrame(animationData, localArr, localColors);

    //merge the arrays
    merge(localArr, localColors, animationData, start, middle, end);
  }
}

function mergeSort(barData: IBars): ISortReturn {
  const localArr = [...barData.heights];
  const localColors = [...barData.colors];
  const animationData: IAnimationData = {
    atFrame: [],
    atFrameColors: [],
  };

  addFrame(animationData, localArr, localColors);

  if (localArr.length <= 1) {
    return { sortedArray: localArr, animationData };
  }

  runMergeSort(localArr, localColors, animationData, 0, localArr.length - 1);

  localColors.fill(barColors.SORTED);
  addFrame(animationData, localArr, localColors);

  return { sortedArray: localArr, animationData };
}
//#endregion

//#region Quick Sort
function getPivotIndex(
  localArr: number[],
  localColors: string[],
  animationData: IAnimationData,
  start: number,
  end: number,
): number {
  let swapIdx: number = start;
  const pivotValue: number = localArr[start];
  localColors[start] = barColors.SELECTED;
  addFrame(animationData, localArr, localColors);
  for (let i = start + 1; i <= end; i++) {
    if (localArr[i] < pivotValue) {
      swapIdx++;
      swapTwo(localArr, i, swapIdx);

      const exColorA = localColors[i];
      const exColorB = localColors[swapIdx];

      localColors[i] = barColors.BEING_SORTED;
      localColors[swapIdx] = barColors.BEING_COMPARED_AGAINST;
      addFrame(animationData, localArr, localColors);
      localColors[i] = exColorA;
      localColors[swapIdx] = exColorB;
      addFrame(animationData, localArr, localColors);
    }
  }
  swapTwo(localArr, start, swapIdx);

  localColors[start] = barColors.BEING_SORTED;
  localColors[swapIdx] = barColors.BEING_COMPARED_AGAINST;
  addFrame(animationData, localArr, localColors);
  localColors[start] = barColors.SELECTED;
  localColors[swapIdx] = barColors.POTENTIALLY_SORTED;
  addFrame(animationData, localArr, localColors);
  return swapIdx;
}

function runQuickSort(
  localArr: number[],
  localColors: string[],
  animationData: IAnimationData,
  start: number,
  end: number,
): void {
  if (start < end) {
    const pivotIndex = getPivotIndex(localArr, localColors, animationData, start, end);
    //left side
    runQuickSort(localArr, localColors, animationData, start, pivotIndex - 1);
    localColors.fill(barColors.SORTED, start, pivotIndex);
    addFrame(animationData, localArr, localColors);

    //right side
    runQuickSort(localArr, localColors, animationData, pivotIndex + 1, end);
    localColors.fill(barColors.SORTED, pivotIndex + 1, end + 1);
    addFrame(animationData, localArr, localColors);
  }
}

function quickSort(barData: IBars): ISortReturn {
  const localArr = [...barData.heights];
  const localColors = [...barData.colors];
  const animationData: IAnimationData = {
    atFrame: [],
    atFrameColors: [],
  };

  addFrame(animationData, localArr, localColors);

  if (localArr.length <= 1) {
    return { sortedArray: localArr, animationData };
  }

  runQuickSort(localArr, localColors, animationData, 0, localArr.length - 1);

  localColors.fill(barColors.SORTED);
  addFrame(animationData, localArr, localColors);

  return { sortedArray: localArr, animationData };
}
//#endregion

export { insertionSort, bubbleSort, selectionSort, mergeSort, quickSort };
