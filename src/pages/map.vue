<script>
import FetchHelper from "@/components/FetchHelper.js";

export default {
  data() {
    return {
      products: null,
      loaded: false,
    }
  },
  mounted() {
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
