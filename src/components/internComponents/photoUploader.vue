<template>
  <div class="uploadButton">
    <div
      v-if="isUserLoggedIn && user.emailVerified"
      class="photoButton"
      @click="selectFile"
    >
      <svg
        id="Calque_1"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        width="30.228px"
        height="30.211px"
        viewBox="0 0 154.228 130.211"
        enable-background="new 0 0 154.228 130.211"
        xml:space="preserve"
      >
        <g id="Calque_2"></g>
        <g>
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M77.108,130.21c-18.714,0-37.428-0.004-56.143,0.005
		c-2.468,0.001-4.908-0.209-7.226-1.079c-7.048-2.646-11.674-7.515-13.353-14.945c-0.32-1.416-0.382-2.913-0.383-4.373
		c-0.022-23.134,0.046-46.269-0.045-69.403C-0.08,30.661,6.325,24.14,12.545,21.558c2.302-0.955,4.711-1.469,7.198-1.483
		c6.082-0.035,12.164-0.021,18.246-0.008c0.424,0,0.619-0.125,0.769-0.521c1.176-3.101,2.438-6.171,3.554-9.294
		c1.387-3.88,4.078-6.54,7.594-8.478c2.203-1.214,4.562-1.769,7.091-1.764C70.306,0.036,83.616,0.056,96.925,0
		c3.557-0.015,6.673,1.05,9.51,3.106c2.505,1.816,4.359,4.109,5.43,7.052c1.15,3.161,2.415,6.281,3.61,9.426
		c0.138,0.363,0.311,0.481,0.698,0.48c6.001-0.011,12.003-0.048,18.004,0.009c5.91,0.056,10.845,2.363,14.846,6.699
		c2.698,2.925,4.401,6.335,4.958,10.285c0.148,1.05,0.216,2.12,0.216,3.181c0.012,23.264-0.039,46.527,0.031,69.791
		c0.032,10.826-8.267,18.029-15.508,19.624c-1.822,0.401-3.657,0.561-5.518,0.561C114.504,130.208,95.807,130.21,77.108,130.21z
		 M77.396,110.235c3.169-0.006,6.613-0.418,9.985-1.372c5.771-1.631,10.731-4.649,15.027-8.798c3.93-3.797,6.975-8.182,8.799-13.366
		c1.748-4.965,2.226-10.073,1.724-15.292c-0.387-4.019-1.405-7.869-3.276-11.448c-6.925-13.249-20.756-21.864-37.922-19.571
		c-5.489,0.733-10.571,2.606-15.085,5.83c-9.174,6.55-14.814,15.19-15.52,26.685c-0.262,4.272,0.144,8.473,1.439,12.558
		c2.694,8.495,8.144,14.84,15.565,19.558C63.892,108.68,70.279,110.229,77.396,110.235z"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M77.141,52.579c9.331,0.248,16.259,4.529,20.778,12.705
		c1.38,2.497,2.012,5.245,2.214,8.093c0.243,3.411-0.163,6.725-1.432,9.909c-1.685,4.229-4.526,7.552-8.185,10.193
		c-3.515,2.537-7.465,3.855-11.789,4.115c-4.719,0.284-9.207-0.524-13.28-2.974c-5.756-3.463-9.783-8.322-11.04-15.043
		c-1.486-7.952,0.645-14.87,6.533-20.528c3.016-2.898,6.537-4.894,10.636-5.816c0.8-0.18,1.61-0.333,2.424-0.424
		C75.026,52.693,76.059,52.654,77.141,52.579z"
          />
        </g>
        <path fill="none" enable-background="new    " d="z" />
      </svg>

      <input
        ref="fileInput"
        class="file-input"
        type="file"
        accept="image/*"
        @change="onSelectFile"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'

export default {
  data() {
    return {
      imageData: null
    }
  },
  computed: {
    ...mapGetters('authentication', ['isUserLoggedIn']),
    ...mapState('authentication', ['user'])
  },
  methods: {
    selectFile() {
      this.$refs.fileInput.click()
    },
    onSelectFile(imageReturned) {
      const input = imageReturned.target

      if (input.files && input.files[0]) {
        const reader = new FileReader()
        reader.onload = e => {
          this.imageData = e.target.result

          this.setPictureToUpload(this.imageData)

          this.$router.push({
            name: 'upload',
            params: 'id'
          })
        }
        if (input.files[0].type.match('image.*')) {
          reader.readAsDataURL(input.files[0])
        }
      }
    },
    ...mapActions('userData', ['setPictureToUpload'])
  }
}
</script>

<style lang="scss" scoped>
.uploadButton {
  display: flex;
  width: 100%;
  align-content: flex-end;
  flex-direction: row-reverse;
  margin-right: 15px;
  margin-bottom: 15px;

  .photoButton {
    height: 40px;
    width: 40px;
    // display: block;
    background: rgb(255, 245, 234);
    border-radius: 100px;
    border: #471d00 5px solid;
    display: flex;
    justify-content: center;
    align-items: center;

    svg {
      fill: #471d00;
      display: block;
      width: 60%;
      height: 60%;
    }

    //   width: 40px;
    //   height: 40px;
    //   border-radius: 100px;
    //   border: #471d00 5px solid;
    //   display: block;
    //   bottom: 10px;
    //   right: 10px;
    //   padding: 10px;
    //   background: rgb(255, 245, 234);

    //   @media screen and (min-width: 495px) {
    //     bottom: 70px;
    //     right: 10px;
    //   }
    //   @media screen and (min-width: 1000px) {
    //     bottom: 70px;
    //     right: 20px;
    //   }
  }
}

.photoButton:hover {
  cursor: pointer;
  background: rgb(250, 205, 157);
}

.file-input {
  display: none;
}
</style>
