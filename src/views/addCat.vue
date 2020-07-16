<template>
  <div class="page-wrapper">
    <div class="component-wrapper">
      <h4>Let's add your cat !</h4>
      <base-image-input />
      <div class="field-aera">
        <input v-model="v_name" type="text" placeholder="Name (mandatory)" />
      </div>
      <date-picker
        v-model="v_date"
        :popover="{ placement: 'bottom', visibility: 'click' }"
        class="datePicker"
      />
      <div class="field-aera flex">
        <div data-test="login-btn" class="login-btn">
          Okay !
        </div>
        <router-link to="/home">
          <div data-test="login-btn" class="login-btn">
            Back
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import DatePicker from 'v-calendar/lib/components/date-picker.umd'

import BaseImageInput from '../components/internComponents/BaseImageInput.vue'

export default {
  components: {
    BaseImageInput,
    DatePicker
  },
  data() {
    return {
      v_date: new Date(2020, 1, 1),
      v_name: '',
      v_age: '',

      mode: 'single'
    }
  },
  methods: {}
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
  padding: 15px 15px;
  //border: 1px solid;
  border-radius: 3px;
  background-color: rgba(255, 255, 255, 0.9);
  -webkit-box-shadow: 0px 0px 45px -7px rgba(0, 0, 0, 1);
  -moz-box-shadow: 0px 0px 45px -7px rgba(0, 0, 0, 1);
  box-shadow: 0px 0px 45px -7px rgba(0, 0, 0, 1);
  margin: 10px 10px;

  .image-top {
    width: 40%;
    margin: 0px 0px 0px 0px;
    fill: $blue-3;
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

  input,
  .datePicker {
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
    border-color: $border-color;

    &:hover {
      color: $hover;
      border-color: $hover;
    }
  }
}
</style>
