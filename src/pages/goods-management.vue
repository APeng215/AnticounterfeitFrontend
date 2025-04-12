<script>
import FetchHelper from "@/components/FetchHelper.js";

export default {
  data() {
    return {
      goods: [],
      dialog: false,
      addGoodsDialog: {
        name: null,
        description: null,
      }
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
    },
    goodsNameRequired (goodsName) {
      return !!goodsName || '商品名称不能为空'
    },
    addGoodsButtonClicked() {
      FetchHelper.post("/goods", this.addGoodsDialog)
        .then(() => {
        })
      this.dialog = false;
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

          <v-dialog
            v-model="dialog"
            max-width="500px"
          >
            <template #activator="{props}">
              <v-btn
                border
                class="me-2"
                prepend-icon="mdi-plus"
                rounded="lg"
                text="添加商品"
                v-bind="props"
              ></v-btn>
            </template>
            <v-card
              prepend-icon="mdi-shopping"
              title="添加商品"
              subtitle="为产品添加对应的商品品牌"
            >
              <v-form>
                <v-text-field
                  v-model="addGoodsDialog.name"
                  class="mx-8 mb-2"
                  label="商品名称"
                  :rules="[goodsNameRequired]"
                />
                <v-textarea
                  v-model="addGoodsDialog.description"
                  class="mx-8"
                  label="描述"
                />
              </v-form>

              <v-divider></v-divider>

              <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn
                  text="关闭"
                  variant="plain"
                  @click="dialog = false"
                ></v-btn>

                <v-btn
                  color="primary"
                  text="添加"
                  variant="tonal"
                  @click="addGoodsButtonClicked"
                ></v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>


        </v-toolbar>
      </template>
    </v-data-table>
  </v-card>
</template>

<style scoped>

</style>
