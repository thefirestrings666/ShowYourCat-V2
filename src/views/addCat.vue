<template>
  <div class="page-wrapper">
    <div class="component-wrapper">
      <SuccessAnimation v-if="success"></SuccessAnimation>
      <base-image-input
        v-if="!success"
        :key="resetUploader"
        :color-placeholder="borderErrorPlaceholder"
        :p-text="picText"
        :color-crop-button="borderCropButton"
        @is-cropped="isCropped = true"
        @input="
          borderCropButton = ''
          borderErrorPlaceholder = ''
        "
        @cropped="isImage = true"
        @reset="
          resetUploader += 25
          isImage = false
          borderErrorPlaceholder = ''
        "
        @picture="updatePicture"
      ></base-image-input>
      <div v-if="!success" class="field-aera">
        <input
          v-model="v_name"
          type="text"
          placeholder="Name (mandatory)"
          :style="style"
        />
      </div>
      <div v-if="!success" class="field-aera">
        <label>Birthday</label>
        <date-picker v-model="v_date" is-inline />
      </div>
      <div class="field-aera flex">
        <div
          v-if="!success"
          data-test="login-btn"
          class="login-btn"
          @click="testData"
        >
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
import Firebase from 'firebase'

import { mapActions } from 'vuex'

import BaseImageInput from '../components/internComponents/BaseImageInput.vue'
import SuccessAnimation from '../components/AnimationSuccess.vue'

export default {
  components: {
    BaseImageInput,
    DatePicker,
    SuccessAnimation
  },
  data() {
    return {
      v_date: null,
      v_name: '',
      v_age: '',
      v_image: '',
      isImage: false,
      isCropped: false,
      borderError: '#fc0303',
      borderErrorPlaceholder: '',
      borderCropButton: '',
      picText: 'Pick a pic !',

      success: false,

      resetUploader: 412,

      mode: 'single'
    }
  },
  computed: {
    style() {
      return `border: ${this.borderError}`
    }
  },
  methods: {
    async testData() {
      if (!this.isCropped) {
        this.borderCropButton = 'border-color: red; color: #fc0303 '
      } else {
        this.borderCropButton = ''
      }

      if (!this.v_name) {
        this.borderError = '1px solid #fc0303'
      } else {
        this.borderError = '#fc0303'
      }

      if (!this.isImage) {
        this.borderErrorPlaceholder = 'stroke: red '
      } else {
        this.borderErrorPlaceholder = 'stroke: red'
      }

      if (!this.v_date) {
        this.v_date = ''
      }

      if (this.v_name && this.v_image) {
        console.log('OK for creation')

        Firebase.firestore()
          .collection('cats')
          .add({
            name: this.v_name,
            userId: Firebase.auth().currentUser.uid,
            catPicture: 'null',
            creationDate: new Date(),
            weekVote: 0
          })
          .then(
            idNewCat =>
              Firebase.storage()
                .ref(`catAvatars/${idNewCat.id}`)
                .putString(this.v_image, 'data_url'),
            this.UpdateCat(),
            (this.success = true)
          )
      }
    },
    updatePicture(pic) {
      this.isImage = true
      this.v_image = pic
    },

    ...mapActions('authentication', ['UpdateCat'])
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
    margin-top: 15px;
    margin-bottom: 5px;
  }

  label {
    margin-bottom: 10px;
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
