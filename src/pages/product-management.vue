<script>
import FetchHelper from "@/components/FetchHelper.js";
import QrcodeVue, {QrcodeCanvas, QrcodeSvg} from 'qrcode.vue'
import LoginHelper from "@/components/LoginHelper.js";

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
      selected: [],
      QRCodeImageSettings: {
        src: '/icon.png',
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
        {title: "产品 ID", key: "id"},
        {title: "所属商品", key: "goods.name"},
        {title: "生产日期", key: "produceDate"},
        {title: "防伪序列号", value: "uuid"},
        {title: "", value: "actions"},
      ]
    }
  },
  computed: {
    getFrontEndIp() {
      return FetchHelper.frontEndIP;
    },
    productDates() {
      return [...new Set(this.products.map(p => p.produceDate))]
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
    if (!LoginHelper.isLoggedIn()) {
      this.$router.replace("/login")
    }
    this.fetchGoods()
    this.fetchProducts()
  },
  methods: {
    getValidationIp(productUuid, signature) {
      return `${this.getFrontEndIp}/validation?uuid=${productUuid}&sig=${signature}`;
    },
    removeProduct(item) {
      FetchHelper.delete("/products", item.id)
        .then(() => {
          // remove the deleted item from this.products
          this.products = this.products.filter(p => p.id !== item.id);
          this.selected = this.selected.filter(p => p.id !== item.id);
        })
        .catch(err => {
          console.error("Failed to delete product:", err);
        });
    },
    removeProducts(ids) {
      FetchHelper.deleteAll("/products", ids)
        .then(() => {
          this.selected = this.selected.filter(element => !ids.includes(element.id));
          this.fetchProducts();
        }).catch(() => {
          alert("批量删除商品失败！")
      })
    },
    goPrint(selected) {
      sessionStorage.setItem(
        'selectedProducts',
        JSON.stringify(selected)
      )
      // this.$router.push({ path: '/print-qrcodes' })
      // if you're using Vue Router, resolve the full URL
      const url = this.$router.resolve('/print-qrcodes').href;
      window.open(url, '_blank');

      // or if it’s a simple path/external link:
      // window.open('/details', '_blank');
    },
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
      const {valid, errors} = await this.$refs.addProductForm.validate();
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
  <v-card
    class="ma-16"
    elevation="5"
  >
    <v-alert
      v-model="fetchAlert"
      closable
      text="获取产品信息失败！"
      type="error"
    />
    <v-data-table
      v-model="selected"
      :headers="tableHeaders"
      :items="filteredProducts"
      :loading="isFetching"
      :search="search"
      return-object
      select-strategy="all"
      show-expand
      show-select
    >
      <template #top>
        <v-toolbar title="产品">
          <v-autocomplete
            v-model="selectedGoods"
            :items="goodsNames"
            chips
            class="mt-5 me-2"
            clearable
            density="compact"
            label="筛选商品"
            multiple
            variant="outlined"
          ></v-autocomplete>
          <v-autocomplete
            v-model="selectedDates"
            :items="productDates"
            chips
            class="mt-5 me-2"
            clearable
            density="compact"
            label="筛选日期"
            multiple
            variant="outlined"
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
              :loading="isRequesting"
              prepend-icon="mdi-content-paste"
              subtitle="为商品添加对应的产品"
              title="添加产品"
            >
              <v-form ref="addProductForm">
                <v-autocomplete
                  v-model="addingProductDialog.goodsName"
                  :items="goodsNames"
                  :rules="[v => !!v || '所属商品不能为空']"
                  class="mx-8 mb-2"
                  label="所属商品"
                  required
                />
                <v-number-input
                  v-model="addingProductDialog.produceNum"
                  :min="1"
                  :rules="[v => !!v || '生产数量不能为空']"
                  class="mx-8 mb-2"
                  label="生产数量"
                  required
                />
                <v-date-input
                  v-model="addingProductDialog.produceDate"
                  :rules="[v => !!v || '生产日期不能为空']"
                  class="mx-8 mb-2"
                  label="生产日期"
                  prepend-icon=""
                  prepend-inner-icon="$calendar"
                  required
                />
              </v-form>

              <v-divider/>

              <v-card-actions>
                <v-spacer/>

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
          <v-btn
            :disabled="selected.length === 0"
            :text="selected.length === 0 ? '请选择要删除的条目' : '删除选中产品'"
            border
            color="error"
            class="me-2"
            prepend-icon="mdi-delete-outline"
            rounded="lg"
            @click="removeProducts(selected.map(product => product.id))"
          />
          <v-btn
            :disabled="selected.length === 0"
            :text="selected.length === 0 ? '请选择要导出的条目' : '导出防伪码'"
            border
            class="me-2"
            prepend-icon="mdi-export-variant"
            rounded="lg"
            @click="goPrint(selected)"
          />
        </v-toolbar>
      </template>
      <template v-slot:item.data-table-expand="{ internalItem, isExpanded, toggleExpand }">
        <v-spacer/>
        <v-btn
          :append-icon="isExpanded(internalItem) ? 'mdi-chevron-up' : 'mdi-chevron-down'"
          :text="isExpanded(internalItem) ? '防伪码' : '防伪码'"
          border
          class="text-none"
          color="medium-emphasis"
          size="small"
          slim
          variant="text"
          @click="toggleExpand(internalItem)"
        ></v-btn>
      </template>
      <template v-slot:expanded-row="{ columns, item }">
        <tr>
          <td :colspan="columns.length" class="py-2">
            <div class="d-flex justify-end">
              <v-card
                class="d-flex flex-column align-center justify-center"
                color="indigo"
                elevation="3"
                height="180"
                variant="tonal"
                width="160"
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
                  :image-settings="QRCodeImageSettings"
                  level="M"
                  margin="1"
                  size="120"
                  :value="getValidationIp(item.uuid, item.signature)"
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
      <template v-slot:item.actions="{ index, item }">
        <v-icon
          color="error"
          icon="mdi-delete-outline"
          @click="removeProduct(item)"
        />
      </template>
    </v-data-table>
  </v-card>
  <div id="pdfDom" class="d-flex flex-wrap justify-center">
    <v-card
      v-for="singleSelected in selected"
      class="d-flex flex-column align-center justify-center ma-1 qrCode"
      color="indigo"
      height="180"
      variant="tonal"
      width="160"
    >
      <v-stage :config="stageSize">
        <v-layer>
          <v-rect
            v-for="(item, index) in singleSelected.acColorsInHex"
            :config="{ x: 20 * index, y: 0, width: 20, height: 20, fill: item }"
          />
        </v-layer>
      </v-stage>
      <qrcode-canvas
        :image-settings="QRCodeImageSettings"
        :margin="1"
        :size="120"
        :value="getValidationIp(singleSelected.uuid, singleSelected.signature)"
        level="M"
      />
      <v-stage :config="stageSize">
        <v-layer>
          <v-rect
            v-for="(item, index) in singleSelected.acColorsInHex"
            :config="{ x: 20 * index, y: 0, width: 20, height: 20, fill: item }"
          />
        </v-layer>
      </v-stage>
    </v-card>
  </div>
</template>

<style scoped>
</style>
