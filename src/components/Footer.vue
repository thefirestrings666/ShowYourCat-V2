<template>
  <footer class="navbar" :class="{ offline: !networkOnLine }">
    <router-link to="/home">
      <span class="site-name title-desktop">Show Your Cat 2020</span>
      <span class="site-name title-mobile"></span>
    </router-link>
  </footer>
</template>

<script>
import firebase from 'firebase/app'
import { mapGetters, mapState } from 'vuex'

export default {
  computed: {
    ...mapGetters('authentication', ['isUserLoggedIn']),
    ...mapState('authentication', ['user']),
    ...mapState('app', ['networkOnLine', 'appTitle', 'appShortTitle'])
  },
  methods: {
    async logout() {
      await firebase.auth().signOut()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';

.navbar {
  height: $navbar-height;
  background-color: $navbar-color;
  box-sizing: border-box;
  border-bottom: 1px solid #eaecef;
  padding: 0.7rem 1.5rem 0.7rem 0.7rem;
  line-height: 2.2rem;
  text-align: right;
  width: 100%;
  @media screen and (max-width: 600px) {
    display: none;
  }
  a {
    display: flex;
    align-items: right;
  }

  .title-desktop {
    display: inline;
  }

  .title-mobile {
    display: none;
  }

  @media (max-width: 500px) {
    padding: 0.7rem 0.7rem;

    .can-hide {
      display: none;
    }

    .title-desktop {
      display: none;
    }

    .title-mobile {
      display: block;
    }
  }

  .site-name {
    font-size: 0.9rem;
    font-weight: 600;
    color: $border-color;
    position: absolute;
    text-align: right;
    right: 20px;
  }

  .logo {
    height: 35px;
    padding-right: 8px;
    filter: invert(21%) sepia(5%) saturate(2878%) hue-rotate(346deg)
      brightness(104%) contrast(97%);
  }

  &.offline {
    background: $navbar-offline-color;
    .links .nav-links .nav-item a,
    .site-name {
      color: white;
    }
  }

  .user-picture {
    max-height: 32px;
    margin-left: 1.5rem;
    border-radius: 50%;
  }

  .offline-label {
    padding: 0px 10px;
    border: 1px solid white;
    border-radius: 5px;
    color: white;
    margin-left: 1.5rem;
  }
}
</style>
