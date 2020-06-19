<template>
  <a-layout id="components-layout-demo-fixed">
    <HeaderIn :current="['dashboard']"></HeaderIn> 
    <a-layout :style="{marginTop: '64px', minHeight: '85vh'}">
        <Sidebar :current="['l-cluster']" :open="['cluster']"></Sidebar>
        <a-layout style="padding: 0 24px 24px">
            <a-row type="flex" justify="start">
                <a-breadcrumb style="margin: 16px 0">
                <a-breadcrumb-item>Cluster</a-breadcrumb-item>
                <a-breadcrumb-item>List clusters</a-breadcrumb-item>
                </a-breadcrumb>
            </a-row>
            <a-layout-content :style="{ background: '#fff', padding: '24px', margin: 0, minHeight: '85vh' }">
                <a-row type="flex" justify="space-between">
                    <h3>All clusters</h3>
                    <a-button type="primary" icon="plus-circle" @click="showNewModal">New</a-button>
                </a-row>
                <div style="text-align: center">
                    <a-spin v-if="this.pageLoading" size="large" :style="{ marginTop: '60px' }"/>
                </div>
                <a-table v-if="!this.pageLoading" :columns="columns" :data-source="data" :style="{marginTop: '20px'}" :pagination="{defaultPageSize: 20}">
                    <span slot="customTitle">Id</span>
                    <span slot="metadata" slot-scope="id"><a @click="showMetadata(id.alias, id.metadata)">Metadata</a></span>
                    <span slot="node" slot-scope="id">
                        <a @click="showAssignModal(id.id)">Assign</a>
                    </span>
                    <span slot="action" slot-scope="id">
                        <a @click="showUpdateModal(id.id)">Update</a> | 
                        <a @click="showDeleteConfirm(id.id)">Delete</a>
                    </span>
                </a-table>
            </a-layout-content>
            <Footer></Footer>
        </a-layout>
    </a-layout>

    <a-modal v-model="visibleNew" title="Add a cluster " on-ok="handleOk" :footer="null">
      <a-form id="components-form-demo-normal-login" :form="form" class="login-form" @submit="handleNewSubmit">
            <a-form-item>
                <a-input
                    v-decorator="[
                    'alias',
                    { rules: [{ required: true, message: 'Please input alias!' }] },
                    ]"
                    placeholder="Alias"
                ><a-icon slot="prefix" type="form" style="color: rgba(0,0,0,.25)" />
                </a-input>
            </a-form-item>
            <a-form-item>
                <a-textarea 
                    v-decorator="[
                    'metadata',
                    { rules: [{ required: true, message: 'Please input metadata!' }] },
                    ]"
                    placeholder="Metadata" :auto-size="{ minRows: 5}">
                </a-textarea>
            </a-form-item>
            <a-form-item>
                <a-input
                    v-decorator="[
                    'comments',
                    { rules: [{ required: true, message: 'Please leave some comments!' }] },
                    ]"
                    placeholder="Comments"
                ><a-icon slot="prefix" type="message" style="color: rgba(0,0,0,.25)" />
                </a-input>
            </a-form-item>
            <a-form-item>
                <a-button type="primary" html-type="submit" class="login-form-button" :loading="loading">Submit</a-button>
            </a-form-item>
        </a-form>
    </a-modal>

    <a-modal v-model="visibleUpdate" :title="'Update cluster (id: '+id+')'" on-ok="handleOk" :footer="null">
      <a-form id="components-form-demo-normal-login" :form="form" class="login-form" @submit="handleUpdateSubmit">
            <a-form-item>
                <a-input
                    v-decorator="[
                    'alias',
                    { rules: [{ required: true, message: 'Please input alias!' }] },
                    ]"
                    placeholder="Alias"
                ><a-icon slot="prefix" type="form" style="color: rgba(0,0,0,.25)" />
                </a-input>
            </a-form-item>
            <a-form-item>
                <a-textarea 
                    v-decorator="[
                    'metadata',
                    { rules: [{ required: true, message: 'Please input metadata!' }] },
                    ]"
                    placeholder="Metadata" :auto-size="{ minRows: 5}">
                </a-textarea>
            </a-form-item>
            <a-form-item>
                <a-input
                    v-decorator="[
                    'comments',
                    { rules: [{ required: true, message: 'Please leave some comments!' }] },
                    ]"
                    placeholder="Comments"
                ><a-icon slot="prefix" type="message" style="color: rgba(0,0,0,.25)" />
                </a-input>
            </a-form-item>
            <a-form-item>
                <a-button type="primary" html-type="submit" class="login-form-button" :loading="loading">Update</a-button>
            </a-form-item>
        </a-form>
    </a-modal>

    <a-modal v-model="visibleAssign" :title="'Assign nodes to cluster (id: '+id+')'" on-ok="handleOk">
        <template slot="footer">
            <a-button key="back" @click="hideAssignModal">Cancel</a-button>
            <a-button key="submit" type="primary" :loading="loading" @click="assignNodes(id)">Assign</a-button>
        </template>
        <a-select mode="multiple" style="width: 100%" placeholder="Please select nodes from the list" @change="handleChange">
            <a-select-option v-for="i in nodes" :key="i.node_uuid">{{ i.node_alias+" (Current cluster: "+i.node_cluster+")" }}</a-select-option>
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
    dataIndex: 'id',
    key: 'id',
    slots: { title: 'customTitle' },
    scopedSlots: { customRender: 'id' },
  },
  {
    title: 'Alias',
    dataIndex: 'alias',
    key: 'alias',
    scopedSlots: { customRender: 'alias' },
  },
  {
    title: 'Comments',
    dataIndex: 'comment',
    key: 'comment',
    scopedSlots: { customRender: 'comment' },
  },
  {
    title: 'Metadata',
    key: 'metadata',
    scopedSlots: { customRender: 'metadata' },
  },
  {
    title: 'Nodes',
    key: 'node',
    scopedSlots: { customRender: 'node' },
  },
  {
    title: 'Action',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
];

export default {
    data() {
        return {
            id: -1,
            loading: false,
            visibleNew: false,
            visibleUpdate: false,
            visibleAssign: false,
            clusterList: {},
            data: [],
            columns,
            pageLoading: true,
            nodes: [],
            selectedNodes: [],
        };
    },

    components: {
        HeaderIn,
        Sidebar,
        Footer
    },

    created() {
        document.title = "Cluster | Zeus";
    },

    beforeCreate() {
        this.form = this.$form.createForm(this, { name: 'normal_login' });
    },

    mounted(){
        this.getClusterList();
    },

    methods: {
        handleChange(value) {
            // console.log(value);
            this.selectedNodes=value;
        },

        showNewModal() {
            this.visibleNew = true;
        },

        hideNewModal(){
            this.visibleNew = false;
        },

        showUpdateModal(id) {
            this.id=id;
            this.visibleUpdate = true;
        },

        hideUpdateModal(){
            this.visibleUpdate = false;
        },

        showAssignModal(id) {
            this.id=id;
            this.getNodes();
            this.visibleAssign = true;
        },

        hideAssignModal(){
            this.visibleAssign = false;
        },

        showDeleteConfirm(id) {
            let _this=this;
            this.$confirm({
                title: 'Are you sure delete this cluster?',
                content: 'This operation can not be withdrawn',
                okText: 'Yes',
                okType: 'danger',
                cancelText: 'No',
                onOk() {
                    _this.removeCluster(id);
                },
                onCancel() {

                },
            });
        },

        showMetadata(alias, metadata){
            const h = this.$createElement;
            this.$info({
                title: 'The metadata of '+alias,
                okText: 'Close',
                content: h('div', {}, [
                h('pre', JSON.stringify(metadata, null, 2)),
                ]),
                onOk() {

                },
            });
        },

        handleNewSubmit(e) {
            e.preventDefault();
            this.form.validateFields((err, values) => {
                if (!err) {
                console.log('Received values of form: ', values);
                this.createCluster(values.alias, values.metadata, values.comments);
                }
            });
        },

        handleUpdateSubmit(e) {
            e.preventDefault();
            this.form.validateFields((err, values) => {
                if (!err) {
                console.log('Received values of update form: ', values);
                this.updateCluster(values.alias, values.metadata, values.comments);
                }
            });
        },

        getClusterList(){
            let _this=this;
            this.$http({
                method: 'get',
                url: this.$global.request("cluster/all"),
                headers:{
                        'Content-Type': 'application/x-www-form-urlencoded',
                        "Cookie": this.$global.getSession()
                        }
            })
            .then(function (response) {
                // console.log(response);
                _this.pageLoading=false;
                if(response.data.code==200){
                    _this.clusterList=response.data.data;
                    for(let k in _this.clusterList){
                        let o={};
                        o.id=_this.clusterList[k]["cluster_id"];
                        o.key=_this.clusterList[k]["cluster_id"];
                        o.alias=_this.clusterList[k]["cluster_alias"];
                        o.comment=_this.clusterList[k]["cluster_comment"];
                        o.metadata=_this.clusterList[k]["cluster_metadata"];
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

        createCluster(alias, metadata, comment){
            let _this=this;
            this.loading=true;
            this.$http({
                method: 'post',
                url: this.$global.request("cluster/create"),
                headers:{
                    'Content-Type': 'application/x-www-form-urlencoded',
                    "Cookie": this.$global.getSession()
                },
                data: this.$qs.stringify({
                    alias: alias,
                    metadata: metadata,
                    comment: comment
                })
            })
            .then(function (response) {
                // console.log(response);
                _this.loading=false;
                if(response.data.code==200){
                    _this.hideNewModal();
                    _this.$message.success('Create successfully');
                    _this.data=[];
                    _this.getClusterList();
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

        updateCluster(alias, metadata, comment){
            let _this=this;
            this.loading=true;
            this.$http({
                method: 'post',
                url: this.$global.request("cluster/update"),
                headers:{
                    'Content-Type': 'application/x-www-form-urlencoded',
                    "Cookie": this.$global.getSession()
                },
                data: this.$qs.stringify({
                    id: this.id,
                    alias: alias,
                    metadata: metadata,
                    comment: comment
                })
            })
            .then(function (response) {
                // console.log(response);
                _this.loading=false;
                if(response.data.code==200){
                    _this.hideUpdateModal();
                    _this.$message.success('Update successfully');
                    _this.data=[];
                    _this.getClusterList();
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

        removeCluster(id){
            let _this=this;
            this.loading=true;
            this.$http({
                method: 'post',
                url: this.$global.request("cluster/remove"),
                headers:{
                    'Content-Type': 'application/x-www-form-urlencoded',
                    "Cookie": this.$global.getSession()
                },
                data: this.$qs.stringify({
                    id: id
                })
            })
            .then(function (response) {
                // console.log(response);
                _this.loading=false;
                if(response.data.code==200){
                    _this.$message.success('Remove successfully');
                    _this.data=[];
                    _this.getClusterList();
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

        assignNodes(id){
            let _this=this;
            this.loading=true;
            this.$http({
                method: 'post',
                url: this.$global.request("cluster/assign"),
                headers:{
                    'Content-Type': 'application/x-www-form-urlencoded',
                    "Cookie": this.$global.getSession()
                },
                data: this.$qs.stringify({
                    cluster_id: id,
                    node_uuid: JSON.stringify(this.selectedNodes)
                })
            })
            .then(function (response) {
                console.log(response);
                _this.loading=false;
                if(response.data.code==200){
                    _this.$message.success('Assign successfully');
                    _this.hideAssignModal();
                    _this.data=[];
                    _this.getClusterList();
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

        getNodes(){
            let _this=this;
            this.$http({
                method: 'get',
                url: this.$global.request("node/list"),
                headers:{
                    'Content-Type': 'application/x-www-form-urlencoded',
                    "Cookie": this.$global.getSession()
                }
            })
            .then(function (response) {
                // console.log(response);
                if(response.data.code==200){
                    _this.nodes=response.data.data;
                }else{
                    _this.$message.error("Error: "+response.data.message);
                }
            })
            .catch(function (error) {
                console.log(error);
                _this.$message.error('Unknow error, check the console');
            });
        },
    },
};
</script>