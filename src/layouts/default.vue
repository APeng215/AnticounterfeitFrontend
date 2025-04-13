<script>
export default {
  data() {
    return {
      drawer: true,
    }
  },
}
</script>


<template>
  <v-app>
    <v-navigation-drawer class="elevation-2" v-model="drawer">
      <v-list nav>
        <v-list-subheader>项目选择</v-list-subheader>
        <v-list-item
          rounded="xl"
          class="font-weight-medium"
          title="商品管理"
          to="/goods-management"
        >
          <template #prepend>
            <v-icon
              class="pl-7"
              icon="mdi-shopping"
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
      </v-list>
    </v-navigation-drawer>

    <v-app-bar color="primary">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-app-bar-title>商品防伪系统</v-app-bar-title>
    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>
