<script>
import FetchHelper from "@/components/FetchHelper.js";

export default {
  data() {
    return {
      products: [],
      fetchAlert: null,
    }
  },
  mounted() {
    FetchHelper.get("/products").then((res) => {
      this.products = res;
      this.fetchAlert = false;
    }).catch((reason) => {
      console.error(reason);
      this.fetchAlert = true;
    }).finally(() => {
    })
  }
}
</script>

<template>
  <MapContainer :products="products"/>
</template>

<style scoped>

</style>
