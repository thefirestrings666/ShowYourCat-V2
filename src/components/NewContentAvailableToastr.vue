<template>
  <div class="wrapper">
    <template v-if="refreshingApp">
      Loading new content...
    </template>
    <template v-else>
      New content available. Please
      <span class="refresh-btn" @click="$emit('refresh')">REFRESH</span>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    refreshingApp: Boolean
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  padding: 0px 0px;
  background-color: #333;
  opacity: 0.9;
  color: white;
  display: flex;
  z-index: 1;
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;

  .refresh-btn {
    margin-left: 5px;
    text-decoration: underline;
    cursor: pointer;
  }
}
</style>
