<script setup lang="ts">
interface IBarProps {
  height: number;
  width: number;
  backgroundColor: string;
}
const props = defineProps<IBarProps>();
</script>

<template>
  <div
    class="bar"
    :title="height.toString()"
    :style="{
      backgroundColor: props.backgroundColor,
      height: `${props.height}px`,
      width: `${props.width}px`,
    }"
  />
</template>

<style scoped>
.bar {
  margin: 0 1px;
}
</style>
