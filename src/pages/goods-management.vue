<script>
import FetchHelper from "@/components/FetchHelper.js";

export default {
  data() {
    return {
      goods: [

      ]
    }
  },
  mounted() {
    this.fetchGoods();
  },
  methods: {
    fetchGoods() {
      FetchHelper.get("/goods").then((data) => {
        this.goods = data;
      });
    }
  }
}
</script>

<template>
  <v-card class="ma-16">
    <v-data-table :items="goods">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>
            商品
          </v-toolbar-title>

          <v-btn
            class="me-2"
            prepend-icon="mdi-plus"
            rounded="lg"
            text="添加商品"
            border
            @click="add"
          ></v-btn>
        </v-toolbar>
      </template>
    </v-data-table>
  </v-card>
</template>

<style scoped>

</style>
