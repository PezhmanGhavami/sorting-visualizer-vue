<script setup lang="ts">
import { ref } from "vue";

import Play from "@/assets/svgs/play.svg";
import Pause from "@/assets/svgs/pause.svg";
import Cog from "@/assets/svgs/cog.svg";

import type { IAnimationState } from "@/utils/general.utils";
interface IBarInfo {
  barCount: number;
  maxBarsForWidth: number;
}
interface INavProps {
  barInfo: IBarInfo;
  animationFrames: number;
  animationState: IAnimationState;
  resetTheArray: () => void;
  bubbleSort: () => void;
  insertionSort: () => void;
  selectionSort: () => void;
  mergeSort: () => void;
  quickSort: () => void;
  togglePlayback: () => void;
  changeAnimationSpeed: (value: number) => void;
  changeBarCount: (value: number) => void;
  changeCurrentFrame: (value: number) => void;
}
type SortType = "BUBBLE" | "INSERTION" | "SELECTION" | "MERGE" | "QUICK";

const props = defineProps<INavProps>();

const sortType = ref<SortType>("BUBBLE");
const openModal = ref(false);

const toggleModal = () => {
  openModal.value = !openModal.value;
};

const handleFlow = () => {
  if (props.animationFrames) {
    return props.togglePlayback();
  }
  switch (sortType.value) {
    case "BUBBLE":
      props.bubbleSort();
      break;
    case "INSERTION":
      props.insertionSort();
      break;
    case "SELECTION":
      props.selectionSort();
      break;
    case "MERGE":
      props.mergeSort();
      break;
    case "QUICK":
      props.quickSort();
      break;
  }
};
</script>

<template>
  <nav class="navbar">
    <div v-if="openModal" @click="toggleModal" class="modal-overlay">
      <div @click.stop class="modal-container">
        <span title="Close Settings" @click="toggleModal" class="close"> &times; </span>
        <div class="nav-settings">
          <div class="nav-settings-item">
            <button
              class="button"
              type="button"
              title="Click to generate a new array"
              @click="resetTheArray"
            >
              Generate New Array
            </button>
          </div>

          <div class="nav-settings-item">
            <label htmlFor="bar-count"> Bar Count: </label>
            <span>
              {{ ` ${barInfo.barCount} Bars ` }}
              <span
                class="info"
                tabIndex="{0}"
                :data-info="`${
                  animationState.playback
                    ? '⚠️To change the bar count you need to first stop the animation⚠️'
                    : 'The bigger the width of your screen, the more bars you can fit in it. (Try landscape mode)'
                }`"
              >
                {{ " ⓘ" }}
              </span>
            </span>
            <input
              type="range"
              name="barCount"
              id="bar-count"
              :title="
                animationState.playback
                  ? 'Animation is running - Disabled'
                  : barInfo.barCount.toString()
              "
              :disabled="animationState.playback"
              min="{2}"
              :max="barInfo.maxBarsForWidth"
              step="{1}"
              :value="barInfo.barCount"
              @input="(event) => changeBarCount(parseInt((event.currentTarget as HTMLInputElement).value) || 2)"
            />
          </div>

          <div class="nav-settings-item">
            <label htmlFor="animation-speed"> Frame Delay: </label>
            <span>
              {{ animationState.frameDelay }}ms
              <span class="info" tabIndex="{0}" data-info="Lower is faster"> {{ " ⓘ" }} </span>
            </span>
            <input
              type="range"
              name="animationSpeed"
              id="animation-speed"
              :min="animationState.minFrameDelay"
              :max="animationState.maxFrameDelay"
              step="{1}"
              :value="animationState.frameDelay"
              @input="(event) => changeAnimationSpeed(parseInt((event.currentTarget as HTMLInputElement).value) || 1)"
            />
          </div>

          <div class="nav-settings-item">
            <label htmlFor="sort-type"> Sort Algorithm: </label>
            <select v-model="sortType" id="sort-type" name="sortType">
              <option value="BUBBLE">Bubble Sort</option>
              <option value="INSERTION">Insertion Sort</option>
              <option value="SELECTION">Selection Sort</option>
              <option value="MERGE">Merge Sort</option>
              <option value="QUICK">Quick Sort</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <div class="nav-controllers">
      <button class="sort-settings" title="Settings">
        <Cog @click="toggleModal" class="svg-component" />
      </button>

      <input
        type="range"
        name="timeline"
        id="sort-timeline"
        :title="
          !Boolean(animationFrames) ? '' : `${animationState.currentFrame} / ${animationFrames - 1}`
        "
        :value="animationState.currentFrame"
        :max="animationFrames - 1"
        :disabled="!Boolean(animationFrames)"
        @input="(event) => changeCurrentFrame(parseInt((event.currentTarget as HTMLInputElement).value) || 0)"
      />

      <button
        class="flow-control"
        type="button"
        @click="handleFlow"
        :title="animationState.playback ? 'Pause' : 'Play'"
      >
        <Pause v-if="animationState.playback" class="svg-component" />
        <Play v-else class="svg-component" />
      </button>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  position: relative;
  padding: 0 1rem;
  display: flex;
  justify-content: space-around;
  align-items: center;
  min-width: 100%;
  min-height: 10vh;
}

.modal-overlay {
  z-index: 1000;
  position: fixed;
  inset: 0;
  background-color: #0008;
}

.modal-container {
  z-index: 1001;
  position: fixed;
  top: 50%;
  left: 50%;
  margin: 0 auto;
  padding: 3.5rem 0;
  transform: translate(-50%, -50%);
  width: 95%;
  max-width: 350px;
  background-color: var(--background-color-2);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: var(--border-radius);
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.close {
  z-index: 1002;
  position: absolute;
  top: -4px;
  right: 0px;
  font-size: 2.5rem;
  cursor: pointer;
  padding: 0 1rem;
}
.close:hover {
  filter: brightness(var(--brightens));
}

.nav-settings {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  min-width: 100%;
}

.nav-settings-item {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 1vmax 0;
  width: 100%;
}

select#sort-type {
  background-color: var(--background-color-2);
  color: var(--text-color);
  padding: 0.2rem 0.5rem;
  border: #4b5563 2px solid;
  border-radius: var(--border-radius);
  cursor: pointer;
}
select#sort-type:hover {
  filter: brightness(var(--brightens));
}

#bar-count,
#animation-speed {
  min-width: 42%;
}

#bar-count,
#animation-speed,
#sort-timeline {
  cursor: pointer;
}

.nav-controllers {
  display: flex;
  justify-content: space-around;
  align-items: center;
  min-width: 100%;
}

#sort-timeline {
  flex: 1;
}

.button {
  color: var(--text-color);
  background-color: var(--button-success);
  border: 0;
  border-radius: var(--border-radius);
  cursor: pointer;
  padding: 0.25rem 0.5rem;
}
.button:hover {
  filter: brightness(var(--brightens));
}

.flow-control,
.sort-settings {
  background-color: transparent;
  border: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
}

.svg-component {
  width: 35px;
  height: 35px;
  fill: var(--text-color);
  margin: 2vmax;
  cursor: pointer;
}
.svg-component:hover {
  filter: opacity(var(--brightens));
}

.info {
  position: relative;
  cursor: help;
}
.info:hover::after,
.info:focus::after {
  content: attr(data-info);
  padding: 1vmax;
  width: max-content;
  max-width: 35vw;
  text-align: center;
  border: 1px solid #6b7280;
  border-radius: var(--border-radius);
  position: absolute;
  background: #374151;
  z-index: 1002;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

@media only screen and (min-width: 992px) {
  .modal-container {
    max-width: 380px;
  }
}
</style>
