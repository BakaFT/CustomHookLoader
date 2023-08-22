const WRAPPED = Symbol('ChlSymbol');
interface Container {
    [key: string]: any; 
    [WRAPPED]?: boolean;
}
export function wrap_method(container: Container, name: string, replacement: Function): void {
    if (!container || typeof container[name] !== 'function') return;
    if (container[WRAPPED]) return;
    const old = container[name] as Function;
    container[name] = function (...args: any[]) {
        return replacement.call(this, (...a: any[]) => old && old.apply(this, a), args);
    };
    container[WRAPPED] = true;
}


export const getLogger = ()=>{
    return{
        info: function(msg:string){
            console.info('%c CustomHookLoader ','background: #E8711C; color: #fff', msg);
        },
        warn: function(msg:string){
            console.info('%c CustomHookLoader ','background: #183461; color: #fff', msg);
        }
    }
}

export const CollectHooks = async (hookProvider:string) => {
    const logger = getLogger()
    let hooks = []
    const pLocal = await PluginFS.ls(`./hooks/${hookProvider}`)
    // Storing path here -------------------------------------------↓
    const _remotePath = `./hooks/${hookProvider}/_remote.js`
    const pRemote = await import(_remotePath)

    const hookPromises = []
    for (const fileName of pLocal!) {
        if (fileName.startsWith("_")) continue
        // and here is to force run-time importing -----↑
        // Otherwise esbuild/vite will import it in compile time
        const filePath = `./hooks/${hookProvider}/` + fileName
        hookPromises.push(import(filePath))
        logger.info(`Registered ${hookProvider} hook from: ${filePath}`)
    }

    for (const url of pRemote.default) {
        hookPromises.push(import(url))
        logger.info(`Registered ${hookProvider} hook from: ${url}`)
    }

    const hookModules = await Promise.all(hookPromises)
    for (const hookModule of hookModules) {
        hooks.push(...hookModule.default)
    }
    return hooks
}
