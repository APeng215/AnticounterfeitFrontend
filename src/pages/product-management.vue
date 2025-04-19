<script>
import FetchHelper from "@/components/FetchHelper.js";
import QrcodeVue, { QrcodeCanvas, QrcodeSvg } from 'qrcode.vue'
export default {
  components: {
    QrcodeVue,
    QrcodeCanvas,
    QrcodeSvg,
  },
  data() {
    return {
      selectedDates: [],
      selectedGoods: [],
      search: "",
      selected: null,
      QRCodeImageSettings: {
        src: 'https://i.ibb.co/GfBWx2kS/icon.png',
        width: 25,
        height: 25,
      },
      stageSize: {
        width: 120,
        height: 20
      },
      rect1Config: {
        x: 20,
        y: 20,
        width: 100,
        height: 50,
        fill: 'green',
        stroke: 'black',
        strokeWidth: 4
      },
      isFetching: false,
      isRequesting: false,
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
      ]
    }
  },
  computed: {
    productDates() {
      return [ ...new Set(this.products.map(p => p.produceDate)) ]
    },
    goodsNames() {
      return this.goods.map(goods => goods.name);
    },
    filteredProducts() {
      return this.products.filter(p => {
        // if selectedDates is empty, don’t filter by date
        const matchesDate =
          !this.selectedDates || this.selectedDates.length === 0 ||
          this.selectedDates.includes(p.produceDate)

        // if selectedGoods is empty, don’t filter by goods
        const matchesGoods =
          !this.selectedGoods || this.selectedGoods.length === 0 ||
          this.selectedGoods.includes(p.goods.name)

        // keep only if it passes both active filters
        return matchesDate && matchesGoods
      })
    }
  },
  mounted() {
    this.fetchGoods()
    this.fetchProducts()
  },
  methods: {
    fetchProducts() {
      this.isFetching = true;
      this.products = [];
      FetchHelper.get("/products").then((res) => {
        this.products = res;
        this.fetchAlert = false;
      }).catch((reason) => {
        console.error(reason);
        this.fetchAlert = true;
      }).finally(() => {
        this.isFetching = false;
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
      this.isRequesting = true;
      FetchHelper.post("/products", this.addingProductDialog).then((product) => {
        console.debug(product);
        this.fetchProducts();
        this.isAddingProductDialogActive = false;
      }).finally(() => {
        this.isRequesting = false;
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
      :search="search"
      v-model="selected"
      :items="filteredProducts"
      :headers="tableHeaders"
      :loading="isFetching"
      show-expand
      show-select
      return-object
      select-strategy="all"
    >
      <template #top>
        <v-toolbar title="产品">
          <v-autocomplete
            clearable
            multiple
            chips
            v-model="selectedGoods"
            label="筛选商品"
            :items="goodsNames"
            variant="outlined"
            density="compact"
            class="mt-5 me-2"
          ></v-autocomplete>
          <v-autocomplete
            clearable
            multiple
            chips
            v-model="selectedDates"
            label="筛选日期"
            :items="productDates"
            variant="outlined"
            density="compact"
            class="mt-5 me-2"
          ></v-autocomplete>
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
              :loading="isRequesting"
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
      <template v-slot:item.data-table-expand="{ internalItem, isExpanded, toggleExpand }">
        <v-spacer />
        <v-btn
          :append-icon="isExpanded(internalItem) ? 'mdi-chevron-up' : 'mdi-chevron-down'"
          :text="isExpanded(internalItem) ? '防伪码' : '防伪码'"
          class="text-none"
          color="medium-emphasis"
          size="small"
          variant="text"
          border
          slim
          @click="toggleExpand(internalItem)"
        ></v-btn>
      </template>
      <template v-slot:expanded-row="{ columns, item }">
        <tr>
          <td :colspan="columns.length" class="py-2">
            <div class="d-flex justify-end">
              <v-card
                color="indigo"
                variant="tonal"
                width="160"
                height="180"
                class="d-flex flex-column align-center justify-center"
                elevation="3"
              >
                <v-stage :config="stageSize">
                  <v-layer>
                    <v-rect
                      v-for="(item, index) in item.acColorsInHex"
                      :config="{ x: 20 * index, y: 0, width: 20, height: 20, fill: item }"
                    />
                  </v-layer>
                </v-stage>
                <qrcode-canvas
                  value="https://example.com"
                  size="120"
                  level="M"
                  :image-settings="QRCodeImageSettings"
                  margin="1"
                />
                <v-stage :config="stageSize">
                  <v-layer>
                    <v-rect
                      v-for="(item, index) in item.acColorsInHex"
                      :config="{ x: 20 * index, y: 0, width: 20, height: 20, fill: item }"
                    />
                  </v-layer>
                </v-stage>
              </v-card>
            </div>
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-card>
  <pre>{{selected}}</pre>
</template>

<style scoped>

</style>
