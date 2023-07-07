<script setup lang="ts">
import BarComponent from "./BarComponent.vue";

import type { IBars } from "@/utils/general.utils";
interface IBarContainer {
  bars: IBars;
  barWidth: number;
}

const props = defineProps<IBarContainer>();
</script>

<template>
  <div class="bar-container">
    <BarComponent
      v-for="(height, index) in bars.heights"
      :key="index"
      :height="height"
      :width="barWidth"
      :backgroundColor="props.bars.colors[index]"
    />
  </div>
</template>

<style scoped>
.bar-container {
  flex: 2;
  display: flex;
  align-items: flex-end;
  margin-bottom: 2vh;
}
</style>
