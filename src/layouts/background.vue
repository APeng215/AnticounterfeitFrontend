<script>
export default {
  name: "background"
}
</script>

<template>
  <div class="bg">
    <router-view/>
  </div>
</template>

<style scoped>
.bg {
  background-image: url('/blue-background.jpg');  /* path to your image */
  background-repeat: no-repeat;         /* don’t tile */
  background-position: center center;   /* horizontal / vertical */
  background-size: cover;               /* scale to cover container */
}
</style>
