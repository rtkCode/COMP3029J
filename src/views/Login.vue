<template>
  <a-layout id="components-layout-demo-fixed">
    <Header :current="['login']"></Header>
    <a-layout-content
      :style="{ padding: '50px 50px', marginTop: '64px', minHeight: '85vh' }"
    >
      <div
        :style="{ background: '#fff', padding: '64px 32px', marginTop: '32px' }"
      >
        <a-row type="flex" justify="center" align="middle">
          <a-col span="6" :xs="20" :sm="18" :md="10" :lg="10" :xl="6">
            <a-form
              id="components-form-demo-normal-login"
              :form="form"
              class="login-form"
              @submit="handleSubmit"
            >
              <a-form-item>
                <a-input
                  v-decorator="[
                    'username',
                    {
                      rules: [
                        {
                          required: true,
                          message: 'Please input your username!',
                        },
                      ],
                    },
                  ]"
                  placeholder="Username"
                >
                  <a-icon
                    slot="prefix"
                    type="user"
                    style="color: rgba(0,0,0,.25)"
                  />
                </a-input>
              </a-form-item>
              <a-form-item>
                <a-input
                  v-decorator="[
                    'password',
                    {
                      rules: [
                        {
                          required: true,
                          message: 'Please input your Password!',
                        },
                      ],
                    },
                  ]"
                  type="password"
                  placeholder="Password"
                >
                  <a-icon
                    slot="prefix"
                    type="lock"
                    style="color: rgba(0,0,0,.25)"
                  />
                </a-input>
              </a-form-item>
              <a-form-item>
                <a-checkbox
                  v-decorator="[
                    'remember',
                    {
                      valuePropName: 'checked',
                      initialValue: true,
                    },
                  ]"
                >
                  Remember me
                </a-checkbox>
                <a class="login-form-forgot" href="">Forgot password</a>
                <a-button
                  type="primary"
                  html-type="submit"
                  class="login-form-button"
                  :loading="loading"
                  >Log in</a-button
                >
                Or
                <router-link to="/register">register now!</router-link>
              </a-form-item>
            </a-form>
          </a-col>
        </a-row>
      </div>
    </a-layout-content>
    <Footer></Footer>
  </a-layout>
</template>

<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";

export default {
  data() {
    return {
      loading: false,
    };
  },

  components: {
    Header,
    Footer,
  },

  beforeCreate() {
    this.form = this.$form.createForm(this, { name: "normal_login" });
  },

  created() {
    document.title = "Login | Zeus";
  },

  mounted() {
    this.form.setFieldsValue({
      username: this.$route.query.username,
    });
  },

  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
          this.login(values.username, values.password);
        }
      });
    },

    routeToDashboard() {
      this.$router.push({ name: "Dashboard" });
    },

    login(username, password) {
      let _this = this;
      this.loading = true;
      this.$http({
        method: "post",
        url: this.$global.request("user/signin"),
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        data: this.$qs.stringify({
          username: username,
          password: password,
        }),
      })
        .then(function(response) {
          _this.loading = false;
          // console.log(response);
          if (response.data.code == 200) {
            _this.$global.storeSession(
              "PHPSESSID=" + response.data.data.sessionId
            );
            localStorage.setItem("userId", response.data.data.id);
            _this.$message.success("Login successfully");
            setTimeout(_this.routeToDashboard, 1500);
          } else {
            _this.$message.error("Login error: " + response.data.message);
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

<style>
#components-form-demo-normal-login .login-form {
  max-width: 300px;
}
#components-form-demo-normal-login .login-form-forgot {
  float: right;
}
#components-form-demo-normal-login .login-form-button {
  width: 100%;
}
</style>
