<template>
  <div class="component">
    <LoadingAnimation v-if="v_loading && !voteDone"></LoadingAnimation>
    <transition
      name="fxPopup"
      enter-active-class="animated fadeIn fast"
      leave-active-class="animated fadeOut fast"
      @after-enter="v_loading = false"
      @after-leave="animationDone"
    >
      <div
        v-show="loadingDone && voteDone && !v_xpGenerator"
        class="component-wrapper"
      >
        <StarRating
          :key="refreshStars"
          v-model="var_VoteSelected"
          :max-rating="6"
          :show-rating="false"
          :rounded-corners="true"
          :read-only="v_loading || v_readOnly"
          :star-size="starSize"
          @rating-selected="vote_selected"
        ></StarRating>
        <RandomCat :key="randomVar" @loadingDone="loadingIsDone"></RandomCat>
      </div>
    </transition>
    <div v-if="v_xpGenerator" :key="randomVar" class="component-wrapper">
      <XPpopup :xp="u_xp" :xp2="old_xp" @closed="xpPopupClosed"></XPpopup>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters, mapMutations } from 'vuex'
import StarRating from 'vue-star-rating'
import Firebase from 'firebase'
import XPpopup from './xpPopup.vue'
import RandomCat from './CatLoadingSystem.vue'
import LoadingAnimation from './AnimationLoading.vue'

export default {
  components: {
    StarRating,
    RandomCat,
    XPpopup,
    LoadingAnimation
  },
  data() {
    return {
      var_VoteSelected: 0,
      old_xp: 0,
      u_xp: 0,
      starSize: 45,
      loadingDone: false,
      voteDone: true,
      randomVar: 0,
      v_randomCat: true,
      v_loading: false,
      v_xpGenerator: false,
      v_addNewCat: true,
      v_readOnly: false,
      refreshStars: 10250,

      payloadCat: null
    }
  },
  computed: {
    ...mapState('userData', ['user_data']),
    ...mapGetters('userData', ['getUpdatedUserData'])
  },
  created() {
    this.old_xp = this.user_data.xp
    this.setCameraOn()
  },

  methods: {
    vote_selected() {
      this.setCameraOff()
      this.loadingDone = false
      this.voteDone = false

      this.v_readOnly = true
      this.refreshStars += 1

      const dateNow = new Date()

      Firebase.functions()
        .httpsCallable('addXP')({ data: 'id' })
        .then(newXP => {
          // this.randomVar += 1
          this.u_xp = newXP.data.totalXP
          this.v_xpGenerator = true
          this.voteDone = true

          // update the cat stats
          Firebase.firestore()
            .doc(`CatPictures/${this.payloadCat.catID}`)
            .update({
              votes: Firebase.firestore.FieldValue.increment(
                this.var_VoteSelected
              )
            })

          Firebase.firestore()
            .collection(
              `CatPictures/${
                this.payloadCat.catID
              }/log/${dateNow.getFullYear()}/${dateNow.getMonth() + 1}`
            )
            .add({
              date: dateNow,
              userID: Firebase.auth().currentUser.uid,
              note: this.var_VoteSelected
            })

          Firebase.firestore()
            .doc(
              `CatPictures/${
                this.payloadCat.catID
              }/log/${dateNow.getFullYear()}/${dateNow.getMonth() +
                1}/monthlyReport/`
            )
            .update({
              votesTotal: Firebase.firestore.FieldValue.increment(
                this.var_VoteSelected
              )
            })
            .then(() => {
              this.var_VoteSelected = 0
            })
            .catch(error => {
              if (error) {
                Firebase.firestore()
                  .doc(
                    `CatPictures/${
                      this.payloadCat.catID
                    }/log/${dateNow.getFullYear()}/${dateNow.getMonth() +
                      1}/monthlyReport/`
                  )
                  .set({
                    votesTotal: Firebase.firestore.FieldValue.increment(
                      this.var_VoteSelected
                    )
                  })
                this.var_VoteSelected = 0
              } else {
                this.var_VoteSelected = 0
              }
            })
        })
    },
    animationDone() {
      this.randomVar += 1
      this.v_loading = true
    },
    loadingIsDone(payload) {
      this.payloadCat = payload.payload

      this.loadingDone = true
    },
    timer() {
      setTimeout((this.v_loading = false), 500)
    },
    xpPopupClosed() {
      //  this.randomVar += 1
      this.old_xp = this.getUpdatedUserData.xp
      this.v_xpGenerator = false
      this.v_readOnly = false
    },
    ...mapActions('userData', ['refreshXP']),
    ...mapMutations('app', ['setCameraOff', 'setCameraOn'])
  }
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';
.component {
  width: 100%;

  .component-wrapper {
    display: flex;
    align-content: center;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    //max-width: 600px;
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
}
</style>
