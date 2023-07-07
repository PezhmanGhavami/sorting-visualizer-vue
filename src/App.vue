<script setup lang="ts">
import { ref, watch, computed, onMounted, onBeforeUnmount } from "vue";

import NavbarComponent from "./components/NavbarComponent.vue";
import BarContainerComponent from "./components/BarContainerComponent.vue";

import { barColors, getWindowDimensions, randomIntFromBound } from "./utils/general.utils";
import {
  bubbleSort,
  insertionSort,
  selectionSort,
  mergeSort,
  quickSort,
} from "./utils/sorting-algorithms/sorting-algorithms";

import type { IBars, IAnimationData, IAnimationState } from "./utils/general.utils";

const getInitialBars = (): IBars => ({ heights: [], colors: [] });
const getInitialDataSeries = (): IAnimationData => ({ atFrame: [], atFrameColors: [] });
const getInitialAnimationState = (): IAnimationState => ({
  frameDelay: 250,
  maxFrameDelay: 500,
  minFrameDelay: 1,
  currentFrame: 0,
  playback: false,
});

const bars = ref(getInitialBars());
const dataSeries = ref(getInitialDataSeries());
const windowDimensions = ref(getWindowDimensions());
const animationState = ref(getInitialAnimationState());
const barCount = ref(10);
const showRepoToast = ref(true);

const maxBarsForWidth = computed(() => Math.floor(windowDimensions.value.width / 5));
const barHeightMax = computed(
  () => windowDimensions.value.height - windowDimensions.value.height * 0.2,
);
const barWidth = computed(
  () =>
    (windowDimensions.value.width - windowDimensions.value.width * 0.5) / bars.value.heights.length,
);

const togglePlayback = () => {
  animationState.value = {
    ...animationState.value,
    playback: !animationState.value.playback,
  };
  console.log("playback changed");
};

const closeToast = () => {
  showRepoToast.value = false;
};

const changeAnimationSpeed = (value: number) => {
  const { maxFrameDelay, minFrameDelay } = animationState.value;

  value = value > maxFrameDelay ? maxFrameDelay : value < minFrameDelay ? minFrameDelay : value;

  animationState.value.frameDelay = value;
};

const changeBarCount = (value: number) => {
  barCount.value = getCorrectBarCount(value);
};

const changeCurrentFrame = (value: number) => {
  value =
    value > dataSeries.value.atFrame.length
      ? dataSeries.value.atFrame.length
      : value < 0
      ? 0
      : value;
  animationState.value.currentFrame = value;
};

const setupAnimation = (animationData: IAnimationData) => {
  dataSeries.value = { ...dataSeries.value, ...animationData };

  togglePlayback();
};

const animateBubbleSort = () => {
  const { animationData } = bubbleSort(bars.value);
  setupAnimation(animationData);
};

const animateInsertionSort = () => {
  const { animationData } = insertionSort(bars.value);
  setupAnimation(animationData);
};

const animateSelectionSort = () => {
  const { animationData } = selectionSort(bars.value);
  setupAnimation(animationData);
};

const animateMergeSort = () => {
  const { animationData } = mergeSort(bars.value);
  setupAnimation(animationData);
};

const animateQuickSort = () => {
  const { animationData } = quickSort(bars.value);
  setupAnimation(animationData);
};

const handleResize = () => {
  windowDimensions.value = getWindowDimensions();
};

const getCorrectBarCount = (currentBars: number): number => {
  if (currentBars > maxBarsForWidth.value) {
    return maxBarsForWidth.value;
  }
  if (currentBars < 2) {
    return 2;
  }
  return currentBars;
};

// [barHeightMax, barCount, getCorrectBarCount];
const resetBarArray = () => {
  const localArray: number[] = [];
  for (let i = 0; i < barCount.value; i++) {
    localArray.push(randomIntFromBound(barHeightMax.value));
  }

  const correctBarCount = getCorrectBarCount(barCount.value);

  if (correctBarCount !== barCount.value) {
    barCount.value = correctBarCount;
  }

  bars.value = {
    heights: [...localArray],
    colors: new Array(barCount.value).fill(barColors.NOT_SORTED),
  };
  dataSeries.value = getInitialDataSeries();
  animationState.value = getInitialAnimationState();
};

const runTheAnimation = () => {
  console.log("runAnimation");
  if (animationState.value.currentFrame < dataSeries.value.atFrame.length) {
    console.log("frame ok");

    if (animationState.value.playback) {
      console.log("playbakc ok");

      setTimeout(() => {
        bars.value = {
          colors: [...dataSeries.value.atFrameColors[animationState.value.currentFrame]],
          heights: [...dataSeries.value.atFrame[animationState.value.currentFrame]],
        };
        animationState.value = {
          ...animationState.value,
          currentFrame: animationState.value.currentFrame + 1,
        };
      }, animationState.value.frameDelay);
    } else {
      console.log("playback not ok");

      bars.value = {
        colors: [...dataSeries.value.atFrameColors[animationState.value.currentFrame]],
        heights: [...dataSeries.value.atFrame[animationState.value.currentFrame]],
      };
    }
  } else if (
    animationState.value.playback &&
    dataSeries.value.atFrame.length &&
    animationState.value.currentFrame >= dataSeries.value.atFrame.length
  ) {
    console.log("STOP");

    togglePlayback();
  }
};

onMounted(() => {
  resetBarArray();

  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
});

watch([dataSeries, animationState], runTheAnimation);
watch([barCount], resetBarArray);
</script>

<template>
  <div class="sorting-visualizer-container">
    <NavbarComponent
      :resetTheArray="resetBarArray"
      :changeAnimationSpeed="changeAnimationSpeed"
      :changeBarCount="changeBarCount"
      :bubbleSort="animateBubbleSort"
      :insertionSort="animateInsertionSort"
      :selectionSort="animateSelectionSort"
      :mergeSort="animateMergeSort"
      :quickSort="animateQuickSort"
      :barInfo="{
        maxBarsForWidth,
        barCount,
      }"
      :animationState="animationState"
      :animationFrames="dataSeries.atFrame.length"
      :changeCurrentFrame="changeCurrentFrame"
      :togglePlayback="togglePlayback"
    />
    <BarContainerComponent :bars="bars" :barWidth="barWidth" />
    <div v-if="showRepoToast" @click="closeToast" class="repo-toast">
      <span title="Close repository link" @click="closeToast"> &times; </span>
      <p>This project is made for educational purposes. You can find the source code here:</p>
      <a
        href="https://github.com/PezhmanGhavami/sorting-visualizer"
        target="_blank"
        rel="noreferrer"
        @click.stop
      >
        https://github.com/PezhmanGhavami/sorting-visualizer
      </a>
    </div>
  </div>
</template>

<style scoped>
.sorting-visualizer-container {
  max-width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.repo-toast {
  width: 100%;
  height: fit-content;
  position: absolute;
  user-select: none;
  top: 0;
  padding: 1.6rem 1.2rem;
  background-color: var(--background-color-2);
  overflow-wrap: break-word;
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  animation: slidein 500ms ease 1;
}
.repo-toast a {
  color: #93c5fd;
  text-decoration: none;
  display: block;
}
.repo-toast a:hover {
  text-decoration: underline;
}
.repo-toast span {
  position: absolute;
  top: -3px;
  right: 0px;
  font-size: 2rem;
  cursor: pointer;
  padding: 0 1rem;
}
.repo-toast span:hover {
  filter: brightness(var(--brightens));
}

@keyframes slidein {
  from {
    transform: translateX(100%);
  }

  to {
    transform: translateX(0);
  }
}

@media only screen and (min-width: 992px) {
  .repo-toast {
    width: 336px;
    right: 8px;
    top: 8px;
    border-radius: var(--border-radius);
  }
}
</style>
