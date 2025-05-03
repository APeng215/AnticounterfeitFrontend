<script>
import FetchHelper from "@/components/FetchHelper.js";

export default {
  data() {
    return {
      username: "",
      password: "",
    }
  },
  computed: {
    FetchHelper() {
      return FetchHelper
    },
    isSubmitActive() {
      return !this.username || !this.password;
    }
  }
}
</script>

<template>
  <v-app-bar color="primary">
    <v-img
      class="ml-8"
      :max-height="30"
      :max-width="30"
      src="/icon.png"
    ></v-img>
    <v-app-bar-title style="margin-left: 5px">商品防伪系统</v-app-bar-title>
  </v-app-bar>
  <div
    class="d-flex justify-center align-center"
    style="height: 100vh;"
  >
    <v-card elevation="5" width="300">
      <div class="d-flex justify-center"><v-img
        class="my-2"
        :max-height="40"
        :max-width="40"
        src="/icon.png"
      ></v-img></div>
      <v-divider></v-divider>
      <v-form
        class="ma-4"
        fast-fail
        @submit.prevent="FetchHelper.formLogin(username, password)"
      >
        <v-text-field
          v-model="username"
          label="用户名"
          name="username"
          required
        ></v-text-field>

        <v-text-field
          v-model="password"
          label="密码"
          name="password"
          required
        ></v-text-field>
        <div class="d-flex justify-center">
          <v-btn
            :disabled="isSubmitActive"
            text="登录"
            type="submit"
            color="success"
          ></v-btn>
        </div>
      </v-form>
    </v-card>
  </div>

</template>

<route lang="yaml">
meta:
  layout: background
</route>

<style scoped>

</style>


