<template>
  <loading-container id="app" :is-loading="isLoading">
    <sidebar v-if="!isProductPage" :is-anonymous="!token"/>
    <router-view id="route-page" v-bind:class="{'full-width': isProductPage}"/>
    <add-list v-if="token"/>
  </loading-container>
</template>

<script>
import "@/branding/product-branding.css";
import sidebar from "@/navigator/sidebar.vue";
import addList from "@/features/lists/add-list";

export default {
  name: "app",
  components: {
    sidebar,
    addList
  },
  data() {
    return {
      isLoading: true,
      isProductPage: false,
      token: null
    };
  },
  watch: {
    "$route.name"() {
      this.isLoading = true;
      this.initialiseAuthentication();
      this.identifyProductPage();
    }
  },
  mounted() {
    this.initialiseAuthentication();
    this.identifyProductPage();
  },
  methods: {
    identifyProductPage() {
      this.isProductPage = this.$route.name === "features";
    },
    initialiseAuthentication() {
      this.token = window.sessionStorage.token;

      if (
        !this.token &&
        this.$route.path !== "/" &&
        !this.$route.path.includes("welcome")
      ) {
        this.$router.push({ name: "sign-in" });
      } else {
        this.isLoading = false;
      }
    }
  }
};
</script>

<style>
#route-page {
  float: right;
  width: calc(100% - 375px);
}

#route-page.full-width {
  width: 100% !important;
}

/* iPad Landscape */
@media (max-width: 1024px) {
  #route-page {
    width: calc(100% - 300px);
  }
}

/* iPad Portrait */
@media (max-width: 768px) {
  #route-page {
    width: 100%;
  }
}
</style>