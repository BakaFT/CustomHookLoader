interface EmberHookWrap{
    name:string,
    replacement: (original:any,args:any) => any
}

type EmberHookMixin = (Ember: any, args: any) => {}

declare interface EmberHook {
    matcher: string,
    mixin?: EmberHookMixin
    wraps?: Array<EmberHookWrap>
}

