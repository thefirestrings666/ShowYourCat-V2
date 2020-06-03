<template>
  <div v-if="user" key="user.emailVerified" class="page-wrapper">
    <CatRatingSystem v-if="user.emailVerified"> </CatRatingSystem>
    <notActivated v-else-if="!user.emailVerified"> </notActivated>
    <LoadingAnimation v-else></LoadingAnimation>
  </div>
  <div v-else-if="user === null" class="page-wrapper">
    <authentication> </authentication>
  </div>
  <div v-else-if="user === undefined" class="page-wrapper">
    <LoadingAnimation></LoadingAnimation>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import authentication from '../components/Authentication.vue'
import CatRatingSystem from '../components/CatRatingSystem.vue'
import notActivated from '../components/notActivated.vue'
import LoadingAnimation from '../components/AnimationLoading.vue'

export default {
  components: {
    authentication,
    CatRatingSystem,
    notActivated,
    LoadingAnimation
  },
  data() {
    return {}
  },
  head() {
    return {
      title: {
        inner: 'Home'
      },
      meta: [
        {
          name: 'description',
          content: `${this.appTitle} home page`,
          id: 'desc'
        }
      ]
    }
  },
  computed: {
    ...mapState('app', ['appTitle', 'networkOnLine']),
    ...mapGetters('authentication', ['isUserLoggedIn']),
    ...mapState('authentication', ['user'])
  },
  created() {}
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';
</style>
