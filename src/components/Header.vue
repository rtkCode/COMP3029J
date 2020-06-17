<template>
  <div>
        <a-layout-header class="header" :style="{ position: 'fixed', zIndex: 1, width: '100%' }">
            <div class="logo">Zeus Management Platform</div>
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
  float: left;
  font-size: 20px;
  color: #ffffff;
  margin-right: 10px;
}
</style>