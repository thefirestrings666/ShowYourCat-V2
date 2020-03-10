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
      :src="imageData"
      :stencil-component="CircleStencil"
    ></cropper>
  </div>
</template>

<script>
import { Cropper } from 'vue-advanced-cropper'

export default {
  components: {
    Cropper
  },
  data() {
    return {
      imageData: null,
      reloadImg: 0
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
  height: 600px;
  background: #ddd;
}
</style>
