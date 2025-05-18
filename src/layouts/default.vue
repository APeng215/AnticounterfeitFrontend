<script>
import LoginHelper from "@/components/LoginHelper.js";

export default {
  data() {
    return {
      drawer: true,
    }
  },
  methods: {
    logout() {
      LoginHelper.setLoggedIn(false);
      this.$router.replace('/login')
    }
  }
}
</script>

<style scoped>
.bg {
  background-image: url('/login-background.jpg');  /* path to your image */
  background-repeat: no-repeat;         /* don’t tile */
  background-position: center center;   /* horizontal / vertical */
  background-size: cover;               /* scale to cover container */
}
</style>

<template>
  <v-app class="bg">
    <v-navigation-drawer class="elevation-2" v-model="drawer">
      <v-list nav>
        <v-list-subheader>项目选择</v-list-subheader>
        <v-list-item
          rounded="xl"
          class="font-weight-medium"
          title="主页"
          to="/home"
        >
          <template #prepend>
            <v-icon
              class="pl-7"
              icon="mdi-home-outline"
            />
          </template>
        </v-list-item>
        <v-list-item
          rounded="xl"
          class="font-weight-medium"
          title="商品管理"
          to="/goods-management"
        >
          <template #prepend>
            <v-icon
              class="pl-7"
              icon="mdi-shopping-outline"
            />
          </template>
        </v-list-item>
        <v-list-item
          rounded="xl"
          class="font-weight-medium"
          title="产品管理"
          to="/product-management"
        >
          <template #prepend>
            <v-icon
              class="pl-7"
              icon="mdi-content-paste"
            />
          </template>
        </v-list-item>
        <v-list-item
          rounded="xl"
          class="font-weight-medium"
          title="热点地图"
          to="/map"
        >
          <template #prepend>
            <v-icon
              class="pl-7"
              icon="mdi-map-search-outline"
            />
          </template>
        </v-list-item>
        <v-list-item
          rounded="xl"
          class="font-weight-medium"
          title="设置"
          to="/settings"
        >
          <template #prepend>
            <v-icon
              class="pl-7"
              icon="mdi-cog-outline"
            />
          </template>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar color="primary">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-img
        :max-width="30"
        :max-height="30"
        src="/icon.png"
      ></v-img>
      <v-app-bar-title style="margin-left: 5px">商品防伪系统</v-app-bar-title>
      <v-btn @click="logout">
        退出登录
        <v-icon icon="mdi-logout-variant" class="" size="large" hover></v-icon>

      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>
