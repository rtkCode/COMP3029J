<template>
<div class="body">
  <div class="container">
    <div class="content">
        <div class="title1">Zeus</div>
        <div class="title2"><small>A high scalability MEC Management Platform</small></div>
        <a-button :size="'large'" type="primary" @click="route()" :loading="loading" ghost>Enter platform</a-button>
    </div>
  </div>
</div>
</template>

<script>
export default {
    data(){
        return{
            loading: false
        }
    },

    created() {
        document.title = "Zeus MEC Management Platform";
    },

    methods:{
        route(){
            this.loading=true;
            this.$router.push({ name: "Dashboard" });
        }
    }
}
</script>

<style scoped>
.body {
    width: 100%;
    height: 100vh;
    color: #B0BEC5;
    display: table;
    font-weight: 100;
    font-family: 'Lato';
}

.container {
    width: 100%;
    text-align: center;
    display: table-cell;
    vertical-align: middle;

}

.content {
    width: 100%;
    text-align: center;
    display: inline-block;
}

.title1 {
    font-size: 72px;
}

.title2 {
    font-size: 48px;
    margin-bottom: 20px;
}
</style>
