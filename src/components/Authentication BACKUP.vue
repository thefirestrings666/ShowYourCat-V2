<template>
  <div class="component-wrapper">
    <!-- Login with Google -->

    <ul v-if="v_buttons">
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
          Login with your mail
        </div>
      </li>
      <li>
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

    <!-- Login with Mail -->

    <ul v-if="v_signIn">
      <li>
        <ul class="connexion-wrapper">
          <h4>Sign-in</h4>
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
            <div data-test="login-btn" class="login-btn" @click="loginByMail">
              Back
            </div>
          </li>
        </ul>
      </li>
    </ul>

    <!-- Sign-up with mail -->

    <ul v-if="v_signUp">
      <li>
        <ul class="connexion-wrapper">
          <h4>Sign-up</h4>
          <li>
            <label>Mail :</label>
            <input type="text" />
          </li>
          <li>
            <label>Password :</label>
            <input type="password" />
          </li>
          <li>
            <label>Verify password :</label>
            <input type="password" />
          </li>
          <li>
            <div data-test="login-btn" class="login-btn" @click="loginByMail">
              Sign-up !
            </div>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
import firebase from 'firebase/app'
import { desktop as isDekstop } from 'is_js'
import { mapState, mapGetters, mapMutations } from 'vuex'

export default {
  data() {
    return {
      v_signIn: false,
      v_signUp: false,
      v_buttons: true
    }
  },
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
      this.v_signIn = true
      this.v_buttons = false
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
  width: 100%;

  ul {
    width: 50%;
    margin: auto;
    list-style: none;
    padding: 0px;

    li {
      text-align: center;

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

      .connexion-wrapper {
        margin-top: 15px;
        padding: 15px;
        border: 1px solid;
        border-radius: 3px;

        h4 {
          margin: 0px 0px 15px 0px;
        }

        input[type='text'] {
          margin-bottom: 5px;
        }

        input[type='password'] {
          margin-bottom: 15px;
        }

        label {
          width: 100%;
          display: block;
        }
      }
    }
  }
}
</style>
