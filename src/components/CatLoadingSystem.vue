<template>
  <div class="picture-wrapper">
    <img class="picture" :src="pictureURL" @load="isLoaded" />
  </div>
</template>

<script>
import CatPicturesDB from '@/firebase/catPictures-data-db'
import Firebase from 'firebase'

export default {
  data() {
    return {
      pictureURL: null
    }
  },

  mounted() {
    this.loadRandomCat()
  },
  methods: {
    async loadRandomCat() {
      const CatPicturesDb = new CatPicturesDB()

      const allPictures = await CatPicturesDb.readAll()

      const random = Math.floor(Math.random() * Math.floor(allPictures.length))

      const storage = Firebase.storage()

      await storage
        .ref(`catPicture/${allPictures[random].pictureID}`)
        .getDownloadURL()
        .then(output => {
          this.pictureURL = output
        })
    },
    isLoaded() {
      this.$emit('loadingDone')
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
    width: 75%;
    margin: 15px 5px;
  }
}
</style>
