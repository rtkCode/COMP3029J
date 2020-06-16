<template>
  <a-layout id="components-layout-demo-fixed">
    <Header :current="['register']"></Header> 
    <a-layout-content :style="{ padding: '50px 50px', marginTop: '64px', minHeight: '85vh' }">
      <div :style="{ background: '#fff', padding: '64px 32px', marginTop: '32px' }">
        <a-row type="flex" justify="center" align="middle">
          <a-col span="6" :xs="20" :sm="20" :md="20" :lg="12" :xl="10">
            <a-form :form="form" @submit="handleSubmit">
                <a-form-item v-bind="formItemLayout" label="Username" has-feedback>
                <a-input
                    v-decorator="[
                    'username',
                    {
                        rules: [{ required: true, message: 'Please input your username!', whitespace: true }],
                    },
                    ]"
                />
                </a-form-item>
                <a-form-item v-bind="formItemLayout" label="E-mail">
                <a-input
                    v-decorator="[
                    'email',
                    {
                        rules: [
                        {
                            type: 'email',
                            message: 'The input is not valid E-mail!',
                        },
                        {
                            required: true,
                            message: 'Please input your E-mail!',
                        },
                        ],
                    },
                    ]"
                />
                </a-form-item>
                <a-form-item v-bind="formItemLayout" label="Password" has-feedback>
                <a-input
                    v-decorator="[
                    'password',
                    {
                        rules: [
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                        {
                            validator: validateToNextPassword,
                        },
                        ],
                    },
                    ]"
                    type="password"
                />
                </a-form-item>
                <a-form-item v-bind="formItemLayout" label="Confirm Password" has-feedback>
                <a-input
                    v-decorator="[
                    'confirm',
                    {
                        rules: [
                        {
                            required: true,
                            message: 'Please confirm your password!',
                        },
                        {
                            validator: compareToFirstPassword,
                        },
                        ],
                    },
                    ]"
                    type="password"
                    @blur="handleConfirmBlur"
                />
                </a-form-item>
                <a-form-item v-bind="tailFormItemLayout">
                <a-checkbox v-decorator="['agreement', { valuePropName: 'checked' }]">
                    I have read the
                    <a href="">
                    agreement
                    </a>
                </a-checkbox>
                </a-form-item>
                <a-form-item v-bind="tailFormItemLayout">
                <a-button type="primary" html-type="submit" class="login-form-button">
                  Register
                </a-button>
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

const residences = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
          },
        ],
      },
    ],
  },
];

export default {
    components: {
        Header,
        Footer
    },

  data() {
    return {
      confirmDirty: false,
      residences,
      autoCompleteResult: [],
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
      },
      tailFormItemLayout: {
        wrapperCol: {
          xs: {
            span: 24,
            offset: 0,
          },
          sm: {
            span: 16,
            offset: 8,
          },
        },
      },
    };
  },

  beforeCreate() {
    this.form = this.$form.createForm(this, { name: 'register' });
  },

  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
          this.register(values.username, values.password, values.email);
        }
      });
    },

    handleConfirmBlur(e) {
      const value = e.target.value;
      this.confirmDirty = this.confirmDirty || !!value;
    },

    compareToFirstPassword(rule, value, callback) {
      const form = this.form;
      if (value && value !== form.getFieldValue('password')) {
        callback('Two passwords that you enter is inconsistent!');
      } else {
        callback();
      }
    },

    validateToNextPassword(rule, value, callback) {
      const form = this.form;
      if (value && this.confirmDirty) {
        form.validateFields(['confirm'], { force: true });
      }
      callback();
    },

    handleWebsiteChange(value) {
      let autoCompleteResult;
      if (!value) {
        autoCompleteResult = [];
      } else {
        autoCompleteResult = ['.com', '.org', '.net'].map(domain => `${value}${domain}`);
      }
      this.autoCompleteResult = autoCompleteResult;
    },

    register(username, password, email){
      this.$http({
        method: 'post',
        url: this.$global.request("user/signup"),
        headers:{'Content-Type':'application/x-www-form-urlencoded'},
        data: this.$qs.stringify({
          username: username,
          password: password,
          email: email
        })
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
    }
  },
};
</script>

<style scoped>
#components-form-demo-normal-login .login-form-button {
  width: 100%;
}
</style>
