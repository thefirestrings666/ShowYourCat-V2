<template>
  <div class="page-wrapper">
    <div class="component-wrapper">
      <img class="image-top" src="@/assets/catface4.svg" />
      <h4>Sign-up</h4>
      <div class="field-aera">
        <input
          v-model="u_nickname"
          type="text"
          placeholder="Nickname"
          @change="checkSpace"
        />
        <span v-if="errorNickname" class="error-tab">{{ errorNickname }}</span>
      </div>
      <div class="field-aera">
        <input v-model="u_mail" type="text" placeholder="E-mail" />
        <span v-if="errorEmail" class="error-tab">{{ errorEmail }}</span>
      </div>
      <div class="field-aera">
        <input v-model="u_password" type="password" placeholder="Password" />
        <span v-if="errorPassword" class="error-tab">{{ errorPassword }}</span>
      </div>
      <div class="field-aera">
        <input v-model="u_password" type="password" placeholder="Password" />
        <span v-if="errorPassword" class="error-tab">{{ errorPassword }}</span>
      </div>
      <div class="field-aera flex">
        <label>Import your cat :</label>

        <base-image-input @img_selected="updateUserPicture" />
      </div>
      <div class="field-aera flex">
        <div data-test="login-btn" class="login-btn" @click="signUp_validation">
          Sign-up !
        </div>
        <div data-test="login-btn" class="login-btn" @click="sigUp_back">
          Back
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase/app'
import downscale from 'downscale'
import BaseImageInput from '../components/internComponents/BaseImageInput.vue'

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
  methods: {
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
  display: flex;
  flex-direction: column;
  max-width: 600px;
  width: 100%;
  align-items: center;
  padding: 15px 0px;
  border: 1px solid;
  border-radius: 3px;
  background-color: rgba(255, 255, 255, 0.9);
  -webkit-box-shadow: 0px 0px 45px -7px rgba(0, 0, 0, 1);
  -moz-box-shadow: 0px 0px 45px -7px rgba(0, 0, 0, 1);
  box-shadow: 0px 0px 45px -7px rgba(0, 0, 0, 1);
  margin: 0px 10px;

  .image-top {
    width: 40%;
    margin: 0px 50px 0px 50px;
    filter: invert(21%) sepia(5%) saturate(2878%) hue-rotate(346deg)
      brightness(104%) contrast(97%);

    @media screen and (min-width: 600px) {
      //  margin: 0px 50px 20px 50px;
    }
  }

  .field-aera {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 5px;
  }

  .flex {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  input {
    width: 75%;
    padding: 10px;
    border-radius: 3px;
    border: 1px solid;
    -webkit-box-shadow: inset 0px 0px 9px -10px rgba(0, 0, 0, 0.75);
    -moz-box-shadow: inset 0px 0px 9px -10px rgba(0, 0, 0, 0.75);
    box-shadow: inset 0px 0px 9px -10px rgba(0, 0, 0, 0.75);

    // @media only screen and (max-width: 768px) {
    //   width: 70%;
    // }
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
