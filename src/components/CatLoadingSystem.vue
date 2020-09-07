<template>
  <div class="picture-wrapper">
    <img
      class="picture"
      :src="pictureURL"
      @load="isLoaded"
      @error="loadRandomCat"
    />
  </div>
</template>

<script>
import CatPicturesDB from '@/firebase/catPictures-data-db'
import Firebase from 'firebase'

export default {
  data() {
    return {
      pictureURL: null,
      payload: null
    }
  },

  mounted() {
    this.loadRandomCat()
  },
  methods: {
    async loadRandomCat() {
      const CatPicturesDb = new CatPicturesDB()

      const allPictures = await CatPicturesDb.readAll([['resized', '==', true]])

      const random = Math.floor(Math.random() * Math.floor(allPictures.length))

      const storage = Firebase.storage()

      this.payload = allPictures[random]

      await storage
        .ref(`catPicture/${allPictures[random].pictureID}`)
        .getDownloadURL()
        .then(output => {
          this.pictureURL = output
        })
        .catch(error => {
          console.log(error)
        })
    },
    isLoaded() {
      this.$emit('loadingDone', { payload: this.payload })
    },
    callFunction() {
      setTimeout(() => {
        this.isLoaded()
      }, 5000)
    }
  }
}
</script>

<style lang="scss" scoped>
.picture-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;

  .picture {
    // width: 95%;
    max-height: 100vh;
    margin: 15px 5px;

    @media screen and (max-width: 600px) {
      width: 90%;
    }
  }
}
</style>
