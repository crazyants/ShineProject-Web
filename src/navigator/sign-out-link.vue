<template>
  <a
    href="#"
    v-on:click.prevent="signOut"
    class="sign-out-link px-3 py-2 d-flex align-items-center"
    style="background-color: #f9f9f9;"
  >
    <i class="menu-item-icon fas fa-sign-out-alt fa-fw mr-3"/>
    <div class="flex-grow-1">
      <p class="mb-0">Sign out</p>
    </div>
  </a>
</template>

<script>
export default {
  name: "site-link",
  methods: {
    signOut() {
      window.sessionStorage.clear();
      this.$store.commit("clearStore");
      this.$router.push({ name: "features" });
    }
  }
};
</script>

<style>
.sign-out-link {
  border-top: 1px solid #f2f2f2;
  transition: all 0.1s ease-in-out;
  height: 62px;
}

.sign-out-link:hover {
  background-color: #e07a5f !important;
  color: white !important;
}
</style>