<template>
  <div>
        <a-layout-header class="header" :style="{ position: 'fixed', zIndex: 1, width: '100%' }">
            <div class="logo">Zeus Management Platform</div>
            <a-menu v-model="current" theme="dark" mode="horizontal" :style="{ lineHeight: '64px' }">
                <a-menu-item key="dashboard" :style="{float: 'left'}"><router-link to="/dashboard">Dashboard</router-link></a-menu-item>
                <a-menu-item key="logout" :style="{float: 'right'}" @click="logout()">Logout</a-menu-item>
                <a-menu-item key="profile" :style="{float: 'right'}"><router-link to="/profile">Profile</router-link></a-menu-item>
            </a-menu>
        </a-layout-header>
  </div>
</template>

<script>
export default {
    props: {
        current: Array
    },

    methods: {
        logout(){
            this.$http({
            method: 'post',
            url: this.$global.request("user/signout"),
            headers:{'Content-Type':'application/x-www-form-urlencoded'},
            data: this.$qs.stringify({
                logout: true
                })
            })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
        }
    }
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