<template>
  <a-layout id="components-layout-demo-fixed">
    <HeaderIn :current="['dashboard']"></HeaderIn>
    <a-layout :style="{ marginTop: '64px', minHeight: '85vh' }">
      <Sidebar :current="['l-node']" :open="['node']"></Sidebar>
      <a-layout style="padding: 0 24px 24px">
        <a-row type="flex" justify="start">
          <a-breadcrumb style="margin: 16px 0">
            <a-breadcrumb-item>Node</a-breadcrumb-item>
            <a-breadcrumb-item>List nodes</a-breadcrumb-item>
          </a-breadcrumb>
        </a-row>
        <a-layout-content
          :style="{
            background: '#fff',
            padding: '24px',
            margin: 0,
            minHeight: '85vh',
          }"
        >
          <a-row type="flex" justify="space-between">
            <h3>All nodes</h3>
            <a-button type="primary" icon="plus-circle" @click="showModal(null)"
              >New</a-button
            >
          </a-row>
          <div style="text-align: center">
            <a-spin
              v-if="this.pageLoading"
              size="large"
              :style="{ marginTop: '60px' }"
            />
          </div>
          <a-table
            v-if="!this.pageLoading"
            :columns="columns"
            :data-source="data"
            :style="{ marginTop: '20px' }"
            :pagination="{ defaultPageSize: 20 }"
          >
            <span slot="customTitle">Id</span>
            <span slot="metadata" slot-scope="id"
              ><a @click="getNode(id.alias, id.id)">Metadata</a></span
            >

            <span slot="action" slot-scope="id">
              <a @click="showModal(id)">Update</a> |
              <a @click="showDeleteConfirm(id.id)">Delete</a> |
              <a @click="showAssignModal(id.id)">Assign</a>
            </span>
          </a-table>
        </a-layout-content>
        <Footer></Footer>
      </a-layout>
    </a-layout>

    <a-modal
      v-model="visibleNew"
      :title="this.currentNode ? 'Update node' : 'Create new node'"
      on-ok="handleOk"
      :footer="null"
    >
      <a-form
        id="components-form-demo-normal-login"
        :form="form"
        class="login-form"
        @submit="handleSubmit"
      >
        <a-form-item>
          <a-input
            v-decorator="[
              'alias',
              {
                rules: [{ required: true, message: 'Please input alias!' }],
                initialValue: this.currentNode ? this.currentNode.alias : null,
              },
            ]"
            placeholder="Alias"
            ><a-icon slot="prefix" type="form" style="color: rgba(0,0,0,.25)" />
          </a-input>
        </a-form-item>

        <a-form-item label="Role">
          <a-radio-group
            v-decorator="[
              'role',
              {
                initialValue: this.currentNode
                  ? this.currentNode.role == 'Compute Node'
                    ? '0'
                    : '1'
                  : '0',
              },
            ]"
          >
            <a-radio value="0">
              Compute Node
            </a-radio>
            <a-radio value="1">
              Control Node
            </a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="Cluster">
          <a-select
            v-decorator="[
              'cluster',
              {
                rules: [
                  { required: true, message: 'Please select a cluster!' },
                ],
                initialValue: this.currentNode ? this.currentNode.cluster : 1,
              },
            ]"
            placeholder="Please select a cluster"
          >
            <a-select-option
              v-for="item in this.clusterList"
              :vlaue="item.cluster_id"
              :key="item.cluster_id"
              >{{ item.cluster_alias }}</a-select-option
            >
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-textarea
            v-decorator="[
              'metadata',
              {
                initialValue: this.currentMetadata
                  ? JSON.stringify(this.currentMetadata)
                  : null,
              },
            ]"
            placeholder="Metadata"
            :auto-size="{ minRows: 5 }"
          >
          </a-textarea>
        </a-form-item>
        <a-form-item>
          <a-input
            v-decorator="[
              'comments',
              {
                initialValue: this.currentNode
                  ? this.currentNode.comment
                  : null,
              },
            ]"
            placeholder="Comments"
            ><a-icon
              slot="prefix"
              type="message"
              style="color: rgba(0,0,0,.25)"
            />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            class="login-form-button"
            :loading="loading"
            >Submit</a-button
          >
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal
      v-model="visibleAssign"
      :title="'Assign nodes to cluster (id: ' + id + ')'"
      on-ok="handleOk"
    >
      <template slot="footer">
        <a-button key="back" @click="hideAssignModal">Cancel</a-button>
        <a-button
          key="submit"
          type="primary"
          :loading="loading"
          @click="assignCluster(id)"
          >Assign</a-button
        >
      </template>
      <a-select
        style="width: 100%"
        placeholder="Please select nodes from the list"
        @change="handleChange"
      >
        <a-select-option v-for="i in this.clusterList" :key="i.cluster_id">{{
          i.cluster_alias
        }}</a-select-option>
      </a-select>
    </a-modal>
  </a-layout>
</template>

<script>
import HeaderIn from "@/components/HeaderIn.vue";
import Footer from "@/components/Footer.vue";
import Sidebar from "@/components/Sidebar.vue";

const columns = [
  {
    title: "Node ID",
    dataIndex: "id",
    key: "id",
    slots: { title: "customTitle" },
    scopedSlots: { customRender: "id" },
  },

  {
    title: "Alias",
    dataIndex: "alias",
    key: "alias",
    scopedSlots: { customRender: "alias" },
  },
  {
    title: "Role",
    dataIndex: "role",
    key: "role",
    scopedSlots: { customRender: "role" },
  },
  {
    title: "Cluster",
    dataIndex: "cluster",
    key: "cluster",
    scopedSlots: { customRender: "cluster" },
  },
  {
    title: "Comments",
    dataIndex: "comment",
    key: "comment",
    scopedSlots: { customRender: "comment" },
  },
  {
    title: "Metadata",
    key: "metadata",
    scopedSlots: { customRender: "metadata" },
  },

  {
    title: "Action",
    key: "action",
    scopedSlots: { customRender: "action" },
  },
];

export default {
  data() {
    return {
      id: -1,
      loading: false,
      visibleNew: false,
      visibleUpdate: false,
      nodeList: {},
      data: [],
      columns,
      pageLoading: true,
      currentMetadata: null,
      currentNode: null,
      clusterList: [],
      visibleAssign: false,
      selectedCluster: null,
    };
  },

  components: {
    HeaderIn,
    Sidebar,
    Footer,
  },

  created() {
    document.title = "Node | Zeus";
  },

  beforeCreate() {
    this.form = this.$form.createForm(this, { name: "normal_login" });
  },

  mounted() {
    this.getNodeList();
    this.getClusterList();
  },

  methods: {
    handleChange(value) {
      // console.log(value);
      this.selectedCluster = value;
    },
    showAssignModal(id) {
      this.id = id;

      this.visibleAssign = true;
    },

    hideAssignModal() {
      this.visibleAssign = false;
    },

    assignCluster(id) {
      let _this = this;
      this.loading = true;
      this.$http({
        method: "post",
        url: this.$global.request("node/assign"),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Cookie: this.$global.getSession(),
        },
        data: this.$qs.stringify({
          cluster_id: JSON.stringify(this.selectedCluster),
          node_uuid: id,
        }),
      })
        .then(function(response) {
          console.log(response);
          _this.loading = false;
          if (response.data.code == 200) {
            _this.$message.success("Assign successfully");
            _this.hideAssignModal();
            _this.data = [];
            _this.getNodeList();
          } else {
            _this.$message.error("Error: " + response.data.message);
          }
        })
        .catch(function(error) {
          console.log(error);
          _this.loading = false;
          _this.$message.error("Unknow error, check the console");
        });
    },

    showModal(node) {
      this.visibleNew = true;
      this.currentMetadata = null;
      this.currentNode = JSON.parse(JSON.stringify(node));
      console.log("currentNode： ", this.currentNode);
      if (node) {
        this.getNode(null, this.currentNode.id);
      }
    },

    hideModal() {
      this.visibleNew = false;
      this.currentNode = null;
    },

    getClusterList() {
      let _this = this;
      this.$http({
        method: "get",
        url: this.$global.request("cluster/all"),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Cookie: this.$global.getSession(),
        },
      })
        .then(function(response) {
          // console.log(response);
          _this.pageLoading = false;
          if (response.data.code == 200) {
            _this.clusterList = response.data.data;
          } else {
            _this.$message.error("Loading error: " + response.data.message);
          }
        })
        .catch(function(error) {
          console.log(error);
          _this.pageLoading = false;
          _this.$message.error("Unknow error, check the console");
        });
    },

    showDeleteConfirm(id) {
      let _this = this;
      this.$confirm({
        title: "Are you sure delete this node?",
        content: "This operation can not be withdrawn",
        okText: "Yes",
        okType: "danger",
        cancelText: "No",
        onOk() {
          _this.removeNode(id);
        },
        onCancel() {},
      });
    },

    showMetadata(alias) {
      let _this = this;

      const h = _this.$createElement;
      console.log("_this.currentMetadata: ", _this.currentMetadata);
      _this.$info({
        title: "The metadata of " + alias,
        okText: "Close",
        content: h("div", {}, [
          h("pre", JSON.stringify(_this.currentMetadata, null, 2)),
        ]),
        width: 800,
        onOk() {
          //_this.currentMetadata = {};
        },
      });
    },

    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
          if (this.currentNode) {
            this.updateNode(
              values.alias,
              values.cluster,
              values.role,
              values.metadata,
              values.comments
            );
          } else {
            this.createNode(
              values.alias,
              values.cluster,
              values.role,
              values.metadata,
              values.comments
            );
          }
        }
      });
    },

    getNodeList() {
      let _this = this;
      this.$http({
        method: "get",
        url: this.$global.request("node/list"),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Cookie: this.$global.getSession(),
        },
      })
        .then(function(response) {
          // console.log(response);
          _this.pageLoading = false;
          if (response.data.code == 200) {
            _this.nodeList = response.data.data;
            for (let k in _this.nodeList) {
              let o = {};
              o.id = _this.nodeList[k]["node_uuid"];
              o.key = _this.nodeList[k]["node_uuid"];
              o.alias = _this.nodeList[k]["node_alias"];
              o.cluster = _this.nodeList[k]["node_cluster"];
              o.role =
                _this.nodeList[k]["node_role"] == 0
                  ? "Compute Node"
                  : "Control Node";
              o.comment = _this.nodeList[k]["node_comment"];
              _this.data.push(o);
            }
          } else {
            _this.$message.error("Loading error: " + response.data.message);
          }
        })
        .catch(function(error) {
          console.log(error);
          _this.pageLoading = false;
          _this.$message.error("Unknow error, check the console");
        });
    },

    getNode(alias, id) {
      let _this = this;
      this.$http({
        method: "post",
        url: this.$global.request("node/get"),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Cookie: this.$global.getSession(),
        },
        data: this.$qs.stringify({
          uuid: id,
        }),
      })
        .then(function(response) {
          _this.pageLoading = false;
          if (response.data.code == 200) {
            _this.currentMetadata = response.data.data.node_metadata;
            if (alias) {
              //not clikced update
              _this.showMetadata(alias);
            }
          } else {
            _this.$message.error("Loading error: " + response.data.message);
          }
        })
        .catch(function(error) {
          console.log(error);
          _this.pageLoading = false;
          _this.$message.error("Unknow error, check the console");
        });
    },

    createNode(alias, cluster, role, metadata, comment) {
      let _this = this;
      this.loading = true;
      this.$http({
        method: "post",
        url: this.$global.request("node/create"),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Cookie: this.$global.getSession(),
        },
        data: this.$qs.stringify({
          alias: alias,
          cluster: cluster,
          role: role,
          metadata: metadata,
          comment: comment,
        }),
      })
        .then(function(response) {
          // console.log(response);
          _this.loading = false;
          if (response.data.code == 200) {
            _this.hideModal();
            _this.$message.success("Create successfully");
            _this.data = [];
            _this.getNodeList();
          } else {
            _this.$message.error("Error: " + response.data.message);
          }
          _this.currentNode = null;
        })
        .catch(function(error) {
          console.log(error);
          _this.loading = false;
          _this.$message.error("Unknow error, check the console");
        });
    },

    updateNode(alias, cluster, role, metadata, comment) {
      console.log("updateNode: this.currentNode.id is ", this.currentNode.id);
      let _this = this;
      this.loading = true;
      this.$http({
        method: "post",
        url: this.$global.request("node/update"),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Cookie: this.$global.getSession(),
        },
        data: this.$qs.stringify({
          uuid: this.currentNode.id,
          alias: alias,
          cluster: cluster,
          role: role,
          metadata: metadata,
          comment: comment,
        }),
      })
        .then(function(response) {
          // console.log(response);
          _this.loading = false;
          if (response.data.code == 200) {
            _this.hideModal();
            _this.$message.success("Update successfully");
            _this.data = [];
            _this.getNodeList();
          } else {
            _this.$message.error("Error: " + response.data.message);
          }

          _this.currentNode = null;
        })
        .catch(function(error) {
          console.log(error);
          _this.loading = false;
          _this.$message.error("Unknow error, check the console");
        });
    },

    removeNode(id) {
      let _this = this;
      this.loading = true;
      this.$http({
        method: "post",
        url: this.$global.request("node/remove"),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Cookie: this.$global.getSession(),
        },
        data: this.$qs.stringify({
          uuid: id,
        }),
      })
        .then(function(response) {
          // console.log(response);
          _this.loading = false;
          if (response.data.code == 200) {
            _this.$message.success("Remove successfully");
            _this.data = [];
            _this.getNodeList();
          } else {
            _this.$message.error("Error: " + response.data.message);
          }
        })
        .catch(function(error) {
          console.log(error);
          _this.loading = false;
          _this.$message.error("Unknow error, check the console");
        });
    },
  },
};
</script>
