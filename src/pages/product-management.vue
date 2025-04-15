<script>
import FetchHelper from "@/components/FetchHelper.js";

export default {
  data() {
    return {
      addingProductDialog: {

      },
      isAddingProductDialogActive: false,
      goods: [],
      products: [],
      fetchAlert: false,
      tableHeaders: [
        { title: "产品 ID", key: "id" },
        { title: "所属商品", key: "goodsBelong" },
        { title: "生产日期", key: "producingDate" },
        { title: "防伪序列号", value: "acSerialNumber"},
        { title: "防伪颜色", value: "acColors"},
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
    dialogAddingButtonClicked() {

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
              <v-form>
                <v-autocomplete
                  class="mx-8 mb-2"
                  label="所属商品"
                  :items="goodsNames"
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
      <template #item.actions="{ index, item }">
        <div class="d-flex ga-2 justify-end">
          <v-dialog
            v-model="isEditingGoodsDialogActive"
            max-width="500px"
          >
            <template #activator="{props}">
              <v-icon
                color="medium-emphasis"
                icon="mdi-pencil"
                v-bind="props"
                @click="openEditGoodsDialog(item.description)"
              />
            </template>
            <v-card
              prepend-icon="mdi-shopping"
              title="修改商品"
              subtitle="修改商品信息"
            >
              <v-form>
                <v-text-field
                  v-model="item.name"
                  class="mx-8 mb-2"
                  label="商品名称"
                  :rules="[goodsNameRequired]"
                  readonly
                />
                <v-textarea
                  v-model="editGoodsDialog.description"
                  class="mx-8"
                  label="描述"
                />
              </v-form>

              <v-divider />

              <v-card-actions>
                <v-spacer />

                <v-btn
                  text="关闭"
                  variant="plain"
                  @click="isEditingGoodsDialogActive = false"
                />

                <v-btn
                  color="primary"
                  text="修改"
                  variant="tonal"
                  @click="editGoodsButtonClicked(item.name)"
                />
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-icon
            color="medium-emphasis"
            icon="mdi-delete"
            @click="removeGoodsButtonClicked(index)"
          />
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>

<style scoped>

</style>
