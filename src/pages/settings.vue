<template>
  <v-card
    class="pa-4 ma-4"
    elevation="4"
  >
    <!-- 顶部标题和添加按钮 -->
    <div class="d-flex justify-space-between align-center mb-4">
      <h2>防伪颜色池</h2>
      <v-btn color="success" @click="dialog = true">添加颜色</v-btn>
    </div>

    <!-- 颜色列表 -->
    <div class="d-flex justify-center" style="flex-wrap: wrap; gap: 10px;">
      <v-card v-for="(color, index) in colors" :key="index"
              class="d-flex flex-column justify-space-between align-center"
              :style="{
                backgroundColor: 'rgb(' + color.red + ',' + color.green + ',' + color.blue + ')',
                width: '100px',
                height: '140px',
                padding: '5px',
                textAlign: 'center'
              }">
        <!-- 显示 hex 值 -->
        <div style="background: white; padding: 2px 4px; border-radius: 4px; font-size: 12px;">
          {{ toHex(color) }}
        </div>
        <v-btn small color="error" class="mt-2" @click="removeColor(toHex(color))">删除</v-btn>
      </v-card>
    </div>

    <!-- 添加颜色的弹窗 -->
    <v-dialog v-model="dialog" max-width="400">
      <v-card>
        <v-card-title>添加颜色</v-card-title>
        <v-card-text class="d-flex justify-center">
          <v-color-picker v-model="hexColor" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="dialog = false">取消</v-btn>
          <v-btn color="primary" @click="submitNewColor">确定</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import LoginHelper from "@/components/LoginHelper.js";
import FetchHelper from "@/components/FetchHelper.js";

export default {
  data() {
    return {
      dialog: false,
      colors: [],
      hexColor: '#000000', // 初始颜色（不含 alpha）
    };
  },
  methods: {
    refreshColors() {
      FetchHelper.get("/colors")
        .then((res) => {
          this.colors = res;
        })
        .catch((reason) => {
          console.error(reason);
        });
    },
    toHex(color) {
      const r = color.red.toString(16).padStart(2, '0');
      const g = color.green.toString(16).padStart(2, '0');
      const b = color.blue.toString(16).padStart(2, '0');
      return `#${r}${g}${b}`;
    },
    parseHexColor(hex) {
      const hexValue = hex.replace('#', '').substring(0, 6); // 只取 RGB
      const r = parseInt(hexValue.substring(0, 2), 16);
      const g = parseInt(hexValue.substring(2, 4), 16);
      const b = parseInt(hexValue.substring(4, 6), 16);
      return {red: r, green: g, blue: b};
    },
    submitNewColor() {
      FetchHelper.postStringInBody("/colors", this.hexColor)
        .then(() => {
          this.dialog = false;
          this.refreshColors();
          this.hexColor = '#000000';
        })
        .catch((err) => {
          console.error(err);
        });
    },
    removeColor(color) {
      FetchHelper.deleteViaBody("/colors", color)
        .then(() => this.refreshColors())
        .catch((err) => console.error(err));
    },
  },
  mounted() {
    if (!LoginHelper.isLoggedIn()) {
      this.$router.replace("/login");
    }
    this.refreshColors();
  },
};
</script>

<style scoped>
</style>
