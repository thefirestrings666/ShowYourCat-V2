<template>
  <div class="loading-wrapper">
    <svg
      id="Calque_1"
      version="1.0"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      width="150px"
      height="150px"
      viewBox="0 0 256 256"
      enable-background="new 0 0 256 256"
      xml:space="preserve"
    >
      <circle
        id="circle"
        fill="none"
        stroke-width="20"
        stroke-miterlimit="10"
        cx="128"
        cy="126.5"
        r="112.5"
      />
      <polyline
        id="check"
        fill="none"
        stroke-width="20"
        stroke-miterlimit="10"
        points="63.439,117.116 
	121.033,161.999 202.136,76.713 "
      />
    </svg>
    <h4>Your cat is online !</h4>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';
.loading-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  h4 {
    margin: 30px;
  }

  svg {
    fill: $blue-1;
    stroke: $orange-1;
    animation: anim-footprint 0.5s;
  }
  @keyframes anim-footprint {
    0% {
      width: 50px;
    }

    100% {
      width: 150px;
      transform: rotate(360deg);
    }
  }
}
</style>
