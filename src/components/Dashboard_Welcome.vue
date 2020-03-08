<template>
  <div class="component-wrapper">
    <img alt="logo-bento" class="logo" src="@/assets/catface4.svg" />
    <h1>Welcome on Show Your Cat !</h1>
  </div>
</template>

<script>
export default {}
</script>

<style scoped>
.component-wrapper {
  margin: 10px;

  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 75%;
  max-width: 600px;
  padding: 15px 0px;
  border: 1px solid;
  border-radius: 3px;
  background-color: rgba(255, 255, 255, 0.9);
  -webkit-box-shadow: 0px 0px 45px -7px rgba(0, 0, 0, 1);
  -moz-box-shadow: 0px 0px 45px -7px rgba(0, 0, 0, 1);
  box-shadow: 0px 0px 45px -7px rgba(0, 0, 0, 1);

  @media only screen and (max-width: 768px) {
    margin-top: 15px;
    width: 100%;
  }
}
</style>
