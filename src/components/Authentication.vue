<template>
  <div class="component-wrapper">
    <img src="@/assets/catface2.svg" />
    <div class="spanner">
      <h4>Sign-in</h4>
      <ul>
        <li>
          <label>Mail :</label>
          <input type="text" />
        </li>
        <li>
          <label>Password :</label>
          <input type="password" />
        </li>
        <li>
          <div data-test="login-btn" class="login-btn" @click="loginByMail">
            Sign-in
          </div>
        </li>
      </ul>
    </div>

    <div class="separator" />

    <div class="spanner">
      <h4>With socials</h4>
      <ul>
        <li>
          <div
            v-show="user !== undefined && !user && networkOnLine"
            data-test="login-btn"
            class="login-btn"
            @click="login"
          >
            Login with google
          </div>
        </li>
        <li>
          <div
            v-show="user !== undefined && !user && networkOnLine"
            data-test="login-btn"
            class="login-btn"
            @click="loginByMail"
          >
            Login with Facebook
          </div>
        </li>
        <li>
          <h4>or</h4>
          <div
            v-show="user !== undefined && !user && networkOnLine"
            data-test="login-btn"
            class="login-btn"
            @click="signUp"
          >
            Sign-up !
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase/app'
import { desktop as isDekstop } from 'is_js'
import { mapState, mapGetters, mapMutations } from 'vuex'

export default {
  computed: {
    ...mapState('app', ['appTitle', 'networkOnLine']),
    ...mapGetters('authentication', ['isUserLoggedIn']),
    ...mapState('authentication', ['user'])
  },
  methods: {
    ...mapMutations('authentication', ['setUser']),
    async login() {
      this.loginError = null
      const provider = new firebase.auth.GoogleAuthProvider()
      this.setUser(undefined)

      try {
        // Firebase signin with popup is faster than redirect
        // but we can't use it on mobile because it's not well supported
        // when app is running as standalone on ios & android
        // eslint-disable-next-line no-unused-expressions
        isDekstop()
          ? await firebase.auth().signInWithPopup(provider)
          : await firebase.auth().signInWithRedirect(provider)
      } catch (err) {
        this.loginError = err
        this.setUser(null)
      }
    },
    loginByMail() {
      // todo
    },
    signUp() {
      // todo
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';

.component-wrapper {
  margin-top: 180px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 75%;
  max-width: 600px;
  padding: 15px 0px;
  border: 1px solid;
  border-radius: 3px;
  background-color: rgba(255, 255, 255, 0.9);
  -webkit-box-shadow: 0px 0px 45px -7px rgba(0, 0, 0, 1);
  -moz-box-shadow: 0px 0px 45px -7px rgba(0, 0, 0, 1);
  box-shadow: 0px 0px 45px -7px rgba(0, 0, 0, 1);
  img {
    width: 40%;
    margin: 0px 50px 20px 50px;
    filter: invert(21%) sepia(5%) saturate(2878%) hue-rotate(346deg)
      brightness(104%) contrast(97%);
  }

  h4 {
    margin: 0px 0px 11px 0px;
    text-align: center;
  }

  .spanner {
    width: 49%;
    display: inline-block;
    vertical-align: top;
    min-width: 200px;
  }

  .separator {
    border-right: 1px solid;
    margin: 0px 1px;

    @media only screen and (max-width: 768px) {
      width: 100%;
      border-top: 1px solid;
      margin: 15px 35px;
    }
  }

  ul {
    list-style: none;
    padding: 0px;
    margin: auto;

    li {
      width: 100%;
      text-align: center;

      label {
        width: 100%;
        display: block;
      }
      input {
        width: 60%;
        padding: 5px;
        border-radius: 3px;
        border: 1px solid;
      }

      input[type='text'] {
        margin-bottom: 5px;
      }

      input[type='password'] {
        margin-bottom: 15px;
      }
    }
  }

  .login-btn {
    margin: 5px;
    cursor: pointer;
    padding: 5px 20px;
    border: 1px solid;
    display: inline-block;
    border-radius: 3px;
    border-color: #2c3e50;

    &:hover {
      color: $vue-color;
      border-color: $vue-color;
    }
  }
}
</style>
