<template>
  <div class="component-wrapper">
    <div class="info-Container">
      <h1>0</h1>
      <p>pictures</p>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';

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
  .info-Container {
    width: 50%;
    display: flex;
    flex-direction: row;

    h1 {
      margin: 5px;
    }
    h4 {
      margin: 5px;
    }
  }
}
</style>
