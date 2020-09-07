<template>
  <div class="page-wrapper">
    <transition
      name="fxPopup25"
      enter-active-class="animated fadeIn fast"
      leave-active-class="animated fadeOut fast"
      @after-leave="showResult = true"
    >
      <div
        v-if="!loading && !success && showAnimation"
        class="component-wrapper"
      >
        <div>
          <h4>{{ user.cat.name }}</h4>
        </div>
        <div class="avatarCat">
          <LoadingAnimationDots
            v-if="getUserId.cat.catPicture == null"
          ></LoadingAnimationDots>
          <img v-else class="catAvatar" :src="user.cat.catPicture" />
        </div>
        <img width="100%" :src="getPictureToUpload" />

        <input id="title" v-model="u_title" type="text" placeholder="Title" />

        <!-- Buttons -->

        <div
          v-show="!runUpload"
          data-test="login-btn"
          class="login-btn"
          @click="uploadCat"
        >
          Send my cat
        </div>
        <div v-show="runUpload" class="login-btn-hold">
          <LoadingAnimationDots></LoadingAnimationDots>
        </div>
        <div data-test="login-btn" class="login-btn" @click="backHome">
          Back
        </div>
      </div>
    </transition>
    <transition
      name="fxPopup25"
      enter-active-class="animated fadeIn fast"
      leave-active-class="animated fadeOut fast"
    >
      <div v-if="!loading && success && showResult" class="component-wrapper">
        <!----------->
        <!--Success-->
        <!----------->
        <div v-if="!loading && success && !error" class="popup column">
          <SuccessAnimation :animation="1"> </SuccessAnimation>
          <h4>Your cat is online !</h4>
          <div
            v-if="!loading && success"
            data-test="login-btn"
            class="login-btn"
            @click="backHome"
          >
            Back
          </div>
        </div>
        <!----------->
        <!-- Error -->
        <!----------->
        <div v-else class="popup">
          <div class="side">
            <SuccessAnimation :animation="0"> </SuccessAnimation>

            <p>photos uploaded</p>
            <h3>5/5</h3>
            <p>Please wait</p>
            <p>{{ timeRemaining }}</p>
            <div
              v-if="!loading && success"
              data-test="login-btn"
              class="login-btn"
              @click="backHome"
            >
              Back
            </div>
          </div>
          <div class="side">
            <h3>Or buy 5 more</h3>
            <div data-test="btn" class="btn">
              <span>5 x </span
              ><span><SVGCoin :width="40" :height="25"></SVGCoin></span>
            </div>
          </div>
        </div>
        <LoadingAnimation v-if="loading && !success"></LoadingAnimation>
      </div>
    </transition>
  </div>
</template>

<script>
import firebase from 'firebase'
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex'
import LoadingAnimation from '../components/AnimationLoading.vue'

import LoadingAnimationDots from '../components/AnimationLoadingData.vue'
import SuccessAnimation from '../components/AnimationSuccess.vue'
import SVGCoin from '../components/svg-coin.vue'

export default {
  components: {
    LoadingAnimation,
    SuccessAnimation,

    LoadingAnimationDots,
    SVGCoin
  },
  data() {
    return {
      photoImported: null,
      catAvatarUpdated: false,
      photoId: null,
      u_title: null,
      uploadValue: 0,

      loading: false,
      success: false,
      error: false,

      timeRemaining: '',

      showAnimation: false,
      showResult: false,
      runUpload: false
    }
  },
  computed: {
    ...mapState('authentication', ['user']),
    ...mapGetters('userData', ['getPictureToUpload']),
    ...mapGetters('authentication', ['getUserId'])
  },
  mounted() {
    setTimeout(() => {
      this.showAnimation = true
    }, 200)
    this.photoImported = this.getPictureToUpload
    this.setCameraOff()
    if (!this.photoImported) {
      this.$router.push({ name: 'home' })
    }
  },
  destroyed() {
    this.setCameraOn()
  },
  methods: {
    async testyCat() {
      await firebase
        .functions()
        .httpsCallable('checkLimitUpload')({
          data: this.user.cat.name
        })
        .then(response => {
          this.payload = response
        })

      return this.payload.data
    },
    async uploadCat() {
      this.runUpload = true
      const responseApproval = await this.testyCat()

      if (responseApproval.Approved === 1) {
        this.loading = true
        this.photoId = `${this.user.id}-${this.getRandomInt(0, 500000000)}`

        const storageRef = firebase
          .storage()
          .ref(`catPicture/${this.photoId}`)
          .putString(this.photoImported, 'data_url')
        storageRef.on(
          'state_changed',
          snapshot => {
            this.uploadValue =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          },
          error => {
            console.log(error.message)
          },
          () => {
            const payload = {
              PictureId: this.photoId,
              title: this.u_title
            }

            this.addPictureDB(payload)
            this.loading = false
            this.success = true
          }
        )
      } else {
        this.loading = false
        this.success = true
        this.error = true

        const calculDay = parseInt(
          (168 - responseApproval.TimebetweenVotes) / 24,
          10
        )
        const calculHours = Math.round(
          ((168 - responseApproval.TimebetweenVotes) / 24 - calculDay) * 24
        )

        this.timeRemaining = `${calculDay} days ${calculHours} hours`
      }
    },

    getRandomInt(min, max) {
      // Randomize number for photo ID
      min = Math.ceil(min)
      max = Math.floor(max)
      return Math.floor(Math.random() * (max - min)) + min
    },

    backHome() {
      this.loading = false
      this.success = false
      this.photoImported = null
      this.$router.push({ name: 'home' })
    },

    ...mapActions('authentication', ['addPictureDB', 'updateCatAvatar']),
    ...mapMutations('app', ['setCameraOff', 'setCameraOn'])
  }
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';

.component-wrapper {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  max-width: 600px;
  padding: 15px 0px;
  border: 1px solid;
  border-radius: 3px;
  background-color: rgba(255, 255, 255, 0.9);
  -webkit-box-shadow: $box-shadow-1;
  -moz-box-shadow: $box-shadow-1;
  box-shadow: $box-shadow-1;
  margin: 0px 10px;
  width: 100%;

  h1,
  h2,
  h3,
  h4 {
    margin: 0px;
  }
  img {
    width: 80%;
    margin: 5px;
  }
  .avatarCat {
    min-height: 64px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .catAvatar {
    width: 50px;
    animation: anim-catAvatar 0.5s;
  }
  input {
    width: 60%;
    padding: 10px;
    border-radius: 3px;
    border: 1px solid;
    -webkit-box-shadow: inset 0px 0px 9px -10px rgba(0, 0, 0, 0.75);
    -moz-box-shadow: inset 0px 0px 9px -10px rgba(0, 0, 0, 0.75);
    box-shadow: inset 0px 0px 9px -10px rgba(0, 0, 0, 0.75);

    @media only screen and (max-width: 768px) {
      width: 70%;
    }
  }
  .login-btn {
    margin: 5px;
    min-width: 128px;
    text-align: center;
    cursor: pointer;
    padding: 5px 20px;
    border: 1px solid;
    display: inline-block;
    border-radius: 3px;
    border-color: $border-color;

    &:hover {
      color: $vue-color;
      border-color: $vue-color;
    }
  }

  .login-btn-hold {
    margin: 5px;
    cursor: pointer;
    min-width: 128px;
    padding: 5px 20px;
    border: 1px solid;
    display: flex;
    justify-content: center;
    border-radius: 3px;
    border-color: $border-color;
  }

  .popup {
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 90%;

    .side {
      flex-basis: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .btn {
      background-color: $jaune-1;
      width: 140px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 5px;
      cursor: pointer;
      padding: 5px 5px;
      border: 1px solid;

      border-radius: 3px;
      border-color: $border-color;

      &:hover {
        background-color: $background-over;
      }

      span {
        display: flex;
        justify-content: center;
        flex-basis: 30%;
      }
    }
    p,
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      margin: 0px 0px;
    }
  }

  .column {
    flex-direction: column;
    h4 {
      text-align: center;
    }
  }
  @keyframes anim-catAvatar {
    0% {
      width: 0px;
    }

    100% {
      width: 50px;
      transform: rotate(360deg);
    }
  }
}
</style>
