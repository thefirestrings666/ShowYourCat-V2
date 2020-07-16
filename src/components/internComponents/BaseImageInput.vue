<template>
  <div class="base-image-input">
    <span
      v-if="!imageData"
      :style="style"
      class="placeholder"
      @click="chooseImage"
    >
      Choose an Image
    </span>
    <input
      ref="fileInput"
      class="file-input"
      type="file"
      accept="image/*"
      @change="onSelectFile"
    />

    <cropper
      v-if="imageData && !v_preview"
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
    <div v-if="v_preview" class="cropper-result">
      <img :src="imageData" />
    </div>

    <div v-if="v_preview" class="login-btn top-margin" @click="resetComp">
      Try again !
    </div>
    <div v-if="imageData && !v_preview" class="login-btn " @click="cropPreview">
      Crop!
    </div>
  </div>
</template>

<script>
import { Cropper, CircleStencil } from 'vue-advanced-cropper'

export default {
  components: {
    Cropper
  },
  props: {
    color: { type: String }
  },
  data() {
    return {
      imageData: null,
      imageDataComplete: false,
      imageJPG: null,

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
        reader.onload = e => {
          this.imageData = e.target.result
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
      const { canvas } = this.$refs.cropper.getResult()

      this.$emit('img_selected', this.roundEdges(canvas).toDataURL())
      this.v_preview = true
      this.imageData = this.roundEdges(canvas).toDataURL()
      this.imageDataComplete = true
    },
    resetComp() {
      this.imageData = null
      this.v_preview = false
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
  cursor: pointer;
  background-size: cover;
  background-position: center center;
  margin: auto;
  padding: 5px;
}
.placeholder {
  background: #e0e0e0;
  width: 250px;
  height: 250px;
  display: flex;
  justify-content: center;
  border-radius: 250px;
  border: solid 2 px #e0e0e0;
  align-items: center;
  color: #333;
  font-size: 18px;
  font-family: Helvetica;
}
.placeholder:hover {
  background: #e0e0e0;
}
.file-input {
  display: none;
}
.cropper {
  background: transparent;

  img {
    width: 100%;
  }
}

.cropper-result {
  background: transparent;
  width: 150px;

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
</style>
