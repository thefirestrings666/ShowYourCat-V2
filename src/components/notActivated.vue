<template>
  <div class="component-wrapper">
    <img alt="logo-bento" class="logo" src="@/assets/mail.svg" />
    <h4>Please activate hour account, check your mailbox !</h4>
    <div class="wrap">
      <p>{{ txt_body }}</p>
      <div data-test="login-btn" class="login-btn" @click="resendActivation">
        {{ txt_button }}
      </div>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase/app'

export default {
  data() {
    return {
      error_status: 0,
      txt_body: "Didn't received ?",
      txt_button: 'Send it again !'
    }
  },
  methods: {
    resendActivation() {
      this.txt_body = 'A new activation key was sent to your mail box !'
      firebase
        .auth()
        .currentUser.sendEmailVerification()
        .catch(error => {
          console.log(error)
          this.txt_button = 'Try again'
          this.txt_body = 'Too many tries, please wait before trying again'
          this.error_status = 1
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
  justify-content: space-between;

  .logo {
    width: 40%;
    height: 40%;

    filter: invert(21%) sepia(5%) saturate(2878%) hue-rotate(346deg)
      brightness(104%) contrast(97%);
  }

  h4 {
    margin: 0px;
    text-align: center;
  }

  .wrap {
    display: flex;
    flex-direction: column;
    align-items: center;

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
}
</style>
