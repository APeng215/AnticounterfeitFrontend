<script>
export default {
}
</script>

<template>
  <v-card class="ma-16">
    <v-data-table
      :items="goods"
      :headers="tableHeaders"
    >
      <template v-slot:top>
        <v-toolbar flat>
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
