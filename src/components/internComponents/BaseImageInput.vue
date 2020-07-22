<template>
  <div class="base-image-input">
    <span v-if="!imageData" class="placeholder">
      <svgCamera
        :border-style-color="colorPlaceholder"
        @clicked="chooseImage"
      />
    </span>

    <input
      ref="fileInput"
      class="file-input"
      type="file"
      accept="image/*"
      @change="onSelectFile"
    />

    <cropper
      v-if="imageData && !v_preview && !vloading"
      ref="cropper"
      classname="cropper"
      image-classname="bPencil"
      area-classname="areaClass"
      :wheel-resize="false"
      :src="imageData"
      :image-restriction="'stencil'"
      :stencil-component="CircleStencil"
      :stencil-props="{
        imageClassname: 'bPencil',
        areaClassname: 'areaClass'
      }"
    ></cropper>
    <Loading v-if="vloading"></Loading>
    <div v-if="v_preview" ref="imgPreview" class="cropper-result">
      <img :src="imageData" />
    </div>

    <div v-if="v_preview" class="login-btn top-margin" @click="resetComp">
      Try again !
    </div>
    <div
      v-if="imageData && !v_preview"
      :style="colorCropButton"
      class="login-btn "
      @click="cropPreview"
    >
      Crop!
    </div>
  </div>
</template>

<script>
import { Cropper, CircleStencil } from 'vue-advanced-cropper'
import svgCamera from '@/assets/svgs/svgCamera.vue'
import Loading from '../AnimationLoading-mini.vue'

export default {
  components: {
    Cropper,
    Loading,
    svgCamera
  },
  props: {
    color: { type: String, default: '#ff1900' },
    colorPlaceholder: { type: String },
    colorCropButton: { type: String },
    pText: { type: String, default: 'Add a picture' }
  },
  data() {
    return {
      imageData: null,
      imageDataComplete: false,
      imageJPG: null,

      vloading: false,

      CircleStencil,
      coordinates: {
        width: 0,
        height: 0,
        left: 0,
        top: 0
      },
      v_preview: false
    }
  },
  computed: {
    style() {
      return `border: ${this.color}`
    }
  },
  methods: {
    chooseImage() {
      this.$refs.fileInput.click()
    },
    onSelectFile(returned) {
      const input = returned.target
      // const { files } = input
      if (input.files && input.files[0]) {
        const reader = new FileReader()
        reader.onprogress = () => {
          this.vloading = true
        }
        reader.onloadend = e => {
          this.imageData = e.target.result
          this.vloading = false
        }

        reader.readAsDataURL(input.files[0])
        this.$emit('input', input.files[0])
      }
    },

    roundEdges(canvas) {
      const context = canvas.getContext('2d')
      const { width } = canvas
      const { height } = canvas
      context.globalCompositeOperation = 'destination-in'
      context.beginPath()
      context.scale(1, height / width)
      context.arc(width / 2, width / 2, width / 2, 0, Math.PI * 2)
      context.closePath()
      context.fill()
      return canvas
    },
    cropPreview() {
      this.vloading = true
      const { canvas } = this.$refs.cropper.getResult()
      this.vloading = false
      this.v_preview = true
      this.imageData = this.roundEdges(canvas).toDataURL()
      // const imgRef = this.$refs.imgPreview.getResult()
      // console.log(imgRef)
      this.imageDataComplete = true
    },
    resetComp() {
      this.imageData = null
      this.v_preview = false
      this.$emit('reset')
    },
    resizebase64(base64, maxWidth, maxHeight) {
      // Max size for thumbnail
      if (typeof maxWidth === 'undefined') maxWidth = 500
      if (typeof maxHeight === 'undefined') maxHeight = 500

      // Create and initialize two canvas
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const canvasCopy = document.createElement('canvas')
      const copyContext = canvasCopy.getContext('2d')

      // Create original image
      const img = new Image()
      img.src = base64

      // Determine new ratio based on max size
      let ratio = 1
      if (img.width > maxWidth) ratio = maxWidth / img.width
      else if (img.height > maxHeight) ratio = maxHeight / img.height

      // Draw original image in second canvas
      canvasCopy.width = img.width
      canvasCopy.height = img.height
      copyContext.drawImage(img, 0, 0)

      // Copy and resize second canvas to first canvas
      canvas.width = img.width * ratio
      canvas.height = img.height * ratio
      ctx.drawImage(
        canvasCopy,
        0,
        0,
        canvasCopy.width,
        canvasCopy.height,
        0,
        0,
        canvas.width,
        canvas.height
      )
      console.log(canvas.toDataURL())
      return canvas.toDataURL()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';
.base-image-input {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 250px;
  min-height: 250px;
  background-size: cover;
  background-position: center center;
  margin: auto;
  padding: 5px;
}
.placeholder {
  background: #e0e0e0;
  width: 150px;
  height: 150px;
  display: flex;
  justify-content: center;
  border-radius: 250px;
  border: solid 2 px #e0e0e0;
  align-items: center;
  color: #333;
  font-size: 15px;
  font-family: Helvetica;

  img {
    height: 100%;
  }
}
.placeholder:hover {
  background: #e0e0e0;
}
.file-input {
  display: none;
}
.cropper {
  background: transparent;
  animation: cropper-enter 1s;

  img {
    width: 100%;
  }
}

.cropper-result {
  background: transparent;
  width: 150px;
  animation: anim-preview 0.5s;

  img {
    width: 100%;
  }
}
.login-btn {
  margin: 5px;
  cursor: pointer;
  padding: 5px 20px;
  border: 1px solid;
  display: inline-block;
  border-radius: 3px;
  border-color: $border-color;
}
.bPencil {
  opacity: 0.2;
}

.areaClass {
  background: red;
}

.top-margin {
  margin-top: 15px;
}

@keyframes anim-preview {
  0% {
    width: 0px;
  }

  100% {
    width: 150px;
    transform: rotate(360deg);
  }
}

@keyframes cropper-enter {
  0% {
    width: 0;
  }

  100% {
    opacity: 1;
  }
}
</style>
