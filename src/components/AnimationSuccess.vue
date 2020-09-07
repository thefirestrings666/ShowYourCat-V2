<template>
  <div class="loading-wrapper">
    <!-- Succes -->
    <svg
      v-if="animation == 1"
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
    <!-- Error -->
    <svg
      v-if="animation == 0"
      id="Calque_2"
      version="1.0"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      width="50px"
      height="70px"
      viewBox="0 0 256 256"
      enable-background="new 0 0 256 256"
      xml:space="preserve"
    >
      <circle
        id="circle"
        fill="none"
        stroke="#db041d"
        stroke-width="20"
        stroke-miterlimit="10"
        cx="128"
        cy="126.5"
        r="112.5"
      />
      <polyline
        id="check"
        fill="none"
        stroke="#db041d"
        stroke-width="20"
        stroke-miterlimit="10"
        points="296.9,69.9 354.5,114.8 
	435.6,29.5 "
      />
      <line
        fill="none"
        stroke="#db041d"
        stroke-width="20"
        stroke-miterlimit="10"
        x1="48.5"
        y1="47"
        x2="207.5"
        y2="206"
      />
      <line
        fill="none"
        stroke="#db041d"
        stroke-width="20"
        stroke-miterlimit="10"
        x1="207.5"
        y1="47"
        x2="48.5"
        y2="206"
      />
    </svg>
  </div>
</template>

<script>
export default {
  props: {
    animation: { type: Number }
  }
}
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

  #Calque_1 {
    fill: $blue-1;
    stroke: $orange-1;
    animation: anim-footprint 0.5s;
  }

  #Calque_2 {
    fill: $blue-1;
    stroke: $orange-1;
    animation: anim-footprint-error 0.5s;
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

  @keyframes anim-footprint-error {
    0% {
      width: 0px;
    }

    100% {
      width: 50px;
      transform: rotate(360deg);
    }
  }
}
</style>
