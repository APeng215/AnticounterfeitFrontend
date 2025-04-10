<script>
export default {
  data() {
    return {
      drawer: true,
      tabNavs: [
        {
          title: "sa",
          value: "sa",
        }
      ],
      currentTab: null,
    }
  },
  methods: {
    navigateTab(tab) {
      this.currentTab = tab;
    }
  }
}
</script>

<template>
  <v-app>
    <v-navigation-drawer v-model="drawer">
      <v-list nav :items="tabNavs">
        <v-list-item title="商品管理" @click="navigateTab('a')" />
      </v-list>

    </v-navigation-drawer>

    <v-app-bar color="primary">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-app-bar-title>商品防伪系统</v-app-bar-title>
    </v-app-bar>

    <v-main>
      <component :is="currentTab"/>
    </v-main>
  </v-app>
</template>


