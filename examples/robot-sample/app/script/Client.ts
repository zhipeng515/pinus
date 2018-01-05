import * as pinus from "./PinusForEgret";


export class Client
{    
    constructor(private actor : Actor)
    {

    }

    openid = String(Math.round(Math.random() * 1000));

    pinusClient = new pinus.WSClient();
    
    public testConnection():void{

        var host = "127.0.0.1";
        var port = "8000";
        this.pinusClient.on(pinus.WSClient.EVENT_IO_ERROR, function(event){
            //错误处理
            console.error("error",event);
        });
        this.pinusClient.on(pinus.WSClient.EVENT_CLOSE, function(event){
            //关闭处理
            console.error("close",event);
        });
        this.pinusClient.on(pinus.WSClient.EVENT_HEART_BEAT_TIMEOUT, function(event){
            //心跳timeout
            console.error("heart beat timeout",event);
        });
        this.pinusClient.on(pinus.WSClient.EVENT_KICK, function(event){
            //踢出
            console.error("kick",event);
        });

        //this.actor.emit("incr" , "gateConnReq");
        this.actor.emit("start" , "gateConn" , this.actor.id);
        this.pinusClient.init({
            host: host,
            port: port
        }, ()=> {
            this.actor.emit("end" , "gateConn" , this.actor.id);
            //连接成功执行函数
            console.log("gate连接成功");

            
            this.gateQuery();
        });
    }

    gateQuery()
    {
        //this.actor.emit("incr" , "gateQueryReq");
        this.actor.emit("start" , "gateQuery" , this.actor.id);
        this.pinusClient.request("gate.gateHandler.queryEntry",{openid:this.openid} , (result : {code : number , result ?:{host : string , port : number}})=> {
            //消息回调
            // console.log("gate返回",JSON.stringify(result));
            this.actor.emit("end" , "gateQuery" , this.actor.id);
            this.pinusClient.disconnect();
            this.connectToConnector(result.result);
        });
    }

    connectToConnector(result : {host : string , port : number})
    {
        //this.actor.emit("incr" , "loginConnReq");
        this.actor.emit("start" , "loginConn" , this.actor.id);
        this.pinusClient.init({
            host: result.host,
            port: result.port
        }, ()=> {
            this.actor.emit("end" , "loginConn" , this.actor.id);
            //连接成功执行函数
            console.log("connector连接成功");

            this.loginQuery(result);
        });
    }

    loginQuery(result : {host : string , port : number})
    {

        //this.actor.emit("incr" , "loginQueryReq");
        this.actor.emit("start" , "loginQuery" , this.actor.id);
        this.pinusClient.request("connector.loginHandler.login",result , (ret : any)=> {
            //消息回调
            this.actor.emit("end" , "loginQuery" , this.actor.id);
            //console.log("connector返回",JSON.stringify(result));
            
            this.loginQuery(result);
        });
    }
}

export function main(actor : Actor)
{
    var client = new Client(actor);
    client.testConnection();
}
