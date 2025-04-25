<script>
import FetchHelper from "@/components/FetchHelper.js";
export default {
  data() {
    return {
      isFetching: false,
      isRequesting: false,
      fetchAlert: false,
      goods: [],
      isAddingGoodsDialogActive: false,
      isEditingGoodsDialogActive: false,
      addGoodsDialog: {
        name: null,
        description: null,
      },
      editGoodsDialog: {
        description: null,
      },
      tableHeaders : [
        {title: "商品名称", key: "name"},
        {title: "描述", value: "description"},
        {title: "操作", key: "actions", align: "end", sortable: false },
      ]
    }
  },
  mounted() {
    this.fetchGoods();
  },
  methods: {
    closeAddingDialog() {
      this.isAddingGoodsDialogActive = false;
      this.addGoodsDialog.name = null;
      this.addGoodsDialog.description = null;
    },
    closeEditGoodsDialog() {
      this.isEditingGoodsDialogActive = false;
    },
    openEditGoodsDialog(goodDescriptionEdited) {
      this.editGoodsDialog.description = goodDescriptionEdited;
    },
    fetchGoods() {
      this.isFetching = true;
      FetchHelper.get("/goods").then((data) => {
        this.goods = data;
        this.fetchAlert = false;
      }).catch(reason => {
        console.error(reason);
        this.fetchAlert = true;
      }).finally(() => {
        this.isFetching = false;
      });
    },
    goodsNameRequired (goodsName) {
      return !!goodsName || '商品名称不能为空'
    },
    addGoodsButtonClicked() {
      this.isRequesting = true;
      FetchHelper.post("/goods", this.addGoodsDialog).then(() => {
        this.reFetchGoods()
        }).finally(() => {
        this.isRequesting = false;
      })
    },
    removeGoodsButtonClicked(index) {
      FetchHelper
        .delete("/goods", this.goods[index].name)
        .then(() => {
          this.reFetchGoods();
        })
    },
    editGoodsButtonClicked(goodsName) {
      FetchHelper.put("/goods", {name: goodsName, description: this.editGoodsDialog.description}).then(() => {
        this.reFetchGoods();
      })
    },
    reFetchGoods() {
      this.goods = [];
      this.fetchGoods()
      this.closeAddingDialog();
      this.closeEditGoodsDialog()
    },
  }
}
</script>

<template>
  <v-card
    class="ma-16"
    elevation="5"
  >
    <v-alert
      v-model="fetchAlert"
      type="error"
      closable
      text="获取商品信息失败！"
    />
    <v-data-table
      :items="goods"
      :headers="tableHeaders"
      :loading="isFetching"
    >
      <template v-slot:top>
        <v-toolbar>
          <v-toolbar-title>
            商品
          </v-toolbar-title>
          <v-dialog
            v-model="isAddingGoodsDialogActive"
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
              :loading="isRequesting"
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
                  @click="isAddingGoodsDialogActive = false"
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
      <template v-slot:item.actions="{ index, item }">
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

              <v-divider></v-divider>

              <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn
                  text="关闭"
                  variant="plain"
                  @click="isEditingGoodsDialogActive = false"
                ></v-btn>

                <v-btn
                  color="primary"
                  text="修改"
                  variant="tonal"
                  @click="editGoodsButtonClicked(item.name)"
                ></v-btn>
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
