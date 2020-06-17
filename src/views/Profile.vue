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
              @submit="handleSubmit"
            >
              <a-form-item>
                <a-input
                  v-decorator="[
                    'username', {initialValue:this.username},
                    { rules: [{ required: true, message: 'Please input your username!' }] },
                  ]"
                  placeholder="Username"
                  default-value="this.username"
                >
                  <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />
                </a-input>
              </a-form-item>
              <a-form-item>
                <a-input
                  v-decorator="[
                    'email',{initialValue:this.email}
                  ]"
                  placeholder="Email"
                >
                  <a-icon slot="prefix" type="mail" style="color: rgba(0,0,0,.25)" />
                </a-input>
              </a-form-item>
              <a-form-item>
                <a-input
                  v-decorator="[
                    'Phone', {initialValue:this.phone}
                  ]"
                  placeholder="Phone"
                >
                  <a-icon slot="prefix" type="phone" style="color: rgba(0,0,0,.25)" />
                </a-input>
              </a-form-item>
              <a-form-item>
                <a-button type="primary" html-type="submit" class="login-form-button">Update</a-button>
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
      email: ""
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
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
          this.updateProfile(values.username, values.phone, values.email);
        }
      });
    },

    getProfile() {
      this.$http({
        method: "get",
        url: this.$global.request("user/profile"),
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
      })
        .then(function(response) {
          console.log(response);
          if (response.data.code == 200) {
            (_this.username = response.data.username),
              (_this.phone = response.data.phone),
              (_this.email = response.data.email);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    updateProfile(username, phone, email) {
      this.$http({
        method: "post",
        url: this.$global.request("user/profile"),
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        data: this.$qs.stringify({
          username: username,
          phone: phone,
          email: email
        })
      })
        .then(function(response) {
          console.log(response);
          if (response.data.code == 200) {
            this.$message.success("Update Profile Seccess");
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
