<template>
  <header class="navbar" :class="{ offline: !networkOnLine }">
    <div class="headerWrapper">
      <router-link v-if="isUserLoggedIn && networkOnLine" to="/home">
        <SvgMiniLogo></SvgMiniLogo>
      </router-link>

      <div
        v-if="isUserLoggedIn && networkOnLine"
        class="logo-top-container-connected"
      >
        <SvgLogoTop></SvgLogoTop>
      </div>

      <div v-else class="logo-top-container">
        <SvgLogoTop></SvgLogoTop>
      </div>

      <div v-if="isUserLoggedIn && networkOnLine" class="userPanel">
        <div class="userScore">
          <div>
            <SvgUserData motif="1"></SvgUserData>

            <p v-if="xp || xp == 0">
              <AnimatedNumber
                :value="xp"
                :round="1"
                :duration="2000"
              ></AnimatedNumber
              >/<AnimatedNumber :value="xpToReach" :round="1"></AnimatedNumber>
            </p>
            <p v-else>
              <loadingAnimation></loadingAnimation>
            </p>
          </div>
          <div>
            <SvgUserData motif="2"></SvgUserData>

            <p v-if="level || level == 0">
              <AnimatedNumber
                :value="level"
                :round="1"
                :duration="500"
              ></AnimatedNumber>
            </p>
            <p v-else>
              <loadingAnimation></loadingAnimation>
            </p>
          </div>
          <div>
            <SvgUserData motif="3"></SvgUserData>

            <p v-if="coins || coins == 0" class="p-coins">
              <AnimatedNumber
                :value="coins"
                :round="1"
                :duration="500"
              ></AnimatedNumber>
            </p>
            <p v-else>
              <loadingAnimation></loadingAnimation>
            </p>
          </div>
        </div>

        <div class="userPicture">
          <img
            v-if="
              isUserLoggedIn &&
                networkOnLine &&
                getUpdatedPhoto.isPictureUpdated
            "
            class="user-picture"
            :src="getUpdatedPhoto.photoURL"
            @click="logout"
          />

          <p v-else-if="!getUpdatedPhoto.isPictureUpdated">
            <loadingAnimation></loadingAnimation>
          </p>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import firebase from 'firebase/app'
// import UsersDB from '@/firebase/users-db'
import { mapGetters, mapState } from 'vuex'
import AnimatedNumber from 'animated-number-vue'

import loadingAnimation from '@/components/AnimationLoadingData.vue'
import SvgMiniLogo from '@/components/svg-mini-logo.vue'
import SvgLogoTop from '@/components/svg-logo-top.vue'

import SvgUserData from '@/components/svg-user-data.vue'

export default {
  components: {
    AnimatedNumber,
    SvgMiniLogo,
    SvgLogoTop,
    SvgUserData,
    loadingAnimation
  },
  props: {
    xp: {
      type: Number
    },
    level: {
      type: Number
    },
    coins: {
      type: Number
    },
    xpToReach: {
      type: Number
    }
  },
  computed: {
    ...mapGetters('authentication', ['isUserLoggedIn', 'getUpdatedPhoto']),
    ...mapState('authentication', ['user']),
    ...mapState('app', ['networkOnLine', 'appTitle', 'appShortTitle'])
  },
  methods: {
    async loadPicture() {
      const userPicture = await firebase
        .storage()
        .ref(`avatars/${firebase.auth().currentUser.uid}`)
        .getDownloadURL()
      return userPicture
    },
    async logout() {
      await firebase.auth().signOut()
    },
    goHome() {
      this.$router.push({ name: 'home' })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';

@font-face {
  font-family: 'softy';
  src: url('../assets/font/softy-webfont.woff') format('woff');
}

.navbar {
  display: flex;
  justify-content: space-between;
  z-index: 20;
  margin-bottom: 5px;
  -webkit-box-shadow: $box-shadow-1;
  -moz-box-shadow: $box-shadow-1;
  box-shadow: $box-shadow-1;
  height: $navbar-height;
  background-color: $navbar-color;
  // box-sizing: border-box;
  // border-bottom: 1px solid #eaecef;
  // line-height: 1.55rem;
  width: 100%;
  .headerWrapper {
    width: 888px;
    margin: auto;
    display: flex;
    justify-content: space-between;
    @media (max-width: 888px) {
      width: 100%;
    }
    a {
      display: flex;
      align-items: center;
    }
    .title-desktop {
      display: inline;
    }
    .title-mobile {
      display: none;
    }
    @media (max-width: 500px) {
      // padding: 0.7rem 0.7rem;
      .can-hide {
        display: none;
      }
      .title-desktop {
        display: none;
      }
      .title-mobile {
        display: none;
        margin: auto;
        position: relative;
      }
    }
    .site-name {
      font-size: 1.3rem;
      font-weight: 600;
      color: $border-color;
      position: relative;
    }
    .logo {
      height: 35px;
      width: 35px;
      margin-left: 10px;
    }
    .logo-top-container {
      display: flex;
      width: 100vw;
      position: absolute;
      left: 0px;
      top: 0px;
      justify-content: flex-start;
      height: 59px;
      z-index: -1;
      .logo-middle {
        width: 40%;
        margin: auto;
        max-width: 200px;
        @media screen and (min-width: 600px) {
          width: 20%;
        }
      }
      .logo-middle-connected {
        // display: none;
        //  position: relative;
        //  margin: auto;
        width: 100%;
        @media screen and (min-width: 600px) {
          display: block;
          width: 20%;
          margin: auto;
        }
        @media screen and (min-width: 1000px) {
          display: block;
        }
      }
    }
    // CSS for connected user
    .logo-top-container-connected {
      display: flex;
      width: 50%;
      align-items: center;
      z-index: -1;
      justify-content: center;
      @media screen and (min-width: 600px) {
        display: flex;
        width: 100vw;
        position: absolute;
        left: 0px;
        top: 0px;
        justify-content: flex-start;
        height: 59px;
        z-index: -1;
      }
      .logo-middle {
        width: 75%;
        @media screen and (min-width: 600px) {
          width: 20%;
          margin: auto;
          max-width: 200px;
        }
      }

      .logo-middle-connected {
        // display: none;
        //  position: relative;
        //  margin: auto;
        width: 100%;
        @media screen and (min-width: 600px) {
          display: block;
          width: 20%;
          margin: auto;
        }
        @media screen and (min-width: 1000px) {
          display: block;
        }
      }
    }
    .userPanel {
      display: flex;
      flex-direction: row;
      .userScore {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        div {
          padding: 0px 10px;
          border-right: 1px solid;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-around;
          p {
            font-family: 'softy', -apple-system, BlinkMacSystemFont, Segoe UI,
              Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans,
              Helvetica Neue, sans-serif;
            margin: 0px 0px 0px 0px;
            font-size: 0.7em;
          }
          .p-coins {
            margin-top: 0px;
          }
        }
      }
      .userPicture {
        display: flex;
        flex-direction: row;
        margin: 0px 10px;
        align-items: center;
      }
      h5 {
        margin: 0px;
      }
      .div {
        // display: flex;
        // position: absolute;
        // top: 0px;
        // right: 35px;
        div {
          // text-align: center;
          // display: flex;
          // flex-direction: column;
          // min-width: 30px;
          // align-content: flex-start;
          // border-right: 1px solid $border-color;
          // padding: 0px 10px;
          h5 {
            margin: 0px;
          }
          p {
            margin: 0px;
          }
        }
      }
    }
    &.offline {
      background: $navbar-offline-color;
      .links .nav-links .nav-item a,
      .site-name {
        color: white;
      }
    }
    .user-picture {
      max-height: 45px;
      border-radius: 50%;
      cursor: pointer;
    }
    .offline-label {
      padding: 0px 10px;
      border: 1px solid white;
      border-radius: 5px;
      color: white;
      margin-left: 1.5rem;
    }
    svg {
      fill: $blue-1;
    }
    svg:hover {
      cursor: pointer;
      fill: $hover;
    }
  }
}
</style>
