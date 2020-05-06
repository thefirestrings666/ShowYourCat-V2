<template>
  <div class="component-wrapper">
    <StarRating
      v-model="var_VoteSelected"
      :max-rating="6"
      :show-rating="false"
      :rounded-corners="true"
      @rating-selected="vote_selected"
    ></StarRating>
  </div>
</template>

<script>
import StarRating from 'vue-star-rating'

export default {
  components: {
    StarRating
  },
  data() {
    return {
      var_VoteSelected: 0
    }
  },
  methods: {
    vote_selected() {
      console.log(this.var_VoteSelected)
      // to do
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';

.component-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  padding: 15px 0px;
  border: 1px solid;
  border-radius: 3px;
  background-color: rgba(255, 255, 255, 0.9);
  -webkit-box-shadow: 0px 0px 45px -7px rgba(0, 0, 0, 1);
  -moz-box-shadow: 0px 0px 45px -7px rgba(0, 0, 0, 1);
  box-shadow: 0px 0px 45px -7px rgba(0, 0, 0, 1);
  margin: 0px 10px;
}
</style>
