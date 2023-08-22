import { proxy } from 'ajax-hook'
import { XhrHook } from '../types/XhrHook'
import { CollectHooks } from './_utils'

const Hook_xhr = (XHR_HOOKS:XhrHook[]) => {
    proxy({
        onRequest: (config, handler) => {
            XHR_HOOKS.filter(h => typeof h.matcher === "string" && h.matcher === config.url).forEach(h => {h.preSend(config)})
            handler.next(config);
        },
        onResponse: (response, handler) => {
            
            XHR_HOOKS.filter(h => typeof h.matcher === "string" && h.matcher === response.config.url).forEach(h => {h.postSend(response)})
            handler.next(response)
        }
    })
}


export const RegisterHook_xhr = (context:PenguInitContext) => {
    context.rcp.postInit('rcp-fe-lol-l10n', async () => {
        const XHR_HOOKS = await CollectHooks("xhr")
        Hook_xhr(XHR_HOOKS)
    })
}