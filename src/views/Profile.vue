<template>
  <a-layout id="components-layout-demo-fixed">
    <HeaderIn :current="['profile']"></HeaderIn>
    <a-layout-content :style="{ padding: '50px 50px', marginTop: '64px', minHeight: '85vh' }">
      <div :style="{ background: '#fff', padding: '64px 32px', marginTop: '32px' }">
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
                  : {{this.username}}
                </span>
              </a-form-item>
              <a-form-item>
                <span>
                  <b>Register Time</b>
                  : {{this.registeredTimeStamp}}
                </span>
              </a-form-item>
              <a-form-item>
                <a-input
                  v-decorator="[
                    'phone'
                  ]"
                  placeholder="Phone"
                >
                  <a-icon slot="prefix" type="phone" style="color: rgba(0,0,0,.25)" />
                </a-input>
              </a-form-item>
              <a-form-item>
                <a-button type="default" @click="handleSubmit('phone')">Update</a-button>
              </a-form-item>
              <a-form-item>
                <a-input
                  v-decorator="[
                    'email'
                  ]"
                  placeholder="Email"
                >
                  <a-icon slot="prefix" type="mail" style="color: rgba(0,0,0,.25)" />
                </a-input>
              </a-form-item>
              <a-form-item>
                <a-button type="default" @click="handleSubmit('email')">Update</a-button>
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
import HeaderIn from "@/components/HeaderIn.vue";
import Footer from "@/components/Footer.vue";

export default {
  data() {
    return {
      username: "",
      phone: "",
      email: "",
      registeredTimeStamp: ""
    };
  },
  components: {
    HeaderIn,
    Footer
  },

  beforeCreate() {
    this.form = this.$form.createForm(this, { name: "profile_form" });
  },
  mounted() {
    this.getProfile();
  },

  methods: {
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
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
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
        registeredTimeStamp: this.registeredTimeStamp
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
                email: value
              })
            : this.$qs.stringify({
                phone: value
              })
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
    }
  }
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
