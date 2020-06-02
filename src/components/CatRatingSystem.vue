<template>
  <div>
    <transition
      name="fxPopup"
      enter-active-class="animated fadeIn fast"
      leave-active-class="animated fadeOut fast"
      @after-leave="animationDone"
      @after-enter="v_loading = false"
    >
      <div v-show="loadingDone" class="component-wrapper">
        <StarRating
          v-model="var_VoteSelected"
          :max-rating="6"
          :show-rating="false"
          :rounded-corners="true"
          :read-only="v_loading"
          :star-size="starSize"
          @rating-selected="vote_selected"
        ></StarRating>
        <RandomCat :key="randomVar" @loadingDone="loadingIsDone"></RandomCat>
      </div>
    </transition>
    <LoadingAnimation v-show="!loadingDone && v_loading"></LoadingAnimation>
  </div>
</template>

<script>
import StarRating from 'vue-star-rating'
import Firebase from 'firebase'
import { mapActions } from 'vuex'
import RandomCat from './CatLoadingSystem.vue'
import LoadingAnimation from './AnimationLoading.vue'

export default {
  components: {
    StarRating,
    RandomCat,
    LoadingAnimation
  },
  data() {
    return {
      var_VoteSelected: 0,
      starSize: 45,
      loadingDone: false,
      randomVar: 0,
      v_randomCat: true,
      v_loading: false
    }
  },
  methods: {
    vote_selected() {
      this.loadingDone = false
      this.loadingDone = false

      setTimeout(() => (this.var_VoteSelected = 0), 0)

      Firebase.functions()
        .httpsCallable('addXP')({ data: 'id' })
        .then(newXP => {
          this.refreshXP(newXP)
          this.v_loading = false
        })

      // to do
    },
    animationDone() {
      this.randomVar += 1
      this.v_loading = true
    },
    loadingIsDone() {
      this.loadingDone = true
    },
    timer() {
      setTimeout((this.v_loading = false), 500)
    },
    ...mapActions('userData', ['refreshXP'])
  }
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';

.component-wrapper {
  display: flex;
  align-content: center;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 600px;
  padding: 15px 0px;
  // border: 1px solid;
  border-radius: 3px;
  background-color: rgba(255, 255, 255, 0.9);
  -webkit-box-shadow: $box-shadow-1;
  -moz-box-shadow: $box-shadow-1;
  box-shadow: $box-shadow-1;
  margin: 0px 10px;

  margin-top: 10px;
}
</style>
