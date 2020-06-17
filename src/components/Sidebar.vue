<template>
  <a-layout-sider width="230" style="background: #fff; padding-top: 10px">
    <a-menu
      v-model="current"
      mode="inline"
      :default-selected-keys="['1']"
      :default-open-keys="open"
      :style="{ height: '100%', borderRight: 0}"
    >
      <a-sub-menu key="overview">
        <span slot="title">
          <a-icon type="dashboard" />Overview
        </span>
        <a-menu-item key="1">option1</a-menu-item>
        <a-menu-item key="2">option2</a-menu-item>
      </a-sub-menu>

      <a-sub-menu key="cluster">
        <span slot="title">
          <a-icon type="cloud-server" />Cluster
        </span>
        <a-menu-item key="l-cluster">List clusters</a-menu-item>
        <a-menu-item key="c-cluster">Create cluster</a-menu-item>
        <a-menu-item key="u-cluster">Update cluster</a-menu-item>
        <a-menu-item key="a-cluster">Assign cluster</a-menu-item>
      </a-sub-menu>

      <a-sub-menu key="node">
        <span slot="title">
          <a-icon type="laptop" />Node
        </span>
        <a-menu-item key="l-node">List nodes</a-menu-item>
        <a-menu-item key="c-node">Create node</a-menu-item>
        <a-menu-item key="r-node">Remote node</a-menu-item>
        <a-menu-item key="u-node">Update node</a-menu-item>
        <a-menu-item key="a-node">Assign node</a-menu-item>
      </a-sub-menu>

      <a-sub-menu key="config">
        <span slot="title">
          <a-icon type="setting" />Config
        </span>
        <a-menu-item key="l-config">List configs</a-menu-item>
        <a-menu-item key="c-config">Create config</a-menu-item>
        <a-menu-item key="r-config">Remote config</a-menu-item>
        <a-menu-item key="u-config">Update config</a-menu-item>
      </a-sub-menu>

      <a-sub-menu key="env">
        <span slot="title">
          <a-icon type="global" />Env variables
        </span>
        <a-menu-item key="l-var">
          <router-link to="/env">List variables</router-link>
        </a-menu-item>
      </a-sub-menu>

      <a-sub-menu key="Account">
        <span slot="title">
          <a-icon type="user" />User Accounts
        </span>
        <a-menu-item key="l-account">
          <router-link to="/account">List users</router-link>
        </a-menu-item>
      </a-sub-menu>
    </a-menu>
  </a-layout-sider>
</template>

<script>
export default {
  props: {
    current: Array,
    open: Array
  }
};
</script>