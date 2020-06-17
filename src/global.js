const global = {}

global.baseAddress="http://sg.iecho.cc/api/";

global.request=function(address){
    return this.baseAddress+address;
};

export default global