const global = {}

global.baseAddress="http://sg.iecho.cc/api/";

global.request=function(address){
    return this.baseAddress+address;
};

global.storeSession=function(session){
    let s=window.btoa(window.encodeURIComponent(session));
    localStorage.setItem("s",s);
};

global.getSession=function(){
    let s = localStorage.getItem('s');
    let session = window.decodeURIComponent(window.atob(s));
    return session;
};

global.removeSession=function(){
    localStorage.removeItem('s');
};

export default global