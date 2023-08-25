import { proxy } from 'ajax-hook'
import { XhrHook } from '../types/XhrHook'
import { collectHooksArray, getLogger } from './_utils'

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
    const logger = getLogger()
    context.rcp.postInit('rcp-fe-lol-l10n', async () => {
        const XHR_HOOKS = await collectHooksArray("xhr")
        Hook_xhr(XHR_HOOKS)
    })
    logger.info("Successfully registered provider 'xhr'")
}