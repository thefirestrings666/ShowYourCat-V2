<template>
  <div class="wrapper">
    <XPProgress></XPProgress>
    Current XP : {{ user_data.xp }} New XP : {{ xp }} XP Max : {{ xpMax }}
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import XPProgress from 'k-progress'

export default {
  components: {
    XPProgress
  },
  props: {
    xp: Number
  },
  data() {
    return {
      xpMax: 100
    }
  },
  computed: {
    ...mapState('userData', ['user_data'])
  },
  methods: { ...mapActions('userData', ['refreshXP']) }
}
</script>

<style lang="scss" scoped>
.wrapper {
  width: 95%;
  display: flex;
  flex-direction: column;
  align-items: center;

  .progressBar {
    width: 100%;
    background-color: grey;
    .progressLevel {
      width: 0%;
      height: 30px;
      background-color: rgb(89, 89, 255);
    }
  }
}
</style>
