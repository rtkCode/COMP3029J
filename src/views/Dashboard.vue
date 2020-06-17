<template>
  <a-layout id="components-layout-demo-fixed">
    <HeaderIn :current="['dashboard']"></HeaderIn> 
    <a-layout :style="{marginTop: '64px', minHeight: '85vh'}">
        <Sidebar :current="['2']" :open="['overview']"></Sidebar>
        <a-layout style="padding: 0 24px 24px">
            <a-row type="flex" justify="start">
                <a-breadcrumb style="margin: 16px 0">
                <a-breadcrumb-item>Dashboard</a-breadcrumb-item>
                <a-breadcrumb-item>Overview</a-breadcrumb-item>
                </a-breadcrumb>
            </a-row>
            <a-layout-content :style="{ background: '#fff', padding: '24px', margin: 0, minHeight: '280px' }">
                Content
            </a-layout-content>
        </a-layout>
    </a-layout>
    <Footer></Footer>
  </a-layout>
</template>

<script>
import HeaderIn from "@/components/HeaderIn.vue";
import Footer from "@/components/Footer.vue";
import Sidebar from "@/components/Sidebar.vue";

export default {
  components: {
    HeaderIn,
    Sidebar,
    Footer
  },

  methods: {

  },
};
</script>

<style>

</style>
