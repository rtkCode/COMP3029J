const global = {}

global.baseAddress="http://sg.iecho.cc/";

global.request=function(address){
    return this.baseAddress+address;
};

export default global