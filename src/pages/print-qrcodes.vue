<script>
import { QrcodeCanvas } from 'qrcode.vue'
export default {
  components: {QrcodeCanvas},
  data() {
    return {
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
    }
  },
  methods: {
    print() {
      window.print()
    },
    loadItems() {
      const raw = sessionStorage.getItem('selectedProducts') || '[]'
      this.selected = JSON.parse(raw);
    }
  },
  mounted() {
    this.loadItems()
  }
}
</script>

<template>
  <v-btn @click="print" class="no-print">打印</v-btn>
  <div class="d-flex flex-wrap justify-center" id="pdfDom">
    <v-card
      color="indigo"
      variant="tonal"
      width="160"
      height="180"
      class="d-flex flex-column align-center justify-center ma-1 qrCode"
      v-for="singleSelected in selected"
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
        value="https://example.com"
        :size="120"
        level="M"
        :image-settings="QRCodeImageSettings"
        :margin="1"
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

<route lang="yaml">
meta:
  layout: empty
</route>


<style scoped>
@media print{
  .no-print{
    display: none;
  }
}
</style>

