<template>
  <div class="component-wrapper">
    <img src="@/assets/catface4.svg" />
    <p>{{ errorMessage }}</p>
    <div v-if="v_spanner" class="spanner">
      <h4>Sign-in</h4>
      <ul>
        <li>
          <label>Mail :</label>
          <input v-model="u_mail" type="text" />
        </li>
        <li>
          <label>Password :</label>
          <input v-model="u_password" type="password" />
        </li>
        <li>
          <div
            data-test="login-btn"
            class="login-btn"
            @click="loginByMail(u_mail, u_password)"
          >
            Sign-in
          </div>
        </li>
      </ul>
    </div>

    <div v-if="v_spanner" class="separator" />

    <div v-if="v_spanner" class="spanner">
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
            @click="signUp_access"
          >
            Sign-up !
          </div>
        </li>
      </ul>
    </div>
    <div v-else class="connexion-wrapper">
      <form>
        <ul>
          <h4>Sign-up</h4>
          <li>
            <label>Nickname :</label>
            <input v-model="u_nickname" type="text" @change="checkSpace" />
            <span v-if="errorNickname" class="error-tab">{{
              errorNickname
            }}</span>
          </li>
          <li>
            <label>E-Mail :</label>
            <input v-model="u_mail" type="text" />
            <span v-if="errorEmail" class="error-tab">{{ errorEmail }}</span>
          </li>
          <li>
            <label>Password :</label>
            <input v-model="u_password" type="password" />
            <span v-if="errorPassword" class="error-tab">{{
              errorPassword
            }}</span>
          </li>
          <li>
            <label>Verify password :</label>
            <input v-model="u_password2" type="password" />
            <span v-if="errorPassword2" class="error-tab">{{
              errorPassword2
            }}</span>
          </li>

          <li>
            <label>Import your cat :</label>

            <span v-if="errorPassword2">{{ errorPassword2 }}</span>
            <base-image-input @img_selected="updateUserPicture" />
          </li>
          <li>
            <div
              data-test="login-btn"
              class="login-btn"
              @click="signUp_validation"
            >
              Sign-up !
            </div>
            <div data-test="login-btn" class="login-btn" @click="sigUp_back">
              Back
            </div>
          </li>
        </ul>
      </form>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase/app'
import downscale from 'downscale'
import { desktop as isDekstop } from 'is_js'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import BaseImageInput from './internComponents/BaseImageInput.vue'

export default {
  components: {
    BaseImageInput
  },
  data() {
    return {
      v_spanner: true,

      u_nickname: '',
      u_mail: '',
      u_password: '',
      u_password2: '',
      u_picture: null,
      u_pictureUrl: null,

      reg: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,

      errorNickname: '',
      errorEmail: '',
      errorPassword: '',
      errorPassword2: '',
      errorMessage: ''
    }
  },
  computed: {
    ...mapState('app', ['appTitle', 'networkOnLine']),
    ...mapGetters('authentication', ['isUserLoggedIn']),
    ...mapState('authentication', ['user'])
  },
  methods: {
    ...mapMutations('authentication', ['setUser']),
    ...mapActions('authentication', [
      'updateUserDetails',
      'updateUserPictureLink'
    ]),
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

      const credential = firebase.auth.EmailAuthProvider.credential(
        this.u_mail,
        this.u_password
      )

      firebase
        .auth()
        .currentUser.linkWithCredential(credential)
        .then(
          usercred => {
            const { user } = usercred
            console.log('Account linking success', user)
          },
          error => {
            console.log('Account linking error', error)
          }
        )
    },
    loginByMail(email, password) {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)

        .catch(error => {
          // Handle Errors here.
          const errorCode = error.code
          const errorMessage = error.message
          this.errorMessage = errorMessage
          console.log(`${errorCode} - ${errorMessage}`)
          // ...
        })
    },
    signUp_access() {
      this.v_spanner = false
    },
    sigUp_back() {
      this.v_spanner = true
      this.resetData()
    },
    checkSpace() {
      this.u_nickname = this.u_nickname.split(' ').join('')
    },
    signUp_validation() {
      // Function to validate Sign-Up form fields

      // Nickname verification
      if (this.u_nickname === null || this.u_nickname === '') {
        this.errorNickname = 'Please Enter a nickname'
      } else {
        this.errorNickname = ''
      }
      // Email verification
      if (this.u_mail === null || this.u_mail === '') {
        this.errorEmail = 'Please Enter Email'
      } else if (!this.reg.test(this.u_mail)) {
        this.errorEmail = 'Please Enter Correct Email'
      } else if (this.reg.test(this.u_mail)) {
        this.errorEmail = ''
      }
      // Password 1 verification
      if (this.u_password.length < 5 || this.u_password === '') {
        this.errorPassword = 'Minimum of 5 letters'
      } else {
        this.errorPassword = ''
      }
      // Password 2 verification
      if (
        this.u_password !== this.u_password2 ||
        this.u_password2 === null ||
        this.u_password2 === ''
      ) {
        this.errorPassword2 = 'Passwords are not corresonding'
      } else {
        this.errorPassword2 = ''
      }

      if (
        this.errorNickname === '' &&
        this.errorEmail === '' &&
        this.errorPassword === '' &&
        this.errorPassword2 === ''
      ) {
        this.signUp()
      }
    },

    async signUp() {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.u_mail, this.u_password)
        .then(response => {
          if (response) {
            const file = this.u_picture

            if (file) {
              firebase
                .storage()
                .ref(`avatars/${firebase.auth().currentUser.uid}`)
                .putString(file, 'data_url') // Saving picture
                .then(() => {
                  firebase
                    .storage()
                    .ref(`avatars/${firebase.auth().currentUser.uid}`)
                    .getDownloadURL()
                    .then(downURL => {
                      firebase
                        .auth()
                        .currentUser.updateProfile({
                          photoURL: downURL
                        })
                        .then(() => {
                          this.updateUserPictureLink(
                            firebase.auth().currentUser.uid
                          )
                        })
                    })
                })
            } else {
              firebase
                .storage()
                .ref('avatars/nopicture.png')
                .getDownloadURL()
                .then(downURL => {
                  firebase
                    .auth()
                    .currentUser.updateProfile({
                      photoURL: downURL
                    })
                    .then(() => {
                      this.updateUserPictureLink(
                        firebase.auth().currentUser.uid
                      )
                    })
                })
            }

            firebase
              .auth()
              .currentUser.updateProfile({
                displayName: this.u_nickname
              })
              .then(() => {
                this.updateUserDetails(firebase.auth().currentUser.uid)
              })
          }
        })
        .catch(error => {
          // Handle Errors here.
          const errorCode = error.code
          const errorMessage = error.message
          console.log(`${errorCode} - ${errorMessage}`)
          this.errorEmail = errorMessage

          // ...
        })
        .then(() => {
          this.sendEmail()
        })
      // todo
    },

    sendEmail() {
      firebase
        .auth()
        .currentUser.sendEmailVerification()
        .then(
          () => {
            // Email sent.
          },
          error => {
            console.log(error)
            // An error happened.
          }
        )
    },
    resetData() {
      this.u_nickname = ''
      this.u_mail = ''
      this.u_password = ''
      this.u_password2 = ''
      this.errorNickname = ''
      this.errorEmail = ''
      this.errorPassword = ''
      this.errorPassword2 = ''
    },
    updateUserPicture(value) {
      this.u_picture = value
      downscale(value, 200, 200, { quality: 1 }).then(dataV => {
        this.u_picture = dataV
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';

.component-wrapper {
  margin: auto;

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

  @media only screen and (max-width: 768px) {
    width: 100%;
  }

  p {
    margin-top: 0px;
    text-align: center;
    color: red;
    padding: 0px 5px;
  }
  img {
    width: 40%;
    height: 40%;
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

    @media only screen and (max-width: 768px) {
      width: 100%;
    }
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
        padding: 10px;
        border-radius: 3px;
        border: 1px solid;
        -webkit-box-shadow: inset 0px 0px 14px -10px rgba(0, 0, 0, 0.75);
        -moz-box-shadow: inset 0px 0px 14px -10px rgba(0, 0, 0, 0.75);
        box-shadow: inset 0px 0px 14px -10px rgba(0, 0, 0, 0.75);

        @media only screen and (max-width: 768px) {
          width: 70%;
        }
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

  .connexion-wrapper {
    width: 100%;
    li {
      width: 100%;
      text-align: center;

      label {
        width: 100%;
        text-align: left;
        display: block;
        margin-bottom: 5px;
        padding-left: 15px;
      }

      input {
        width: 80%;
        -webkit-box-shadow: inset 0px 0px 14px -10px rgba(0, 0, 0, 0.75);
        -moz-box-shadow: inset 0px 0px 14px -10px rgba(0, 0, 0, 0.75);
        box-shadow: inset 0px 0px 14px -10px rgba(0, 0, 0, 0.75);
      }
      input[type='text'] {
        margin-bottom: 5px;
      }

      input[type='password'] {
        margin-bottom: 5px;
      }

      .error-tab {
        font-size: 0.8em;
        width: 100%;
        display: block;
        color: red;
      }

      .login-btn {
        margin-top: 15px;
      }
    }
  }
}
</style>
