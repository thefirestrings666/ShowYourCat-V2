<template>
  <div class="wrapper">
    <progress-bar :val="50" :max="100"></progress-bar>
    Current XP : {{ user_data.xp }} New XP : {{ xp }} XP Max : {{ xpMax }}
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

import ProgressBar from 'vue-simple-progress'

export default {
  components: {
    ProgressBar
  },
  props: {
    xp: Number
  },

  data() {
    return {
      xpMax: 100,
      convertedCurrentXp: 0
    }
  },
  computed: {
    ...mapState('userData', ['user_data'])
  },
  mounted() {
    this.convertedCurrentXp = (this.$props.xp / this.xpMax) * 100
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
}
</style>
