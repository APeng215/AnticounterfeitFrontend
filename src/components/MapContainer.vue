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
      plugins: ["AMap.Scale"], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
    })
      .then((AMap) => {
        this.map = new AMap.Map("container", {
          // 设置地图容器id
          viewMode: "3D", // 是否为3D地图模式
          zoom: 4.8, // 初始化地图级别
          center: [115, 37], // 初始化地图中心点位置
        });
        this.products.forEach(product => {
          const lat = product.queries.location.lat
          const lng = product.queries.location.lng
          const city = product.queries.location.city
          const marker = new AMap.Marker({
            position: new AMap.LngLat(lng, lat), //经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
            title: city,
          });
          this.map.add(marker);
        });
      })
      .catch((e) => {
        console.log(e);
      });
  },
  data() {
    return {
      map: null
    }
  },
}
</script>

<template>
  <div id="container"></div>
</template>

<style scoped>
#container {
  width: 100%;
  height: 100%;
}
</style>
