<template>
  <a-layout id="components-layout-demo-fixed">
    <HeaderIn :current="['dashboard']"></HeaderIn>
    <a-layout :style="{ marginTop: '64px', minHeight: '85vh' }">
      <Sidebar :current="['l-account']" :open="['Account']"></Sidebar>
      <a-layout style="padding: 0 24px 24px">
        <a-row type="flex" justify="start">
          <a-breadcrumb style="margin: 16px 0">
            <a-breadcrumb-item>Environment variable</a-breadcrumb-item>
            <a-breadcrumb-item>List users</a-breadcrumb-item>
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
            <h3>All User Accounts</h3>
          </a-row>
          <div style="text-align:center">
            <a-spin
              v-if="this.loading"
              size="large"
              :style="{ marginTop: '60px' }"
            />
            <a-table
              v-if="!this.loading"
              :columns="columns"
              :data-source="data"
              :style="{ marginTop: '20px' }"
              :pagination="{ defaultPageSize: 20 }"
            >
              <span slot="name" slot-scope="name">{{ name }}</span>
              <span slot="phone" slot-scope="phone">{{ phone }}</span>
              <span slot="email" slot-scope="email">{{ email }}</span>
              <span slot="time" slot-scope="time">{{ time }}</span>
              <span slot="status" slot-scope="status">
                <a-tag :color="status === 'Active' ? 'green' : 'red'">{{
                  status
                }}</a-tag>
              </span>
              <span slot="action" slot-scope="action, record">
                <a
                  @click="
                    action === 'Freeze'
                      ? freeze(record.user_id)
                      : unFreeze(record.user_id)
                  "
                  >{{ action }}</a
                >
              </span>
            </a-table>
          </div>
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

const columns = [
  {
    title: "Name",
    dataIndex: "user_name",
    key: "name",
    scopedSlots: { customRender: "name" },
  },
  {
    title: "Phone",
    dataIndex: "user_phone",
    key: "phone",
    scopedSlots: { customRender: "phone" },
  },
  {
    title: "Email",
    dataIndex: "user_email",
    key: "email",
    scopedSlots: { customRender: "email" },
  },
  {
    title: "Register Time",
    dataIndex: "user_registeredTimestamp",
    key: "time",
    scopedSlots: { customRender: "time" },
  },
  {
    title: "Status",
    dataIndex: "user_status",
    key: "status",
    scopedSlots: { customRender: "status" },
  },
  {
    title: "Action",
    dataIndex: "action",
    key: "action",
    scopedSlots: { customRender: "action" },
  },
];

export default {
  data() {
    return {
      loading: true,
      userList: {},
      data: [],
      columns,
    };
  },

  components: {
    HeaderIn,
    Sidebar,
    Footer,
  },

  mounted() {
    this.getUserList();
  },

  methods: {
    routeToLogin() {
      this.$router.push({ name: "Login" });
    },
    freeze(user_id) {
      console.log("user id is: ", user_id);
      let _this = this;
      this.$http({
        method: "post",
        url: this.$global.request("user/freeze"),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: this.$qs.stringify({
          id: user_id,
        }),
      })
        .then(function(response) {
          // console.log(response);
          if (response.data.code == 200) {
            if (user_id == localStorage.userId) {
              setTimeout(_this.routeToLogin, 1500);
            } else {
              _this.getUserList();
              _this.$message.success("Freeze Account Success");
            }
            console.log("data is: ", _this.data);
          } else {
            _this.$message.error("Loading error: " + response.data.message);
          }
        })
        .catch(function(error) {
          console.log(error);
          _this.$message.error("Unknow error, check the console");
        });
    },
    unFreeze(user_id) {
      console.log("user id is: ", user_id);
      let _this = this;
      this.$http({
        method: "post",
        url: this.$global.request("user/unfreeze"),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: this.$qs.stringify({
          id: user_id,
        }),
      })
        .then(function(response) {
          // console.log(response);
          if (response.data.code == 200) {
            _this.getUserList();
            _this.$message.success("Unfreeze Account Success");
            console.log("data is: ", _this.data);
          } else {
            _this.$message.error("Loading error: " + response.data.message);
          }
        })
        .catch(function(error) {
          console.log(error);
          _this.$message.error("Unknow error, check the console");
        });
    },

    getUserList() {
      let _this = this;
      this.$http({
        method: "get",
        url: this.$global.request("user/all"),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Cookie: this.$global.getSession(),
        },
      })
        .then(function(response) {
          // console.log(response);
          if (response.data.code == 200) {
            _this.userList = response.data.data;
            _this.data = response.data.data;
            for (let k in _this.userList) {
              if (_this.userList[k].user_status == 0) {
                _this.data[k].user_status = "Active";
                _this.data[k].action = "Freeze";
              } else {
                _this.data[k].user_status = "Inactive";
                _this.data[k].action = "Unfreeze";
              }
            }

            console.log("data is: ", _this.data);
            _this.loading = false;
          } else {
            _this.$message.error("Loading error: " + response.data.message);
          }
        })
        .catch(function(error) {
          console.log(error);
          _this.$message.error("Unknow error, check the console");
        });
    },
  },
};
</script>
