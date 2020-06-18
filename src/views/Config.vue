<template>
  <a-layout id="components-layout-demo-fixed">
    <HeaderIn :current="['dashboard']"></HeaderIn>
    <a-layout :style="{ marginTop: '64px', minHeight: '85vh' }">
      <Sidebar :current="['l-config']" :open="['config']"></Sidebar>
      <a-layout style="padding: 0 24px 24px">
        <a-row type="flex" justify="start">
          <a-breadcrumb style="margin: 16px 0">
            <a-breadcrumb-item>Configuration variable</a-breadcrumb-item>
            <a-breadcrumb-item>List configs</a-breadcrumb-item>
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
            <h3>Configuration Variables</h3>
            <a-button
              type="primary"
              icon="plus-circle"
              @click="showNewModal({})"
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
            <span slot="customTitle">Keys</span>
            <span slot="key" slot-scope="key"
              ><a-tag color="blue">{{ key }}</a-tag></span
            >
            <span slot="value" slot-scope="value"
              ><a @click="showMetadata(value)">Detials</a></span
            >

            <span slot="comment" slot-scope="comment"
              ><a-tag color="orange">{{ comment }}</a-tag></span
            >
            <span slot="action" slot-scope="key, record"
              ><a @click="showDeleteConfirm(key.key)">Delete</a> |
              <a @click="showNewModal(record)">Update</a></span
            >
          </a-table>
        </a-layout-content>
        <Footer></Footer>
      </a-layout>
    </a-layout>

    <a-modal
      v-model="visibleNew"
      title="Add an environment variable "
      on-ok="handleOk"
      :footer="null"
    >
      <a-form
        id="components-form-demo-normal-login"
        :form="form"
        class="login-form"
        @submit="handleNewSubmit"
      >
        <a-form-item>
          <a-input
            v-decorator="[
              'key',
              {
                rules: [{ required: true, message: 'Please input key!' }],
                initialValue: this.currentConfig.key,
              },
            ]"
            placeholder="Key"
          >
            <a-icon slot="prefix" type="key" style="color: rgba(0,0,0,.25)" />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-textarea
            v-decorator="[
              'value',
              {
                rules: [{ required: true, message: 'Please input value!' }],
                initialValue: JSON.stringify(this.currentConfig.value),
              },
            ]"
            placeholder="Value"
            :row="4"
          >
            <a-icon
              slot="prefix"
              type="number"
              style="color: rgba(0,0,0,.25)"
            />
          </a-textarea>
        </a-form-item>
        <a-form-item>
          <a-input
            v-decorator="[
              'comments',
              {
                rules: [
                  { required: true, message: 'Please leave some comments!' },
                ],
                initialValue: this.currentConfig.comment,
              },
            ]"
            placeholder="Comments"
          >
            <a-icon
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
  </a-layout>
</template>

<script>
import HeaderIn from "@/components/HeaderIn.vue";
import Footer from "@/components/Footer.vue";
import Sidebar from "@/components/Sidebar.vue";

const columns = [
  {
    dataIndex: "key",
    key: "key",
    slots: { title: "customTitle" },
    scopedSlots: { customRender: "key" },
  },
  {
    title: "Values",
    dataIndex: "value",
    key: "value",
    scopedSlots: { customRender: "value" },
  },
  {
    title: "Comments",
    dataIndex: "comment",
    key: "comment",
    scopedSlots: { customRender: "comment" },
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
      loading: false,
      visibleNew: false,
      configList: {},
      data: [],
      columns,
      pageLoading: true,
      currentKey: null,
      currentConfig: {},
    };
  },

  components: {
    HeaderIn,
    Sidebar,
    Footer,
  },

  beforeCreate() {
    this.form = this.$form.createForm(this, { name: "normal_login" });
  },

  mounted() {
    this.getConfigList();
  },

  methods: {
    showMetadata(value) {
      console.log("value is: ", value);
      const h = this.$createElement;
      this.$info({
        title: "The Detial Value",
        okText: "Close",
        content: h("div", {}, [h("pre", JSON.stringify(value, null, 2))]),
        onOk() {},
      });
    },

    showNewModal(record) {
      this.visibleNew = true;
      this.currentConfig = JSON.parse(JSON.stringify(record));
      console.log(
        "currentConfig: ",
        JSON.parse(JSON.stringify(this.currentConfig))
      );
    },

    hideNewModal() {
      this.visibleNew = false;
    },

    showDeleteConfirm(key) {
      console.log("key is: ", key);
      let _this = this;
      this.$confirm({
        title: "Are you sure delete this variable?",
        content: "This operation can not be withdrawn",
        okText: "Yes",
        okType: "danger",
        cancelText: "No",
        onOk() {
          _this.unsetConfig(key);
        },
        onCancel() {},
      });
    },

    handleNewSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
          this.setConfig(values.key, values.value, values.comments);
        }
      });
    },

    getConfigList() {
      let _this = this;
      this.$http({
        method: "get",
        url: this.$global.request("config/all"),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Cookie: this.$global.getSession(),
        },
      })
        .then(function(response) {
          // console.log(response);
          _this.pageLoading = false;
          if (response.data.code == 200) {
            _this.configList = response.data.data;
            for (let k in _this.configList) {
              let o = {};
              o.key = k;
              o.value = _this.configList[k].value;
              o.comment = _this.configList[k].comment;
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

    setConfig(key, value, comment) {
      let _this = this;
      this.loading = true;
      this.$http({
        method: "post",
        url: this.$global.request("config/create"),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Cookie: this.$global.getSession(),
        },
        data: this.$qs.stringify({
          name: key,
          value: value,
          comment: comment,
        }),
      })
        .then(function(response) {
          // console.log(response);
          _this.loading = false;
          if (response.data.code == 200) {
            _this.hideNewModal();
            _this.$message.success("Set successfully");
            _this.data = [];
            _this.getConfigList();
          } else {
            _this.$message.error("Error: " + response.data.message);
          }
          _this.form.resetFields();
        })
        .catch(function(error) {
          console.log(error);
          _this.loading = false;
          _this.$message.error("Unknow error, check the console");
        });
    },

    unsetConfig(key) {
      let _this = this;
      this.loading = true;
      this.$http({
        method: "post",
        url: this.$global.request("config/remove"),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Cookie: this.$global.getSession(),
        },
        data: this.$qs.stringify({
          name: key,
        }),
      })
        .then(function(response) {
          // console.log(response);
          _this.loading = false;
          if (response.data.code == 200) {
            // _this.hideNewModal();
            _this.$message.success("Unset successfully");
            _this.data = [];
            _this.getConfigList();
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
