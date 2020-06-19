<template>
  <a-layout id="components-layout-demo-fixed">
    <HeaderIn :current="['dashboard']"></HeaderIn> 
    <a-layout :style="{marginTop: '64px', minHeight: '85vh'}">
        <Sidebar :current="['m']" :open="['overview']"></Sidebar>
        <a-layout style="padding: 0 24px 24px">
            <a-row type="flex" justify="start">
                <a-breadcrumb style="margin: 16px 0">
                <a-breadcrumb-item>Dashboard</a-breadcrumb-item>
                <a-breadcrumb-item>Overview</a-breadcrumb-item>
                </a-breadcrumb>
            </a-row>
            <a-layout-content :style="{ background: '#fff', padding: '24px', margin: 0, minHeight: '85vh' }">
              <a-row type="flex" justify="space-between">
                <a-card :loading="loading" :style="{width: '250px', marginBottom: '15px'}">
                  <a-statistic title="Active Users" :value="data.user.online" :value-style="{ color: '#3f8600' }" />
                  <a-statistic title="Registered Users" :value="data.user.total" :style="{marginTop: '10px'}" />
                  <a-divider></a-divider>
                  <router-link to="/account">User management</router-link>
                </a-card>
                <a-card :loading="loading" :style="{width: '250px', marginBottom: '15px'}">
                  <a-statistic title="Running jobs" :value-style="{ color: '#b1b100' }" :value="data.job.running" />
                  <a-statistic title="Online controllers" :style="{marginTop: '10px'}" :value="data.controller.online" :value-style="{ color: '#3f8600' }">
                    <template #suffix><span> / {{data.controller.total}}</span></template>
                  </a-statistic>
                  <a-divider></a-divider>
                  <router-link to="/config/index">Config management</router-link>
                </a-card>
                <a-card :loading="loading" :style="{width: '250px', marginBottom: '15px'}">
                  <a-statistic title="Online nodes" :value="data.node.online" :value-style="{ color: '#0073e4' }" />
                  <a-statistic title="Total nodes" :value="data.node.total" :style="{marginTop: '10px'}" />
                  <a-divider></a-divider>
                  <router-link to="/node">Node management</router-link>
                </a-card>
                <a-card :loading="loading" :style="{width: '250px', marginBottom: '15px'}">
                  <a-statistic title="Real time throughput" :value="data.bandwidth.throughput" :value-style="{ color: '#cb0001' }" />
                  <a-statistic title="Design throughput" :value="data.bandwidth.design" :style="{marginTop: '10px'}" />
                  <a-divider></a-divider>
                  <router-link to="/cluster">Cluster management</router-link>
                </a-card>
              </a-row>
              <a-row type="flex" justify="space-between">
                <a-col span="16">
                  <a-card :loading="loading" title="Number of online users and running jobs in the past 7 days" :style="{marginTop: '15px'}">
                    <div id="c1"></div>
                  </a-card>
                </a-col>
                <a-col span="7">
                  <a-card :loading="loading" title="Nodes in use" :style="{marginTop: '15px'}">
                    <div id="c2"></div>
                  </a-card>
                </a-col>
              </a-row>
            </a-layout-content>
            <Footer></Footer>
        </a-layout>
    </a-layout>
  </a-layout>
</template>

<script>
import HeaderIn from "@/components/HeaderIn.vue";
import Footer from "@/components/Footer.vue";
import Sidebar from "@/components/Sidebar.vue";

import { StackedColumn } from '@antv/g2plot';
import { Liquid } from '@antv/g2plot';

export default {
  data(){
    return{
      loading: true,
      data: {},
    }
  },

  components: {
    HeaderIn,
    Sidebar,
    Footer
  },

  created() {
    document.title = "Dashboard | Zeus";
  },

  updated(){
    let data=[];
    let userBase=this.data.user.online;
    let jobBase=this.data.job.running;

    for(let i=0;i<7;i++){
      let u={};
      let j={};
      u.date=i;
      u.value=Math.floor(userBase*(Math.random()*(1-0.4)+0.4));
      u.type="Online users";
      j.date=i;
      j.value=Math.floor(jobBase*(Math.random()*(1-0.4)+0.4));
      j.type="Running jobs";
      if(i==6){
        u.value=userBase;
        j.value=jobBase;
      }
      data.push(u);
      data.push(j);
    }

    const columnPlot = new StackedColumn(document.getElementById('c1'), {
      title: {
        visible: false,
        text: 'Number of online users and running jobs in the past 7 days',
      },
      forceFit: true,
      data,
      padding: 'auto',
      data,
      xField: 'date',
      yField: 'value',
      yAxis: {
        min: 0,
      },
      color: ['#f27957', '#1a6179'],
      stackField: 'type',
    });

    columnPlot.render();

    let online=this.data.node.online;
    let total=this.data.node.total;

    const liquidPlot = new Liquid(document.getElementById('c2'), {
      title: {
        visible: false,
        text: '水波图',
      },
      description: {
        visible: false,
        text: '水波图 - 百分比显示',
      },
      min: 0,
      max: total,
      value: online,
      statistic: {
        formatter: (value) => ((100 * value) / total).toFixed(1) + '%',
      },
    });

    liquidPlot.render();
  },

  mounted(){
    this.getStatus();
  },

  methods: {
    getStatus(){
      let _this=this;
      this.$http({
          method: 'get',
          url: this.$global.request("dashboard/stats"),
          headers:{
              'Content-Type': 'application/x-www-form-urlencoded',
              "Cookie": this.$global.getSession()
          }
      })
      .then(function (response) {
          console.log(response);
          _this.loading=false;
          if(response.data.code==200){
              _this.data=response.data.data;
          }else{
              _this.$message.error("Error: "+response.data.message);
          }
      })
      .catch(function (error) {
          console.log(error);
          _this.loading=false;
          _this.$message.error('Unknow error, check the console');
      });
    },

  },
};
</script>

