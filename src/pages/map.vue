<script>
import FetchHelper from "@/components/FetchHelper.js";
import LoginHelper from "@/components/LoginHelper.js";

export default {
  data() {
    return {
      products: null,
      loaded: false,
    }
  },
  mounted() {
    if (!LoginHelper.isLoggedIn()) {
      this.$router.replace("/login")
    }
    FetchHelper.get("/products").then((res) => {
      this.products = res;
      this.loaded = true;
    }).catch((reason) => {
      console.error(reason);
    })
  }
}
</script>

<template>
  <MapContainer v-if="loaded" :products="products"/>
</template>

<style scoped>

</style>
