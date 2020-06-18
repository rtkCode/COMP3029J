<template>
  <div>
        <a-layout-header class="header" :style="{ position: 'fixed', zIndex: 1, width: '100%' }">
            <div class="logo">Zeus Management Platform</div>
            <a-menu v-model="current" theme="dark" mode="horizontal" :style="{ lineHeight: '64px' }">
                <a-menu-item key="dashboard" :style="{float: 'left'}"><router-link to="/dashboard">Dashboard</router-link></a-menu-item>
                <a-menu-item key="logout" :style="{float: 'right'}" @click="logout()">Logout</a-menu-item>
                <a-menu-item key="profile" :style="{float: 'right'}" :loading="loading"><router-link to="/profile">Profile</router-link></a-menu-item>
            </a-menu>
        </a-layout-header>
  </div>
</template>

<script>
export default {
    data(){
        return{
            loading: false,
        }
    },

    props: {
        current: Array
    },

    methods: {
        routeToLogin(){
            this.$router.push({name: 'Login'});
        },

        logout(){
            let _this=this;
            this.loading=true;
            this.$http({
                method: 'get',
                url: this.$global.request("user/signout"),
                headers:{
                    'Content-Type': 'application/x-www-form-urlencoded',
                    "Cookie": this.$global.getSession()
                    }
            })
            .then(function (response) {
                // console.log(response);
                _this.loading=false;
                if(response.data.code==200){
                    
                }else{
                    _this.$message.error("Logout error: "+response.data.message);
                }
            })
            .catch(function (error) {
                console.log(error);
                _this.loading=false;
                _this.$message.error('Unknow error, check the console');
            });
            this.$global.removeSession();
            this.$message.success('Logout successfully');
            setTimeout(_this.routeToLogin,2000);
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