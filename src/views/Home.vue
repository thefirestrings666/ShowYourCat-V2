<template>
  <div v-if="user" key="user.emailVerified" class="page-wrapper">
    <CatRatingSystem v-if="user.emailVerified"> </CatRatingSystem>
    <notActivated v-else> </notActivated>
  </div>
  <div v-else-if="user === null" class="page-wrapper">
    <authentication> </authentication>
  </div>
  <div v-else-if="user === undefined" class="page-wrapper">
    <h1>Loading....</h1>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import authentication from '../components/Authentication.vue'
import CatRatingSystem from '../components/CatRatingSystem.vue'
import notActivated from '../components/notActivated.vue'

export default {
  components: {
    authentication,
    CatRatingSystem,
    notActivated
  },
  data() {
    return {}
  },
  head() {
    return {
      title: {
        inner: 'Home'
      },
      meta: [
        {
          name: 'description',
          content: `${this.appTitle} home page`,
          id: 'desc'
        }
      ]
    }
  },
  computed: {
    ...mapState('app', ['appTitle', 'networkOnLine']),
    ...mapGetters('authentication', ['isUserLoggedIn']),
    ...mapState('authentication', ['user'])
  },
  created() {}
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';

.page-wrapper {
  // display: flex;
  // flex-direction: row;
  // justify-content: center;
  // align-items: center;
  // align-items: flex-start;

  // @media only screen and (max-width: 768px) {
  //   flex-direction: column;
  // }

  .notActivated {
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
  }
  .logo {
    width: 40%;
    height: 40%;
    margin: 0px 50px 20px 50px;
    filter: invert(21%) sepia(5%) saturate(2878%) hue-rotate(346deg)
      brightness(104%) contrast(97%);
  }

  .home-page-title {
    text-align: center;
  }

  .documentation-link {
    display: inline-block;
    font-size: 1.2rem;
    color: #fff;
    background-color: #5d6788;
    padding: 0.8rem 1.6rem;
    border-radius: 4px;
    transition: background-color 0.1s ease;
    box-sizing: border-box;
    text-decoration: none;
    width: fit-content;
    font-weight: 500;
  }

  .login-btn {
    margin-top: 20px;
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
