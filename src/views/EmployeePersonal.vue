<template>
  <div>
    <HeaderIf :hospital="hospital" ref="header"></HeaderIf>
    <div class="content">

      <div class="dashboard-bg d-flex align-items-start flex-column p-4 shadow-lg">
        <h1 class="text-left text-white mt-auto mx-xl-4">{{$t("string.personal.ED")}}<br/>
          <small><small>{{name}}</small></small>
          <svg type="button" data-target="#exampleModal" data-toggle="modal" t="1587899208338" class="icon ml-2" viewBox="0 0 1026 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2046" width="18" height="18"><path d="M307.933767 709.191401l55.608246-121.906912 70.215853 67.788777-125.824099 54.118135z m95.818675-171.645022l366.409348-352.874171 82.001279 80.116062-365.732025 352.095249-82.678602-79.33714z m550.042994-370.90226l-50.505744 48.372175-81.854525-80.116062 49.704244-47.593254c8.003704-7.958549 23.435387-6.513593 32.150281 2.144858l48.281866 46.182162c5.147657 5.03477 8.071436 11.559652 8.071436 18.039379 0.011289 5.046059-2.201301 9.36964-5.847558 12.970742zM313.792614 530.299019c-0.745056 0.767633-1.467534 1.478823-2.21259 2.889913L259.640613 717.217683c-2.923779 10.78073 0 22.340381 8.071436 30.310219 6.581325 5.779826 14.607607 9.290618 23.390233 9.290619 2.935068 0 5.113791-0.699901 8.03757-1.399802l190.147239-49.749399h0.79021a8.048859 8.048859 0 0 0 5.791115-2.178724l507.721574-489.208069c15.28493-14.40441 23.356366-33.888744 23.356367-55.551803 0-24.519105-10.927483-49.03821-29.215214-67.077588l-48.281865-46.182163c-19.010208-18.039378-43.935707-28.853974-69.572396-28.853974-22.577445 0-43.145497 7.935972-57.707948 23.074149L314.503803 528.109007c-0.71119 0.699901-0.71119 1.478823-0.711189 2.190012zM100.932466 0C45.358086 0 0 44.70334 0 99.555242V923.530372c0 54.806747 45.358086 99.555242 100.932466 99.555241h806.082505c55.57438 0 100.864734-44.748495 100.864734-99.555241V397.543645h-86.290994v451.729511c0 49.049498-40.221718 87.939147-89.214772 87.939147H175.539632c-49.004344 0-89.214772-38.889648-89.214773-87.939147V173.157711c0-48.338309 40.210429-88.040745 89.214773-88.040745h457.904443V0H100.932466z" fill="#ffffff" p-id="2047"></path></svg>
        </h1>
        <RModel @hintTitle="getHintTitle" @hintText="getHintText" @messageFailure="getMessageFailure"></RModel>
        <UModel @hintTitle="getHintTitle" @hintText="getHintText" @messageFailure="getMessageFailure"></UModel>
        <div class="d-flex flex-wrap status-cards mx-xl-4">
          <div class="d-flex justify-content-around flex-column card border-radius10 status-card p-3 mr-4 mb-4 border-0 shadow">
            <span class="h2 m-0">{{allNum}}</span>
            <small>{{$t("string.dashboard.AA")}}</small>
          </div>
          <div class="d-flex justify-content-around flex-column card border-radius10 status-card p-3 mr-4 mb-4 border-0 shadow">
            <span class="h2 m-0 text-secondary">{{accNun}}</span>
            <small>{{$t("string.personal.accepted")}}</small>
          </div>
          <div class="d-flex justify-content-around flex-column card-hide card border-radius10 status-card p-3 mr-4 mb-4 border-0 shadow">
            <span class="h2 m-0 text-info">{{opeNum}}</span>
            <small>{{$t("string.personal.operating")}}</small>
          </div>
          <div class="d-flex justify-content-around flex-column card-hide card border-radius10 status-card p-3 border-0 shadow">
            <span class="h2 m-0 text-success">{{docNum}}</span>
            <small>{{$t("string.dashboard.DOC")}}</small>
          </div>
        </div>
      </div>

      <!-- placeholder -->
      <div class="mt-5 pt-5"></div>

      <div class="col-12 d-flex flex-wrap">
        <div class="col-lg-5 col-sm-12 shadow my-4 mx-lg-4 mx-sm-0 border-radius10">
          <h5 class="text-left mx-4 my-4 p-1 d-flex justify-content-between">{{$t("string.personal.AP")}} ({{appointments_others.length}})
            <button type="button" class="btn btn-sm rounded-lg border-0 dropdown-toggle" data-toggle="collapse" data-target="#filterCollapse">
              {{$t("string.personal.filter")}}
            </button>     
          </h5>

          <div class="collapse" id="filterCollapse">
            <div class="px-4 py-2 mx-2">
              <h6 class="text-left ml-1">{{$t("string.dashboard.priority")}}</h6>
              <div class="d-flex flex-wrap">
                <button class="btn btn-sm btn-outline-info button-c px-2 m-2" v-for="(sta,index) in priorities" :key="index" :class="{checked:index==p}" @click="changePriority(index)">{{sta}}</button>
              </div>
            </div>

            <div class="px-4 py-2 mx-2">
              <h6 class="text-left ml-1">{{$t("string.discussion.order")}}</h6>
              <div class="d-flex flex-wrap">
                <button class="btn btn-sm btn-outline-info button-c p-2 m-2" v-for="(sta,index) in orders" :key="index" :class="{checked:index==o}" @click="changeOrder(index)">{{sta}}</button>
              </div>
            </div>

            <hr class="mx-4 px-1"/>

            <div class="px-4 py-2 mx-2">
              <div class="d-flex flex-wrap">
                <a class="btn btn-sm btn-success button-c p-2 m-2" data-toggle="collapse" href="#filterCollapse" aria-expanded="false" aria-controls="filterCollapse" @click="getAppointments(selectedOrder,selectedPriority)">{{$t("string.button.confirm")}}</a>
                <a class="btn btn-sm btn-outline-danger button-c p-2 m-2" data-toggle="collapse" href="#filterCollapse" aria-expanded="false" aria-controls="filterCollapse">{{$t("string.button.cancel")}}</a>
              </div>
            </div>
          </div>

          <div v-for="(a,index) in appointments_others" :key="index">
            <div class="d-flex justify-content-around mx-2 my-3 p-2 rounded-lg" :class="{'bg-light-red': a.emergency}">
              <span class="d-flex align-items-center badge badge-pill" :class="[a.status=='Waiting'?'badge-secondary':'', a.status=='Processing'?'badge-info':'', a.status=='Operating'?'badge-primary':'', a.status=='Discharged'?'badge-success':'', a.status=='Canceled'?'badge-danger':'', a.status=='Completed'?'badge-success':'']">{{a.status}}</span>
              <span>{{a.id}}</span><span class="hide-sm">{{a.type}}</span><span class="hide-sm">{{a.date}}</span>
              <a class="text-info" data-toggle="collapse" :href="'#a'+index" role="button" aria-expanded="false" :aria-controls="index">{{$t("string.dashboard.details")}}</a>
              <div class="dropleft">
                <button class="btn btn-outline-info badge badge-info button-gradient p-1 dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{{$t("string.dashboard.operation")}}</button>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  <button class="dropdown-item" @click="updatePriorityId(a.id)" data-toggle="modal" data-target="#modalPriority">{{$t("string.dashboard.SP")}}</button>
                  <div class="dropdown-divider"></div>
                  <button class="dropdown-item" @click="updateOperationId(a.id)" data-toggle="modal" data-target="#modal3">{{$t("string.personal.COD")}}</button>
                  <button class="dropdown-item" @click="updateStatus(a.id, 'Operating')">{{$t("string.personal.DAO")}}</button>
                  <div class="dropdown-divider"></div>
                  <button class="dropdown-item text-success" @click="updateDischargeId(a.id)" data-toggle="modal" data-target="#modal3">{{$t("string.personal.CDD")}}</button>
                  <button class="dropdown-item text-success" @click="updateStatus(a.id, 'Discharged')">{{$t("string.personal.ETO")}}</button>
                  <div class="dropdown-divider"></div>
                  <button type="button" class="dropdown-item text-danger" @click="updateDeleteId(a.id)" data-toggle="modal" data-target="#modal2">
                    {{$t("string.personal.CTA")}}
                  </button>
                </div>
              </div>
            </div>
            <table class="table table-borderless card card-body collapse mx-3 mx-md-5 col-11" :id="'a'+index">
              <tbody>
                <tr>
                  <td>{{$t("string.dashboard.priority")}}: <span class="text-secondary">{{$global.priority(a.priority)}}</span></td>
                  <td>{{$t("string.dashboard.attendingDoctor")}}<span class="text-secondary">{{a.attendingDoctor}}</span></td>
                </tr>
                <tr>
                  <td>{{$t("string.dashboard.status")}}<span class="text-secondary">{{a.status}}</span></td>
                  <td>{{$t("string.dashboard.emergency")}}<span class="text-secondary">{{a.emergency}}</span></td>
                </tr>
                <tr>
                  <td>{{$t("string.dashboard.appointmentDate")}}<span class="text-secondary">{{a.date}}</span></td>
                  <td>{{$t("string.dashboard.location")}}<span class="text-secondary">{{a.location}}</span></td>
                </tr>
                <tr>
                  <td>{{$t("string.dashboard.symptom")}}<span class="text-secondary">{{a.symptom}}</span></td>
                  <td>{{$t("string.dashboard.type")}}<span class="text-secondary">{{a.type}}</span></td>
                </tr>
                <tr>
                  <td>{{$t("string.dashboard.customerNote")}}<span class="text-secondary">{{a.message}}</span></td>
                </tr>
                <tr>
                  <td>{{$t("string.dashboard.operationDate")}}<span class="text-secondary">{{a.operationTime}}</span></td>
                  <td>{{$t("string.dashboard.dischargeDate")}}<span class="text-secondary">{{a.dischargeDate}}</span></td>
                </tr>

                <a class="text-left" data-toggle="collapse" :href="'#d'+a.id" @click="loadDiscussion(a.id)">
                  <svg t="1587111515032" class="icon mb-1 mr-1" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2472" width="20" height="20"><path d="M808.533333 397.866667v-2.133334c0-157.866667-167.466667-286.933333-372.266666-286.933333S64 236.8 64 395.733333c0 88.533333 51.2 169.6 140.8 225.066667l24.533333 183.466667 152.533334-124.8c18.133333 2.133333 36.266667 3.2 54.4 3.2h2.133333c45.866667 72.533333 140.8 119.466667 246.4 119.466666h16l148.266667 112 11.733333-162.133333c62.933333-40.533333 98.133333-99.2 98.133333-163.2 1.066667-82.133333-57.6-154.666667-150.4-190.933333zM378.666667 635.733333l-9.6-1.066666-107.733334 88.533333-17.066666-129.066667-9.6-5.333333c-82.133333-46.933333-128-117.333333-128-193.066667 0-134.4 148.266667-244.266667 329.6-244.266666s329.6 109.866667 329.6 244.266666C765.866667 530.133333 617.6 640 436.266667 640c-19.2 0-38.4-2.133333-57.6-4.266667z m452.266666 85.333334l-9.6 5.333333-8.533333 105.6-98.133333-74.666667-7.466667 1.066667c-7.466667 0-14.933333 1.066667-21.333333 1.066667-81.066667 0-153.6-29.866667-196.266667-78.933334 160-18.133333 288-114.133333 314.666667-237.866666 69.333333 29.866667 113.066667 85.333333 113.066666 146.133333 0 51.2-32 99.2-86.4 132.266667z" p-id="2473" fill="#8a8a8a"></path><path d="M245.333333 317.866667h373.333334v42.666666H245.333333zM245.333333 434.133333h373.333334v42.666667H245.333333z" p-id="2474" fill="#8a8a8a"></path></svg>
                  {{$t("string.discussion.DWC")}}
                </a>

              </tbody>
            </table>
          </div>
        </div>

        <div class="col-lg-5 col-sm-12 shadow my-4 mx-lg-4 mx-sm-0 border-radius10">
          <h5 class="text-left mx-4 my-4 p-1">{{$t("string.personal.CP")}} ({{appointments_completed.length}})</h5>
          <div v-for="(a,index) in appointments_completed" :key="index">
            <div class="d-flex justify-content-around mx-2 my-3 p-2 rounded-lg" :class="{'bg-light-red': a.emergency}">
              <span class="d-flex align-items-center badge badge-pill" :class="[a.status=='Waiting'?'badge-secondary':'', a.status=='Processing'?'badge-info':'', a.status=='Operating'?'badge-primary':'', a.status=='Discharged'?'badge-success':'', a.status=='Canceled'?'badge-danger':'', a.status=='Completed'?'badge-success':'']">{{a.status}}</span>
              <span>{{a.id}}</span><span class="hide-sm">{{a.type}}</span><span class="hide-sm">{{a.date}}</span>
              <a class="text-info" data-toggle="collapse" :href="'#a2'+index" role="button" aria-expanded="false" :aria-controls="index">{{$t("string.dashboard.details")}}</a>
              <div class="dropleft">
                <button class="btn btn-outline-info badge badge-info p-1 dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" disabled>{{$t("string.dashboard.operation")}}</button>
              </div>
            </div>
            <table class="table table-borderless card card-body collapse mx-3 mx-md-5 col-11" :id="'a2'+index">
              <tbody>
                <tr>
                  <td>{{$t("string.dashboard.status")}}<span class="text-secondary">{{a.status}}</span></td>
                  <td>{{$t("string.dashboard.emergency")}}<span class="text-secondary">{{a.emergency}}</span></td>
                </tr>
                <tr>
                  <td>{{$t("string.dashboard.appointmentDate")}}<span class="text-secondary">{{a.date}}</span></td>
                  <td>{{$t("string.dashboard.location")}}<span class="text-secondary">{{a.location}}</span></td>
                </tr>
                <tr>
                  <td>{{$t("string.dashboard.symptom")}}<span class="text-secondary">{{a.symptom}}</span></td>
                  <td>{{$t("string.dashboard.type")}}<span class="text-secondary">{{a.type}}</span></td>
                </tr>
                <tr>
                  <td>{{$t("string.dashboard.customerNote")}}<span class="text-secondary">{{a.message}}</span></td>
                </tr>
                <tr>
                  <td>{{$t("string.dashboard.operationDate")}}<span class="text-secondary">{{a.operationTime}}</span></td>
                  <td>{{$t("string.dashboard.attendingDoctor")}}<span class="text-secondary">{{a.attendingDoctor}}</span></td>
                </tr>
                <tr>
                  <td>{{$t("string.dashboard.dischargeDate")}}<span class="text-secondary">{{a.dischargeDate}}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="modal2" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">{{$t("string.button.confirm")}}</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    {{$t("string.dashboard.CHint")}} 
                    <span class="badge badge-pill badge-secondary">Waiting</span> only
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">{{$t("string.button.close")}}</button>
                    <button type="button" class="btn btn-danger" data-dismiss="modal" @click="updateStatus(deleteId, 'Canceled')"
                        v-show="showButton">{{$t("string.button.confirm")}}</button>
                    <button class="btn btn-danger" type="button" v-show="!showButton" disabled>
                        <span class="spinner-border spinner-border-sm mb-1" role="status" aria-hidden="true"></span>
                        {{$t("string.user.loading")}}
                    </button>
                </div>
            </div>
        </div>
    </div>
    <div class="modal fade" id="modal3" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
              <h5 class="modal-title">Choose {{operationText}} date</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
              </button>
          </div>
          <div class="modal-body">
              <calendar
                ref="calendar1"
                :value="calendar1.value" 
                :begin="calendar1.begin" 
                :end="calendar1.end" 
                :weeks="calendar1.weeks" 
                :months="calendar1.months" 
                @select="calendar1.select"
                @selectMonth="calendar1.selectMonth"
                @selectYear="calendar1.selectYear">
            </calendar>
          </div>
          <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">{{$t("string.button.close")}}</button>
              <button type="button" class="btn btn-info" @click="updateDate()"
                  v-show="showButton">{{$t("string.button.confirm")}}</button>
              <button class="btn btn-info" type="button" v-show="!showButton" disabled>
                  <span class="spinner-border spinner-border-sm mb-1" role="status" aria-hidden="true"></span>
                  {{$t("string.user.loading")}}
              </button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal fade" id="modalPriority" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
              <h5 class="modal-title">{{$t("string.dashboard.SP")}}</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
              </button>
          </div>
          <div class="modal-footer">
              <button type="button" class="btn btn-danger" data-dismiss="modal" @click="updatePriority(3)" v-show="showButton">Very urgent</button>
              <button type="button" class="btn btn-warning" data-dismiss="modal" @click="updatePriority(2)" v-show="showButton">Urgent</button>
              <button type="button" class="btn btn-info" data-dismiss="modal" @click="updatePriority(1)" v-show="showButton">Important</button>
              <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="updatePriority(0)" v-show="showButton">Normal</button>
              <button class="btn btn-info" type="button" v-show="!showButton" disabled>
                  <span class="spinner-border spinner-border-sm mb-1" role="status" aria-hidden="true"></span>
                  {{$t("string.user.loading")}}
              </button>
          </div>
        </div>
      </div>
    </div>
    <Message :hintTitle="hintTitle" :hintText="hintText" :failure="messageFailure"></Message>
    <Footer :hospital="hospital"></Footer>
    <DModel :key="timer" :discussionId="discussionId" :showModal="showModal" :employee="true"></DModel>
  </div>
</template>

<script>
import HeaderIf from "@/components/HeaderIf.vue";
import Footer from "@/components/Footer.vue";
import Message from '@/components/Message.vue';
import calendar from '@/components/Calender.vue';
import UModel from "@/components/UpdateProfileModel.vue";
import DModel from "@/components/DiscussionModel.vue";
import RModel from "@/components/ResetPasswordModel.vue";

export default {
  data() {
    return {
      appointments: [],
      appointments_completed: [],
      appointments_others: [],
      hintTitle: "",
      hintText: "",
      messageFailure: false,
      showButton: true,
      deleteId: -1,
      operationId: -1,
      operationDate: "",
      operationText: "operation",
      allNum: 0,
      accNun: 0,
      opeNum: 0,
      docNum: 0,
      name: "",
      timer: "",
      discussionId: -1,
      showModal: false,
      priorityId: -1,

      calendar1:{
        value:[2017,7,20],
        weeks:['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        months:['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        select(value){
            let month=value[1];
            if(value[1]<10) month="0"+value[1]
            let day=value[2];
            if(value[2]<10) day="0"+value[2]
            let d=new Date();
            d.$soodd(value[0]+"-"+month+"-"+day)
        },
        selectMonth(month,year){},
        selectYear(year){},
        timestamp:Date.now()
      },

      i: 0,
      n: 0,
      username: "",
      id: "",
      job: "",
      sex: "",
      salary: "",
      age: "",
      phoneNumber: "",

      p: 0,
      o: 0,
      selectedOrder: "normal",
      orders: ["normal", "date", "priority"],
      selectedPriority: "all",
      priorities: ["all", "Very urgent", "Urgent", "Important", "Normal"],

    };
  },

  components: {
    HeaderIf,
    Footer,
    Message,
    calendar,
    UModel,
    DModel,
    RModel,
  },

  props: {
    hospital: String
  },

  created() {
    document.title = this.$t("string.personal.pPanel") + " | " + this.hospital;
  },

  mounted() {
    this.$global.resizeContent();
    this.getAppointments("normal","all");
    this.getProfile();
    this.calendar1.value=this.getToday();
    this.operationDate=this.getToday();
    let _this=this;
    Date.prototype.$soodd=function(date){
      _this.operationDate=date;
    }
  },

  methods: {
    changeOrder(index) {
      this.o = index;
      this.selectedOrder=this.orders[index];
    },

    changePriority(index) {
      this.p = index;
      this.selectedPriority=this.priorities[index];
    },

    loadDiscussion(id){
      this.showModal=true;
      this.discussionId=id;
      this.timer = new Date().getTime();
    },

    getHintTitle(data){
      this.hintTitle=data;
    },

    getHintText(data){
      this.hintText=data;
    },

    getMessageFailure(data){
      this.messageFailure=data;
    },

    getToday(){
      let day = new Date();
      day.setTime(day.getTime());
      let dayList=[];
      dayList.push(day.getFullYear());
      dayList.push(day.getMonth()+1);
      dayList.push(day.getDate());
      return dayList
    },

    updateDeleteId(id){
      this.deleteId=id;
    }, 

    updateOperationId(id){
      this.operationId=id;
      this.operationText="operation";
    }, 

    updateDischargeId(id){
      this.operationId=id;
      this.operationText="discharge";
    },

    handleAppointments(appointments){
      for(let i=0;i<appointments.length;i++){
        if(appointments[i].status=="Operating"){
          this.opeNum++;
        }else if(appointments[i].status=="Discharged"||appointments[i].status=="Completed"){
          this.docNum++;
        }

        if(appointments[i].status=="Completed"||appointments[i].status=="Canceled"){
          this.appointments_completed.push(appointments[i]);
        }else{
          this.accNun++;
          this.appointments_others.push(appointments[i]);
        }
      }
      this.allNum=appointments.length;
    },

    getAppointments(sequence, priority) {
      let _this = this;
      this.showButton=false;
      this.appointments=[];
      this.appointments_completed=[];
      this.appointments_others=[];
      this.accNun=0;
      this.opeNum=0;
      this.allNum=0;
      this.docNum=0;

      this.$axios({
          method: 'get',
          url: this.$global.request("employeeAppointments/"+sequence+"/"+priority),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            "Authorization": "bearer " + this.$token.getToken(1)
          },
          data: this.$qs.stringify({
            token: this.$token.getToken(0),
          })
        })
        .then(function (response) {
          _this.showButton=true;
          if (response.data.code == 200) {
            _this.appointments = response.data.data.appointments.reverse();
            _this.handleAppointments(_this.appointments);
          }
          if (response.data.code == 400) {
            $('.toast').toast('show');
            _this.messageFailure=true;
            _this.hintTitle=_this.$t("string.user.unknowError");
            _this.hintText=response.data.msg+_this.$t("string.user.unknowErrorHint");
          }
        })
        .catch(function (error) {
          _this.showButton=true;
          console.log(error);
          if(!error.response==undefined){
          if (error.response.status == 401) {
            _this.$token.removeToken();
            _this.$router.push({
              name: 'EmployeeLogIn',
              query: {
                message: _this.$t("string.appointment.loginExpired"),
                from: "/employee/personal"
              }
            });
          } }else {
            $('.toast').toast('show');
            console.log(error);
            _this.messageFailure=true;
            _this.hintTitle=_this.$t("string.user.unknowError");
            _this.hintText=response.data.msg+_this.$t("string.user.unknowErrorHint");
          }
        });
    },

    getProfile() {
      let _this = this;

      this.$axios({
          method: 'get',
          url: this.$global.request("profile"),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            "Authorization": "bearer " + this.$token.getToken(1)
          },
          data: this.$qs.stringify({
            token: this.$token.getToken(0),
          })
        })
        .then(function (response) {
          if (response.data.code == 200) {
            // _this.username = response.data.data.basic.username;
            // _this.email = response.data.data.basic.email;
            _this.name = response.data.data.basic.firstName + " " +response.data.data.basic.lastName;
          }
          if (response.data.code == 400) {
            $('.toast').toast('show');
            _this.messageFailure=true;
            _this.hintTitle=_this.$t("string.user.unknowError");
            _this.hintText=response.data.msg+_this.$t("string.user.unknowErrorHint");
          }
        })
        .catch(function (error) {
          if(!error.response==undefined){
          if (error.response.status == 401) {
            _this.$token.removeToken();
            _this.$router.push({
              name: 'EmployeeLogIn',
              query: {
                message: _this.$t("string.appointment.loginExpired"),
                from: "/employee/personal"
              }
            });
          } }else {
            $('.toast').toast('show');
            console.log(error);
            _this.messageFailure=true;
            _this.hintTitle=_this.$t("string.user.unknowError");
            _this.hintText=response.data.msg+_this.$t("string.user.unknowErrorHint");
          }
        });
    },

    updateStatus(id, status){
      let _this = this;
      this.showButton=false;
      this.$axios({
          method: 'put',
          url: this.$global.request("updateAppointment"),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            "Authorization": "bearer " + this.$token.getToken(1)
          },
          data: this.$qs.stringify({
            id: id,
            token: this.$token.getToken(0),
            status: status
          })
        })
        .then(function (response) {
          _this.showButton=true;
          if (response.data.code == 200) {
            $('.toast').toast('show');
            _this.messageFailure=false;
            _this.hintTitle="Success";
            _this.hintText="operation success";
            _this.getAppointments("normal","all");
          }
          if (response.data.code == 400) {
            $('.toast').toast('show');
            _this.messageFailure=true;
            _this.hintTitle="Handle failed";
            _this.hintText=response.data.msg+_this.$t("string.user.unknowErrorHint");
          }
        })
        .catch(function (error) {
          _this.showButton=true;
          if(!error.response==undefined){
          if (error.response.status == 401) {
            _this.$token.removeToken();
            _this.$router.push({
              name: 'EmployeeLogIn',
              query: {
                message: _this.$t("string.appointment.loginExpired"),
                from: "/employee/personal"
              }
            });
          } }else {
            $('.toast').toast('show');
            console.log(error);
            _this.messageFailure=true;
            _this.hintTitle=_this.$t("string.user.unknowError");
            _this.hintText=response.data.msg+_this.$t("string.user.unknowErrorHint");
          }
        });
    },

    updatePriorityId(id){
      this.priorityId=id;
    }, 

    updatePriority(p){
      let _this = this;
      this.showButton=false;
      this.$axios({
          method: 'put',
          url: this.$global.request("updatePriority"),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            "Authorization": "bearer " + this.$token.getToken(1)
          },
          data: this.$qs.stringify({
            id: this.priorityId,
            token: this.$token.getToken(0),
            priority: p
          })
        })
        .then(function (response) {
          _this.showButton=true;
          if (response.data.code == 200) {
            $('.toast').toast('show');
            _this.messageFailure=false;
            _this.hintTitle="Success";
            _this.hintText="operation success";
            _this.getAppointments("normal","all");
          }
          if (response.data.code == 400) {
            $('.toast').toast('show');
            _this.messageFailure=true;
            _this.hintTitle="Handle failed";
            _this.hintText=response.data.msg+_this.$t("string.user.unknowErrorHint");
          }
        })
        .catch(function (error) {
          _this.showButton=true;
          if(!error.response==undefined){
          if (error.response.status == 401) {
            _this.$token.removeToken();
            _this.$router.push({
              name: 'EmployeeLogIn',
              query: {
                message: _this.$t("string.appointment.loginExpired"),
                from: "/employee/personal"
              }
            });
          } }else {
            $('.toast').toast('show');
            console.log(error);
            _this.messageFailure=true;
            _this.hintTitle=_this.$t("string.user.unknowError");
            _this.hintText=response.data.msg+_this.$t("string.user.unknowErrorHint");
          }
        });
    },

    updateDate(){
      let _this = this;
      let data={}
      this.showButton=false;
      if(this.operationText=="operation"){
        data=this.$qs.stringify({
            id: this.operationId,
            token: this.$token.getToken(0),
            operationTime: this.operationDate
          })
      }else if(this.operationText=="discharge"){
        data=this.$qs.stringify({
            id: this.operationId,
            token: this.$token.getToken(0),
            dischargeDate: this.operationDate
          })
      }

      this.$axios({
          method: 'put',
          url: this.$global.request("updateAppointment"),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            "Authorization": "bearer " + this.$token.getToken(1)
          },
          data: data
        })
        .then(function (response) {
          _this.showButton=true;
          if (response.data.code == 200) {
            $('.toast').toast('show');
            _this.messageFailure=false;
            _this.hintTitle="Success";
            _this.hintText="operation success";
            $("#modal2").modal('hide');
            $("#modal3").modal('hide');
            _this.getAppointments("normal","all");
          }
          if (response.data.code == 400) {
            $('.toast').toast('show');
            _this.messageFailure=true;
            _this.hintTitle="Handle failed";
            _this.hintText=response.data.msg+_this.$t("string.user.unknowErrorHint");
          }
        })
        .catch(function (error) {
          _this.showButton=true;
          if(!error.response==undefined){
          if (error.response.status == 401) {
            _this.$token.removeToken();
            _this.$router.push({
              name: 'EmployeeLogIn',
              query: {
                message: _this.$t("string.appointment.loginExpired"),
                from: "/employee/personal"
              }
            });
          } }else {
            $('.toast').toast('show');
            console.log(error);
            _this.messageFailure=true;
            _this.hintTitle=_this.$t("string.user.unknowError");
            _this.hintText=response.data.msg+_this.$t("string.user.unknowErrorHint");
          }
        });
    },
  }
};
</script>

<style scoped>
.button-c{
  width: 70px;
}

.checked {
  background-color: #3ba2bd;
  color: #fff;
  border: 1px #fff solid;
}

svg{
  opacity: 0.7;
  cursor: pointer;
}

svg:hover{
  opacity: 1;
}

.info-card{
  max-height: 260px;
}

.status-card{
  min-width: 200px;
  max-width: 220px;
  height: 100px;
}

.status-cards{
  position: relative;
  top: 80px;
}

.dashboard-bg h1{
  position: relative;
  top: 60px;
}

.dashboard-bg{
  height: 300px;
  background: rgb(143,255,163);
  background: linear-gradient(146deg, rgba(143,255,163,1) 0%, rgba(14,92,173,1) 100%);
}

@media (max-width: 496px) {
  .card-hide{
    display: none !important;
  }
}
</style>