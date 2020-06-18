<template>
  <a-layout id="components-layout-demo-fixed">
    <HeaderIn :current="['dashboard']"></HeaderIn> 
    <a-layout :style="{marginTop: '64px', minHeight: '85vh'}">
        <Sidebar :current="['l-var']" :open="['env']"></Sidebar>
        <a-layout style="padding: 0 24px 24px">
            <a-row type="flex" justify="start">
                <a-breadcrumb style="margin: 16px 0">
                <a-breadcrumb-item>Environment variable</a-breadcrumb-item>
                <a-breadcrumb-item>List variables</a-breadcrumb-item>
                </a-breadcrumb>
            </a-row>
            <a-layout-content :style="{ background: '#fff', padding: '24px', margin: 0, minHeight: '85vh' }">
                <a-row type="flex" justify="space-between">
                    <h3>Global Environment Variables</h3>
                    <a-button type="primary" icon="plus-circle" @click="showNewModal">New</a-button>
                </a-row>
                <div style="text-align: center">
                    <a-spin v-if="this.pageLoading" size="large" :style="{ marginTop: '60px' }"/>
                </div>
                <a-table v-if="!this.pageLoading" :columns="columns" :data-source="data" :style="{marginTop: '20px'}" :pagination="{defaultPageSize: 20}">
                    <span slot="customTitle">Keys</span>
                    <span slot="key" slot-scope="key"><a-tag color="blue">{{key}}</a-tag></span>
                    <span slot="value" slot-scope="value"><a-tag color="green">{{value}}</a-tag></span>
                    <span slot="comment" slot-scope="comment"><a-tag color="orange">{{comment}}</a-tag></span>
                    <span slot="action" slot-scope="key"><a @click="showDeleteConfirm(key.key)">Delete</a></span>
                </a-table>
            </a-layout-content>
            <Footer></Footer>
        </a-layout>
    </a-layout>

    <a-modal v-model="visibleNew" title="Add an environment variable " on-ok="handleOk" :footer="null">
      <a-form id="components-form-demo-normal-login" :form="form" class="login-form" @submit="handleNewSubmit">
            <a-form-item>
            <a-input
                v-decorator="[
                'key',
                { rules: [{ required: true, message: 'Please input key!' }] },
                ]"
                placeholder="Key"
            >
                <a-icon slot="prefix" type="key" style="color: rgba(0,0,0,.25)" />
            </a-input>
            </a-form-item>
            <a-form-item>
            <a-input
                v-decorator="[
                'value',
                { rules: [{ required: true, message: 'Please input value!' }] },
                ]"
                placeholder="Value"
            >
                <a-icon slot="prefix" type="number" style="color: rgba(0,0,0,.25)" />
            </a-input>
            </a-form-item>
            <a-form-item>
            <a-input
                v-decorator="[
                'comments',
                { rules: [{ required: true, message: 'Please leave some comments!' }] },
                ]"
                placeholder="Comments"
            >
                <a-icon slot="prefix" type="message" style="color: rgba(0,0,0,.25)" />
            </a-input>
            </a-form-item>
            <a-form-item>
                <a-button type="primary" html-type="submit" class="login-form-button" :loading="loading">Submit</a-button>
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
    dataIndex: 'key',
    key: 'key',
    slots: { title: 'customTitle' },
    scopedSlots: { customRender: 'key' },
  },
  {
    title: 'Values',
    dataIndex: 'value',
    key: 'value',
    scopedSlots: { customRender: 'value' },
  },
  {
    title: 'Comments',
    dataIndex: 'comment',
    key: 'comment',
    scopedSlots: { customRender: 'comment' },
  },
  {
    title: 'Action',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
];

const sample = [
  {
    key: 'key',
    value: 'value',
    comment: 'New York No. 1 Lake Park'
  },
  {
    key: 'key',
    value: 'value',
    comment: 'New York No. 1 Lake Park'
  },
  {
    key: 'key',
    value: 'value',
    comment: 'New York No. 1 Lake Park'
  },
];

export default {
    data() {
        return {
            loading: false,
            visibleNew: false,
            envList: {},
            data: [],
            columns,
            pageLoading: true
        };
    },

    components: {
        HeaderIn,
        Sidebar,
        Footer
    },

    created() {
        document.title = "Environment | Zeus";
    },

    beforeCreate() {
        this.form = this.$form.createForm(this, { name: 'normal_login' });
    },

    mounted(){
        this.getEnvList();
    },

    methods: {
        showNewModal() {
            this.visibleNew = true;
        },

        hideNewModal(){
            this.visibleNew = false;
        },

        showDeleteConfirm(key) {
            let _this=this;
            this.$confirm({
                title: 'Are you sure delete this variable?',
                content: 'This operation can not be withdrawn',
                okText: 'Yes',
                okType: 'danger',
                cancelText: 'No',
                onOk() {
                    _this.unsetEnv(key);
                },
                onCancel() {

                },
            });
        },

        handleNewSubmit(e) {
            e.preventDefault();
            this.form.validateFields((err, values) => {
                if (!err) {
                console.log('Received values of form: ', values);
                this.setEnv(values.key, values.value, values.comments);
                }
            });
        },

        getEnvList(){
            let _this=this;
            this.$http({
                method: 'get',
                url: this.$global.request("env/all"),
                headers:{
                        'Content-Type': 'application/x-www-form-urlencoded',
                        "Cookie": this.$global.getSession()
                        }
            })
            .then(function (response) {
                // console.log(response);
                _this.pageLoading=false;
                if(response.data.code==200){
                    _this.envList=response.data.data;
                    for(let k in _this.envList){
                        let o={};
                        o.key=k;
                        o.value=_this.envList[k].value;
                        o.comment=_this.envList[k].comment;
                        _this.data.push(o);
                    }
                }else{
                _this.$message.error("Loading error: "+response.data.message);
                }
            })
            .catch(function (error) {
                console.log(error);
                _this.pageLoading=false;
                _this.$message.error('Unknow error, check the console');
            });
        },

        setEnv(key, value, comment){
            let _this=this;
            this.loading=true;
            this.$http({
                method: 'post',
                url: this.$global.request("env/set"),
                headers:{
                    'Content-Type': 'application/x-www-form-urlencoded',
                    "Cookie": this.$global.getSession()
                },
                data: this.$qs.stringify({
                    key: key,
                    value: value,
                    comment: comment
                })
            })
            .then(function (response) {
                // console.log(response);
                _this.loading=false;
                if(response.data.code==200){
                    _this.hideNewModal();
                    _this.$message.success('Set successfully');
                    _this.data=[];
                    _this.getEnvList();
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

        unsetEnv(key){
            let _this=this;
            this.loading=true;
            this.$http({
                method: 'post',
                url: this.$global.request("env/unset"),
                headers:{
                    'Content-Type': 'application/x-www-form-urlencoded',
                    "Cookie": this.$global.getSession()
                },
                data: this.$qs.stringify({
                    key: key
                })
            })
            .then(function (response) {
                // console.log(response);
                _this.loading=false;
                if(response.data.code==200){
                    // _this.hideNewModal();
                    _this.$message.success('Unset successfully');
                    _this.data=[];
                    _this.getEnvList();
                }else{
                    _this.$message.error("Error: "+response.data.message);
                }
            })
            .catch(function (error) {
                console.log(error);
                _this.loading=false;
                _this.$message.error('Unknow error, check the console');
            });
        }
    },
};
</script>