<script>
import FetchHelper from "@/components/FetchHelper.js";
import LoginHelper from "@/components/LoginHelper.js";
const gradients = [
  ['#222'],
  ['#42b3f4'],
  ['red', 'orange', 'yellow'],
  ['purple', 'violet'],
  ['#00c6ff', '#F0F', '#FF0'],
  ['#f72047', '#ffd200', '#1feaea'],
]

export default {
  data() {
    return {
      productionStats: {},
      selectedYear: 2025,
      radius: 10,
      padding: 12,
      lineCap: 'round',
      gradient: gradients[5],
      gradientDirection: 'top',
      gradients,
      fill: false,
      type: 'trend',
      lineWidth: 1.5,
      autoLineWidth: false,
      label: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]
    }
  },
  mounted() {
    if (!LoginHelper.isLoggedIn()) {
      this.$router.push("/login")
    }
    FetchHelper.get("/products/stats").then(stats => {
      this.productionStats = stats.annualProductions;
    })
  }
}
</script>

<template>
  <v-container class="fill-height">
    <v-row
      justify="center"
    >
      <v-col cols="10">
        <v-card
          color="secondary"
          title="产量统计"
          subtitle="统计每年的产品产量趋势"
          elevation="5"
        >
          <template v-slot:append>
            <v-autocomplete
              min-width="120"
              label="年份"
              v-model="selectedYear"
              :items="Object.keys(productionStats)"
            ></v-autocomplete>
          </template>
          <v-divider></v-divider>
          <v-sheet
            class="v-sheet--offset ma-2"
            elevation="12"
            rounded="lg"
          >
            <v-sparkline
              :line-width="lineWidth"
              :auto-line-width="autoLineWidth"
              :fill="fill"
              :gradient="gradient"
              :gradient-direction="gradientDirection"
              :model-value="productionStats[selectedYear]"
              :padding="padding"
              :smooth="radius || false"
              :stroke-linecap="lineCap"
              :type="type"
              :labels="label"
              auto-draw
              color="green"
            >
            </v-sparkline>
          </v-sheet>



        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>

</style>
