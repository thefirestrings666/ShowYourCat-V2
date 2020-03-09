<template>
  <header class="navbar" :class="{ offline: !networkOnLine }">
    <router-link to="/home">
      <img alt="logo-bento" class="logo" src="@/assets/catface4.svg" />
      <span class="site-name title-desktop">Show Your Cat</span>
      <span class="site-name title-mobile"></span>
    </router-link>
    <div v-if="isUserLoggedIn && networkOnLine" class="links">
      <nav class="nav-links">
        <div class="user-data-wrapper">
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
      </nav>

      <img
        v-if="isUserLoggedIn && networkOnLine"
        class="user-picture can-hide"
        :src="user.photoURL"
        alt="Avatar"
        @click="logout"
      />
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
  // mounted: {
  //   // listener() {
  //   //   const UserDb = new UsersDB()
  //   //   UserDb.collection('users')
  //   //     .doc(this.user.id)
  //   //     .onSnapshot(doc => {
  //   //       console.log('Current data: ', doc.data())
  //   //     })
  //   // }
  // },
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
  position: absolute;
  top: 0;
  left: 0;
  z-index: 20;
  right: 0;
  height: $navbar-height;
  background-color: $navbar-color;
  box-sizing: border-box;
  border-bottom: 1px solid #eaecef;
  padding: 0.7rem 1.5rem 0.7rem 0.7rem;
  line-height: 2.2rem;

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
    font-size: 1.3rem;
    font-weight: 600;
    color: #2c3e50;
    position: relative;
  }

  .logo {
    height: 35px;
    padding-right: 8px;
    filter: invert(21%) sepia(5%) saturate(2878%) hue-rotate(346deg)
      brightness(104%) contrast(97%);
  }

  .links {
    padding-left: 1.5rem;
    box-sizing: border-box;
    white-space: nowrap;
    font-size: 0.9rem;
    position: absolute;
    right: 1.5rem;
    top: 0.7rem;
    display: flex;

    .nav-links {
      display: flex;
      align-items: center;
      justify-content: center;

      .user-data-wrapper {
        display: flex;
        position: absolute;

        right: 45px;

        div {
          margin: 0px 10px;
          text-align: center;

          h5 {
            margin: 0px;
          }
          p {
            margin: 0px;
          }
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
