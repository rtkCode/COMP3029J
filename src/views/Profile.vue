<template>
  <a-layout id="components-layout-demo-fixed">
    <HeaderIn :current="['profile']"></HeaderIn>
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
              layout="inline"
            >
              <a-form-item>
                <span>
                  <b>User Name</b>
                  : {{ this.username }}
                </span>
              </a-form-item>
              <a-form-item>
                <span>
                  <b>Register Time</b>
                  : {{ this.registeredTimeStamp }}
                </span>
              </a-form-item>
              <a-form-item :style="{ marginTop: '24px' }">
                <a-input v-decorator="['phone']" placeholder="Phone">
                  <a-icon
                    slot="prefix"
                    type="phone"
                    style="color: rgba(0,0,0,.25)"
                  />
                </a-input>
              </a-form-item>
              <a-form-item :style="{ marginTop: '24px' }">
                <a-button type="default" @click="handleSubmit('phone')"
                  >Update</a-button
                >
              </a-form-item>
              <a-form-item>
                <a-input v-decorator="['email']" placeholder="Email">
                  <a-icon
                    slot="prefix"
                    type="mail"
                    style="color: rgba(0,0,0,.25)"
                  />
                </a-input>
              </a-form-item>
              <a-form-item>
                <a-button type="default" @click="handleSubmit('email')"
                  >Update</a-button
                >
              </a-form-item>
              <a-form-item :style="{ marginTop: '24px' }">
                <a-button ghost type="primary" @click="showNewModal()"
                  >Reset Password</a-button
                >
              </a-form-item>
              <a-form-item :style="{ marginTop: '24px' }">
                <a-button ghost type="danger" @click="showConfirm()"
                  >Freeze Account</a-button
                >
              </a-form-item>
            </a-form>
          </a-col>
        </a-row>
      </div>
    </a-layout-content>
    <Footer></Footer>
    <a-modal v-model="visibleNew" title="Reset Password " :footer="null">
      <a-form
        id="components-form-demo-normal-login"
        :form="form"
        class="login-form"
        @submit="handlePasswordSubmit"
      >
        <a-form-item label="Old Password" has-feedback>
          <a-input
            v-decorator="[
              'old',
              {
                rules: [
                  { required: true, message: 'Please input old password!' },
                ],
              },
              {
                validator: validateToNextPassword,
              },
            ]"
            type="password"
          >
            <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
          </a-input>
        </a-form-item>
        <a-form-item label="New Password" has-feedback>
          <a-input
            v-decorator="[
              'new',
              {
                rules: [
                  { required: true, message: 'Please input new password!' },
                ],
              },
              {
                validator: validateToNextPassword,
              },
            ]"
            type="password"
          >
            <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
          </a-input>
        </a-form-item>

        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            class="login-form-button"
            :loading="loading"
            >Reset</a-button
          >
        </a-form-item>
      </a-form>
    </a-modal>
  </a-layout>
</template>

<script>
import HeaderIn from "@/components/HeaderIn.vue";
import Footer from "@/components/Footer.vue";

export default {
  data() {
    return {
      loading: false,
      visibleNew: false,
      username: "",
      phone: "",
      email: "",
      registeredTimeStamp: "",
      confirmDirty: false,
    };
  },
  components: {
    HeaderIn,
    Footer,
  },

  beforeCreate() {
    this.form = this.$form.createForm(this, { name: "profile_form" });
  },
  mounted() {
    this.getProfile();
  },

  methods: {
    validateToNextPassword(rule, value, callback) {
      const form = this.form;
      if (value && this.confirmDirty) {
        form.validateFields(["confirm"], { force: true });
      }
      callback();
    },
    routeToLogin() {
      this.$router.push({ name: "Login" });
    },

    showConfirm() {
      let _this = this;
      this.$confirm({
        title: "Do you Want to freeze your account?",

        onOk() {
          _this.freeze();
        },
        onCancel() {
          console.log("Cancel");
        },
      });
    },
    handlePasswordSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
          this.reset(values.old, values.new);
        }
      });
    },
    showNewModal() {
      this.visibleNew = true;
    },

    hideNewModal() {
      this.visibleNew = false;
    },
    freeze() {
      let _this = this;
      this.$http({
        method: "post",
        url: this.$global.request("user/freeze"),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
        .then(function(response) {
          // console.log(response);
          if (response.data.code == 200) {
            _this.$message.success("Freeze Account Success");

            setTimeout(_this.routeToLogin, 1500);
          } else {
            _this.$message.error("Loading error: " + response.data.message);
          }
        })
        .catch(function(error) {
          console.log(error);
          _this.$message.error("Unknow error, check the console");
        });
    },
    reset(oldValue, newValue) {
      let _this = this;
      this.$http({
        method: "post",
        url: this.$global.request("user/reset"),
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        data: this.$qs.stringify({
          old: oldValue,
          new: newValue,
        }),
      })
        .then(function(response) {
          console.log(response);
          if (response.data.code == 200) {
            _this.$message.success("Reset Password Seccess");
            _this.hideNewModal();
          } else if (response.data.code === 400) {
            _this.$message.error("Wrong Password");
          } else {
            _this.$message.error("Error: ", response.data.message);
          }
          _this.form.setFieldsValue({
            old: "",
            new: "",
          });
        })
        .catch(function(error) {
          console.log(error);
          _this.$message.error(error);
        });
    },

    handleSubmit(type) {
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
          type === "email"
            ? this.updateProfile(type, values.email)
            : this.updateProfile(type, values.phone);
        }
      });
    },

    getProfile() {
      let _this = this;

      this.$http({
        method: "get",
        url: this.$global.request("user/profile"),
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      })
        .then(function(response) {
          console.log(response);
          if (response.data.code == 200) {
            _this.username = response.data.data.user_name;
            _this.phone = response.data.data.user_phone;
            _this.email = response.data.data.user_email;
            _this.registeredTimeStamp =
              response.data.data.user_registeredTimestamp;
            _this.setFormValue();
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },

    setFormValue() {
      this.form.setFieldsValue({
        username: this.username,
        phone: this.phone,
        email: this.email,
        registeredTimeStamp: this.registeredTimeStamp,
      });
      console.log("username is: ", this.username);
      console.log("phone is: ", this.phone);
      console.log("email is: ", this.email);
      console.log("user_registeredTimestamp is: ", this.registeredTimeStamp);
    },
    updateProfile(type, value) {
      let _this = this;
      this.$http({
        method: "post",
        url: this.$global.request("user/profile"),
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        data:
          type === "email"
            ? this.$qs.stringify({
                email: value,
              })
            : this.$qs.stringify({
                phone: value,
              }),
      })
        .then(function(response) {
          console.log(response);
          if (response.data.code == 200) {
            _this.getProfile();
            _this.$message.success("Update Profile Seccess");
          }
        })
        .catch(function(error) {
          console.log(error);
          this.$message.error(error);
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
