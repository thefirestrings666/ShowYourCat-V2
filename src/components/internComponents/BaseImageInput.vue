<template>
  <div class="base-image-input">
    <span v-if="!imageData" class="placeholder" @click="chooseImage">
      Choose an Image
    </span>
    <input
      ref="fileInput"
      class="file-input"
      type="file"
      @input="onSelectFile"
    />

    <cropper
      v-if="imageData"
      ref="cropper"
      classname="cropper"
      image-classname="bPencil"
      :src="imageData"
      :canvas="true"
      :image-restriction="'stencil'"
      :stencil-component="CircleStencil"
      :stencil-props="{
        imageClassname: 'bPencil'
      }"
    ></cropper>
    <div v-if="imageData" class="login-btn" @click="cropPreview">
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
  data() {
    return {
      imageData: null,
      CircleStencil,
      coordinates: null
    }
  },
  methods: {
    chooseImage() {
      this.$refs.fileInput.click()
    },
    onSelectFile() {
      const input = this.$refs.fileInput
      const { files } = input
      if (files && files[0]) {
        const reader = new FileReader()
        reader.onload = e => {
          this.imageData = e.target.result
        }
        reader.readAsDataURL(files[0])
        this.$emit('input', files[0])
        this.reloadImg += 1
      }
    },
    change({ coordinates, canvas }) {
      console.log(coordinates, canvas)
    },
    cropPreview() {
      const { coordinates, canvas } = this.$refs.cropper.getResult()
      this.coordinates = coordinates
      console.log(canvas)
      // You able to do different manipulations at a canvas
      // but there we just get a cropped image
      this.imageData = canvas.toDataURL()
    }
  }
}
</script>

<style scoped>
.base-image-input {
  display: block;
  width: 300px;
  height: 300px;
  cursor: pointer;
  background-size: cover;
  background-position: center center;
  margin: auto;
  padding: 5px;
  margin-bottom: 50px;
}
.placeholder {
  background: #f0f0f0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
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
  height: 6000px;
  background: #ddd;
}
.login-btn {
  margin: 5px;
  cursor: pointer;
  padding: 5px 20px;
  border: 1px solid;
  display: inline-block;
  border-radius: 3px;
  border-color: #2c3e50;
}
.bPencil {
  opacity: 0.2;
}
</style>
