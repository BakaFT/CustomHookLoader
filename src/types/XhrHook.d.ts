import { XhrRequestConfig, XhrResponse } from "ajax-hook"

declare interface XhrHook {
    matcher: string,
    preSend: (XhrRequestConfig:XhrRequestConfig) => void,
    postSend: (XhrResponse:XhrResponse) => void
}

