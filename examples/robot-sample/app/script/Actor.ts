
declare interface Actor
{
    id : string;

    emit(type : "start" | "end" , action : string , reqId : string): void;
    emit(type : "incr" | "decr" , action : string): void;
}