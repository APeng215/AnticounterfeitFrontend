<script>
export default {
  mounted() {
    this.uuid = this.$route.query.uuid;
    this.signature = this.$route.query.signature;

  },
  data() {
    return {
      uuid: null,
      signature: null,
      stageSize: {
        width: 120,
        height: 20
      },
      product: null,
    }
  }
}
</script>

<template>
<v-card>
  <v-stage :config="stageSize">
    <v-layer>
      <v-rect
        v-for="(item, index) in product.acColorsInHex"
        :config="{ x: 20 * index, y: 0, width: 20, height: 20, fill: item }"
      />
    </v-layer>
  </v-stage>
</v-card>
</template>

<style scoped>

</style>
