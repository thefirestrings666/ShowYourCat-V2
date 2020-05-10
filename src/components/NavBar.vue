<template>
  <header class="navbar" :class="{ offline: !networkOnLine }">
    <router-link to="/home">
      <img alt="logo-bento" class="logo" src="@/assets/catface4.svg" />

      <!-- <span class="site-name title-desktop">Show Your Cat</span>
      <span class="site-name title-mobile">Show Your Cat</span> -->
    </router-link>
    <div
      v-if="isUserLoggedIn && networkOnLine"
      class="logo-top-container-connected"
    >
      <img alt="logo-bento" class="logo-middle" src="@/assets/logotop.svg" />
    </div>
    <div v-else class="logo-top-container">
      <img alt="logo-bento" class="logo-middle" src="@/assets/logotop.svg" />
    </div>
    <div v-if="isUserLoggedIn && networkOnLine" class="userPanel">
      <div class="userScore">
        <div>
          <h5>XP</h5>
          <p>{{ xp }}</p>
        </div>
        <div>
          <h5>LVL</h5>
          <p>{{ level }}</p>
        </div>
        <div>
          <h5>coins</h5>
          <p>{{ coins }}</p>
        </div>
      </div>
      <div class="userPicture">
        <img
          v-if="isUserLoggedIn && networkOnLine"
          class="user-picture"
          :src="user.photoURL"
          alt="Avatar"
          @click="logout"
        />
      </div>
    </div>
  </header>
</template>

<script>
import firebase from 'firebase/app'
// import UsersDB from '@/firebase/users-db'
import { mapGetters, mapState } from 'vuex'

export default {
  props: {
    xp: {
      type: Number
    },
    level: {
      type: Number
    },
    coins: {
      type: Number
    }
  },
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
  display: flex;
  justify-content: space-between;
  z-index: 20;
  margin-bottom: 5px;

  height: $navbar-height;
  background-color: $navbar-color;
  // box-sizing: border-box;
  // border-bottom: 1px solid #eaecef;
  // line-height: 1.55rem;
  width: 100%;

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
    color: #2c3e50;
    position: relative;
  }

  .logo {
    height: 35px;

    filter: invert(21%) sepia(5%) saturate(2878%) hue-rotate(346deg)
      brightness(104%) contrast(97%);
  }
  .logo-top-container {
    display: flex;
    width: 100vw;
    position: absolute;
    justify-content: flex-start;
    height: 59px;
    z-index: -1;

    .logo-middle {
      width: 40%;
      margin: auto;
      max-width: 200px;
      filter: invert(21%) sepia(5%) saturate(2878%) hue-rotate(346deg)
        brightness(104%) contrast(97%);

      @media screen and (min-width: 600px) {
        width: 20%;
      }
    }

    .logo-middle-connected {
      // display: none;
      //  position: relative;
      //  margin: auto;
      width: 100%;
      filter: invert(21%) sepia(5%) saturate(2878%) hue-rotate(346deg)
        brightness(104%) contrast(97%);

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
      justify-content: flex-start;
      height: 59px;
      z-index: -1;
    }

    .logo-middle {
      width: 75%;
      filter: invert(21%) sepia(5%) saturate(2878%) hue-rotate(346deg)
        brightness(104%) contrast(97%);

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
      filter: invert(21%) sepia(5%) saturate(2878%) hue-rotate(346deg)
        brightness(104%) contrast(97%);

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
          margin: 0px;
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
        // border-right: 1px solid #2c3e50;
        // padding: 0px 10px;

        h5 {
          margin: 0px;
        }
        p {
          margin: 0px;
        }
      }

      .nav-item {
        position: relative;
        display: inline-block;
        margin-left: 1.5rem;
        line-height: 2.2rem;

        &:first-child {
          margin-left: 0;
        }

        a {
          font-weight: 500;
          font-size: 0.9rem;
          text-decoration: none;
          color: $navbar-link-color;
          border-color: #2c3e50;
          line-height: 1.4rem;
          display: inline-block;
          cursor: pointer;
        }

        @mixin activatedLink() {
          margin-bottom: -2px;
          border-bottom: 2px solid $vue-color;
        }

        .router-link-active {
          @include activatedLink;
        }

        @media (hover) {
          :hover {
            @include activatedLink;
          }
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
}
</style>
