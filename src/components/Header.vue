<template>
  <div>
        <a-layout-header class="header" breakpoint="lg"
      collapsed-width="0"
      @collapse="onCollapse"
      @breakpoint="onBreakpoint" :style="{ position: 'fixed', zIndex: 1, width: '100%' }">
            <div class="logo" />
            <a-menu v-model="current" theme="dark" mode="horizontal" :style="{ lineHeight: '64px' }">
                <a-menu-item key="dashboard" :style="{float: 'left'}"><router-link to="/dashboard">Dashboard</router-link></a-menu-item>
                <a-menu-item key="register" :style="{float: 'right'}"><router-link to="/register">Register</router-link></a-menu-item>
                <a-menu-item key="login" :style="{float: 'right'}"><router-link to="/login">Login</router-link></a-menu-item>
            </a-menu>
        </a-layout-header>
  </div>
</template>

<script>
export default {
    props: {
        current: Array
    },
};
</script>

<style scoped>
#components-layout-demo-fixed .logo {
  width: 120px;
  height: 31px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px 24px 16px 0;
  float: left;
}
</style>