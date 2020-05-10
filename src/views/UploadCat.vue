<template>
  <div class="page-wrapper">
    <img :src="getPictureToUpload" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      photoImported: null
    }
  },
  computed: {
    ...mapGetters('userData', ['getPictureToUpload'])
  }
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';
</style>
