<script>
import FetchHelper from "@/components/FetchHelper.js";

export default {
  data() {
    return {
      addingProductDialog: {
        goodsName: "",
        produceNum: 1,
        produceDate: null,
      },
      isAddingProductDialogActive: false,
      goods: [],
      products: [],
      fetchAlert: false,
      tableHeaders: [
        { title: "产品 ID", key: "id" },
        { title: "所属商品", key: "goods.name" },
        { title: "生产日期", key: "produceDate" },
        { title: "防伪序列号", value: "uuid"},
        { title: "防伪颜色", value: ""},
      ]
    }
  },
  computed: {
    goodsNames() {
      return this.goods.map(goods => goods.name);
    }
  },
  mounted() {
    this.fetchGoods()
    this.fetchProducts()
  },
  methods: {
    fetchProducts() {
      this.products = [];
      FetchHelper.get("/products").then((res) => {
        this.products = res;
        this.fetchAlert = false;
      }).catch((reason) => {
        console.error(reason);
        this.fetchAlert = true;
      })
    },
    fetchGoods() {
      FetchHelper.get("/goods").then((data) => {
        this.goods = data;
      });
    },
    async dialogAddingButtonClicked() {
      const { valid, errors } = await this.$refs.addProductForm.validate();
      if (!valid) {
        errors.forEach(error => {
          console.warn(error.errorMessages[0]);
        })
        return;
      }
      FetchHelper.post("/products", this.addingProductDialog).then((product) => {
        console.debug(product);
        this.fetchProducts();
        this.isAddingProductDialogActive = false;
      });
    }
  }
}
</script>

<template>
  <v-card class="ma-16">
    <v-alert
      v-model="fetchAlert"
      type="error"
      closable
      text="获取产品信息失败！"
    />
    <v-data-table
      :items="products"
      :headers="tableHeaders"
    >
      <template #top>
        <v-toolbar>
          <v-toolbar-title>
            产品
          </v-toolbar-title>
          <v-dialog
            v-model="isAddingProductDialogActive"
            max-width="500px"
          >
            <template #activator="{props}">
              <v-btn
                border
                class="me-2"
                prepend-icon="mdi-plus"
                rounded="lg"
                text="添加产品"
                v-bind="props"
              />
            </template>
            <v-card
              prepend-icon="mdi-content-paste"
              title="添加产品"
              subtitle="为商品添加对应的产品"
            >
              <v-form ref="addProductForm">
                <v-autocomplete
                  v-model="addingProductDialog.goodsName"
                  class="mx-8 mb-2"
                  label="所属商品"
                  :items="goodsNames"
                  :rules="[v => !!v || '所属商品不能为空']"
                  required
                />
                <v-number-input
                  label="生产数量"
                  v-model="addingProductDialog.produceNum"
                  class="mx-8 mb-2"
                  :min="1"
                  required
                  :rules="[v => !!v || '生产数量不能为空']"
                />
                <v-date-input
                  class="mx-8 mb-2"
                  label="生产日期"
                  prepend-icon=""
                  prepend-inner-icon="$calendar"
                  v-model="addingProductDialog.produceDate"
                  required
                  :rules="[v => !!v || '生产日期不能为空']"
                />
              </v-form>

              <v-divider />

              <v-card-actions>
                <v-spacer />

                <v-btn
                  text="关闭"
                  variant="plain"
                  @click="isAddingProductDialogActive = false"
                />

                <v-btn
                  color="primary"
                  text="添加"
                  variant="tonal"
                  @click="dialogAddingButtonClicked"
                />
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
