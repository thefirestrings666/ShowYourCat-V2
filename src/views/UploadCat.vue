<template>
  <div class="page-wrapper">
    <div class="component-wrapper">
      <img v-if="!loading && !success" width="100%" :src="getPictureToUpload" />
      <LoadingAnimation v-if="loading && !success"></LoadingAnimation>
      <SuccessAnimation v-if="!loading && success"></SuccessAnimation>
      <input
        v-if="!loading && !success"
        id="title"
        v-model="u_title"
        type="text"
        placeholder="Title"
      />

      <div
        v-if="!loading && !success"
        data-test="login-btn"
        class="login-btn"
        @click="uploadCat"
      >
        Send my cat
      </div>
      <div
        v-if="!loading && success"
        data-test="login-btn"
        class="login-btn"
        @click="backHome"
      >
        Back
      </div>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase'
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex'
import LoadingAnimation from '../components/AnimationLoading.vue'
import SuccessAnimation from '../components/AnimationSuccess.vue'

export default {
  components: {
    LoadingAnimation,
    SuccessAnimation
  },
  data() {
    return {
      photoImported: null,
      photoId: null,
      u_title: null,
      uploadValue: 0,

      loading: false,
      success: false
    }
  },
  computed: {
    ...mapState('authentication', ['user']),
    ...mapGetters('userData', ['getPictureToUpload'])
  },
  mounted() {
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
    uploadCat() {
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

    ...mapActions('app', ['addPictureDB']),
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
}
</style>
