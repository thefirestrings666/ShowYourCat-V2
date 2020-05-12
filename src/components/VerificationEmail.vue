<template>
  <div class="component-wrapper">
    <img src="@/assets/catface4.svg" />
    <div class="spanner">
      <h4>{{ h4_title }}</h4>
      <h4>{{ h4_message }}</h4>
      <p>{{ errorMessage }}</p>
      <router-link to="/home">
        <div data-test="login-btn" class="login-btn">
          Back Home !
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase/app'
import { mapMutations, mapActions } from 'vuex'

export default {
  data() {
    return {
      errorMessage: '',
      h4_title: '',
      h4_message: ''
    }
  },
  created() {
    this.activateAccount(this.$route.query.oobCode)
  },
  methods: {
    activateAccount(action) {
      firebase
        .auth()
        .applyActionCode(action)
        .then(() => {
          this.h4_title = 'Congratulation !'
          this.h4_message = 'Your account has been succesfully activated !'
        })
        .catch(error => {
          // Handle Errors here.

          const errorMessage = error.message
          this.h4_title = 'oops !'
          this.errorMessage = errorMessage

          // ...
        })
    },

    ...mapMutations('authentication', ['setUser']),
    ...mapActions('authentication', ['activateUser'])
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

  @media only screen and (max-width: 768px) {
    margin-top: 15px;
    width: 100%;
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
    width: 100%;
    display: inline-block;
    vertical-align: top;
    min-width: 200px;
    text-align: center;

    .login-btn {
      margin: 25px;
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
}
</style>
