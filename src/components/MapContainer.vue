<script>
import AMapLoader from "@amap/amap-jsapi-loader";

export default {
  props: {
    products: Array
  },
  unmounted() {
    this.map?.destroy();
  },
  mounted() {
    window._AMapSecurityConfig = {
      securityJsCode: "19340afc2cfe6eeec465c29a103f3056",
    };
    AMapLoader.load({
      key: "e44abcd5049f9bbfda3ebcc148e81d52", // 申请好的Web端开发者Key，首次调用 load 时必填
      version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
      plugins: ["AMap.Scale", "AMap.MarkerCluster", "AMap.ToolBar", "AMap.HawkEye", "AMap.ControlBar"], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
    }).then((AMap) => {
      this.map = new AMap.Map("container", {
        // 设置地图容器id
        viewMode: "3D", // 是否为3D地图模式
        zoom: 4.8, // 初始化地图级别
        center: [115, 37], // 初始化地图中心点位置
      });
      this.map.addControl(new AMap.Scale());
      this.map.addControl(new AMap.ToolBar({ position: "LT" }));
      this.map.addControl(new AMap.HawkEye());
      this.map.addControl(new AMap.ControlBar({ position: "RT" }));
      this.cluster = new AMap.MarkerCluster(
        this.map, //地图实例
        this.scanPoints, //海量点数据，数据中需包含经纬度信息字段 lnglat
      );
    });
  },
  watch: {
    selectedGoods() {
      this.updatePoints();
    },
    selectedInfoType() {
      this.updatePoints();
    }
  },
  methods: {
    updatePoints() {
      this.cluster.setData([]);
      if (this.selectedInfoType === "扫码地点") {
        this.cluster.setData(this.scanPoints)
      } else if (this.selectedInfoType === "假冒地点") {
        this.cluster.setData(this.counterfeitPoints)
      }
    }
  },
  computed: {
    goods() {
      const result = this.products.map(product => product.goods.name);
      result.push("全部");
      return new Set(result);
    },
    selectedProducts() {
      if (this.selectedGoods === "全部") {
        return this.products;
      }
      return this.products.filter(product => product.goods.name === this.selectedGoods)
    },
    scanPoints() {
      const result = this.selectedProducts
        .flatMap(product => product.queries)                // flatten in one go
        .filter(q =>                                      // only keep when both exist
          q.location?.lng != null &&
          q.location?.lat != null
        )
        .map(q => ({
          lnglat: [q.location.lng, q.location.lat]
        }));
      for (let i = 0; i < 10; i++) {
        result.push({lnglat: [116, 40]})
      }
      return result;
    },
    counterfeitPoints() {
      return this.selectedProducts
        .filter(product => product.isCounterfeit)
        .flatMap(product => product.queries)                // flatten in one go
        .filter(q =>                                      // only keep when both exist
          q.location?.lng != null &&
          q.location?.lat != null
        )
        .map(q => ({
          lnglat: [q.location.lng, q.location.lat]
        }));
    }
  },
  data() {
    return {
      map: null,
      cluster: null,
      selectedInfoType: "扫码地点",
      selectedGoods: "全部",
    }
  },
}
</script>

<template>
  <!-- Make this wrapper relative -->
  <div id="map-wrapper">
    <div id="container"></div>

    <!-- Add a class and position it absolutely -->
    <v-card
      class="info-card d-flex flex-column align-center"
      elevation="2"
    >
      <div class="text-h6">地点显示</div>
      <v-btn-toggle
        v-model="selectedInfoType"
        mandatory
      >
        <v-btn value="扫码地点" color="primary">
          扫码地点
        </v-btn>

        <v-btn value="假冒地点" color="error">
          假冒地点
        </v-btn>
      </v-btn-toggle>
      <v-autocomplete
        v-model="selectedGoods"
        messages="选择想要显示的商品种类"
        class="w-100 mb-0"
        label="商品选择"
        :items="goods"
      ></v-autocomplete>
    </v-card>
    <!-- Add a class and position it absolutely -->
    <v-card
      class="info-card d-flex flex-column align-center"
      elevation="2"
    >
    </v-card>

  </div>
</template>

<style scoped>
/* parent wrapper must be relative */
#map-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

/* the actual map canvas fills the parent */
#container {
  width: 100%;
  height: 100%;
}

.info-card {
  position: absolute;
  top: 16px;             /* distance from the top edge */
  left: 50%;             /* position at 50% of the wrapper’s width */
  transform: translateX(-50%); /* shift back by half its own width */
  z-index: 1000;
}
</style>
