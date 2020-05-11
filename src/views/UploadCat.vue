<template>
  <div class="page-wrapper">
    <div class="component-wrapper">
      <img width="100%" :src="getPictureToUpload" />

      <input id="title" v-model="u_title" type="text" placeholder="Title" />

      <div
        data-test="login-btn"
        class="login-btn"
        @click="loginByMail(u_mail, u_password)"
      >
        Send my cat
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      photoImported: null
    }
  },
  computed: {
    ...mapGetters('userData', ['getPictureToUpload'])
  },
  mounted() {
    this.photoImported = this.getPictureToUpload
    console.log(this.photoImported)
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';

.component-wrapper {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  max-width: 600px;
  padding: 15px 0px;
  border: 1px solid;
  border-radius: 3px;
  background-color: rgba(255, 255, 255, 0.9);
  -webkit-box-shadow: 0px 0px 45px -7px rgba(0, 0, 0, 1);
  -moz-box-shadow: 0px 0px 45px -7px rgba(0, 0, 0, 1);
  box-shadow: 0px 0px 45px -7px rgba(0, 0, 0, 1);
  margin: 0px 10px;

  h1,
  h2,
  h3,
  h4 {
    margin: 0px;
  }
  img {
    width: 80%;
    margin: 5px;
  }
  input {
    width: 60%;
    padding: 10px;
    border-radius: 3px;
    border: 1px solid;
    -webkit-box-shadow: inset 0px 0px 9px -10px rgba(0, 0, 0, 0.75);
    -moz-box-shadow: inset 0px 0px 9px -10px rgba(0, 0, 0, 0.75);
    box-shadow: inset 0px 0px 9px -10px rgba(0, 0, 0, 0.75);

    @media only screen and (max-width: 768px) {
      width: 70%;
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
