<script>
import FetchHelper from "@/components/FetchHelper.js";

export default {
  data() {
    return {
      error: false,
      loading: false,
      uuid: null,
      signature: null,
      stageSize: {
        width: 120,
        height: 20
      },
      product: {
        isCounterfeit: null,
        uuid: null,
        goods: {
          name: null,
          description: null
        },
        produceDate: null,
        signature: null,
        acColorsInHex: [],
        id: null
      },
    }
  },
  mounted() {
    this.uuid = this.$route.query.uuid;
    this.signature = this.$route.query.sig;
    this.loading = true;
    FetchHelper.post("/products/validate", {uuid: this.uuid, signature: this.signature})
      .then(product => {this.product = product})
      .catch(err => {this.error = true})
      .finally(() => {this.loading = false});
  },
  computed: {
    cardColor() {
      if (this.loading) {
        return null;
      }
      return this.product.isCounterfeit ? 'error' : 'success'
    }
  }
}
</script>

<template>
  <div
    class="d-flex flex-column justify-center align-center"
    style="height: 100vh;"
  >
    <v-alert elevation="4" max-height="80" color="error" v-if="error" text="查询失败，您的商品可能为假冒！"></v-alert>
    <v-card
      v-if="!error"
      :prepend-icon="product.isCounterfeit ? 'mdi-close-box-outline' : 'mdi-checkbox-marked-circle-outline'"
      title="产品防伪查询结果"
      :subtitle="product.isCounterfeit ? '您的商品存在假冒风险！' : '您的商品为正品！'"
      :color="cardColor"
      elevation="5"
      :loading="loading"
      min-width="347.81"
    >
      <v-card-text class="bg-surface-light pt-4">
        <p>商品: {{ product.goods.name }}</p>
        <p>商品描述: {{ product.goods.description }}</p>
        <p>产品序列号: {{ product.id }}</p>
        <p>生产日期: {{ product.produceDate }}</p>
        <p>查询次数: {{product.queryCount}}</p>
        <p>防伪码: {{ product.uuid }}</p>
        <p>防伪颜色:</p>
        <v-stage :config="stageSize">
          <v-layer>
            <v-rect
              v-for="(item, index) in product.acColorsInHex"
              :config="{ x: 20 * index, y: 0, width: 20, height: 20, fill: item }"
            />
          </v-layer>
        </v-stage>
      </v-card-text>
    </v-card>
  </div>
</template>

<route lang="yaml">
meta:
  layout: background
</route>

<style scoped>

</style>
