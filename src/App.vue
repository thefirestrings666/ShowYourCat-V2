<template>
  <div id="app">
    <nav-bar
      :coins="user && user_data.coins"
      :xp="user && user_data.xp"
      :level="user && user_data.level"
    ></nav-bar>
    <div class="main-wrapper">
      <router-view />
    </div>
    <PhotoUploader></PhotoUploader>
    <Footer class="footer"></Footer>
    <new-content-available-toastr
      v-if="newContentAvailable"
      class="new-content-available-toastr"
      :refreshing-app="refreshingApp"
      @refresh="serviceWorkerSkipWaiting"
    ></new-content-available-toastr>
    <apple-add-to-home-screen-modal
      v-if="showAddToHomeScreenModalForApple"
      class="apple-add-to-home-screen-modal"
      @close="closeAddToHomeScreenModalForApple(false)"
    >
    </apple-add-to-home-screen-modal>
  </div>
</template>
<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import PhotoUploader from '@/components/internComponents/photoUploader'
import NewContentAvailableToastr from '@/components/NewContentAvailableToastr'
import AppleAddToHomeScreenModal from '@/components/AppleAddToHomeScreenModal'

export default {
  components: {
    NavBar,
    Footer,
    NewContentAvailableToastr,
    AppleAddToHomeScreenModal,
    PhotoUploader
  },
  computed: {
    ...mapGetters('app', ['newContentAvailable']),
    ...mapState('app', ['showAddToHomeScreenModalForApple', 'refreshingApp']),
    ...mapState('authentication', ['user']),
    ...mapState('userData', ['user_data'])
  },
  methods: mapActions('app', [
    'closeAddToHomeScreenModalForApple',
    'serviceWorkerSkipWaiting'
  ])
}
</script>

<style lang="scss">
@import '@/theme/variables.scss';
@import '@/theme/animate.scss';

body {
  margin: 0;
  background: url('../src/assets/backgroundSV.svg') no-repeat fixed center;
  background-size: cover;
  background-position: top;
  -webkit-font-smoothing: antialiased;

  a {
    color: $blue-3;
    text-decoration: none;
  }

  a:hover {
    color: $hover;
    border-color: $hover;
  }

  #app {
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
      Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-size: 16px;
    color: $blue-3;
    display: grid;
    grid-template-rows: 3.6rem auto 3.6rem 3.6rem;
    min-height: 100vh;
    align-items: center;
    justify-items: center;

    @media (max-width: 500px) {
      grid-template-rows: 3.6rem auto 3.6rem 10px;
    }

    .new-content-available-toastr {
      position: absolute;
      bottom: 10px;
      right: 10px;
    }

    .apple-add-to-home-screen-modal {
      position: absolute;
      bottom: 0;
      right: 0;
      top: 0;
      left: 0;
      height: fit-content;
      width: fit-content;
      margin: auto;
      z-index: 1000;
    }

    .main-wrapper {
      width: 100%;
      max-width: 600px;

      .page-wrapper {
        display: flex;
        justify-content: center;
        width: 100%;
        @media screen and (max-width: 1000px) {
          width: 100%;
        }
      }
    }
    .footer {
      // dfdf
    }
  }
}
</style>
