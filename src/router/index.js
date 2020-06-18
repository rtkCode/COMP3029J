import Vue from "vue";
import VueRouter from "vue-router";
import Index from "../views/Index.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import Profile from "../views/Profile.vue";
import Dashboard from "../views/Dashboard.vue";
import Env from "../views/Env.vue";
import Account from "../views/Account.vue";
import Cluster from "../views/Cluster.vue";
import global from "../global.js"
import http from 'axios'

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Index",
    component: Index,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    meta: {
      requireAuth: true
    },
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: {
      requireAuth: true
    },
  },
  {
    path: "/env",
    name: "Env",
    component: Env,
    meta: {
      requireAuth: true
    },
  },
  {
    path: "/account",
    name: "Account",
    component: Account,
    meta: {
      requireAuth: true
    },
  },
  {
    path: "/cluster",
    name: "Cluster",
    component: Cluster,
    meta: {
      requireAuth: true
    },
  },
];

const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    if (global.getSession() == null) {
      next({name: 'Login'});
    }else{
      http({
        method: "get",
        url: global.request("user/profile"),
        headers: { 
          "Content-Type": "application/x-www-form-urlencoded",
          "Cookie": global.getSession(),
        },
      })
      .then(function(response) {
        if (response.data.code == 200) {
          next();
        }else if(response.data.code == 403){
          global.removeSession();
          next({name: 'Login'});
        }
      })
      .catch(function(error) {
        console.log(error);
      });
    }
  }else{
    next();
  }
});

export default router;
