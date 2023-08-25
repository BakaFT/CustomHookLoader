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
            console.info('%c CustomHookLoader ','background: #FF0000; color: #fff', msg);
        }
    }
}

const checkProviderFolderArray = async (hookProvider:string) => {
    const hooksPath = `./hooks/${hookProvider}`
    const res = await PluginFS.ls(hooksPath)

    // hooksPath not exist
    if(res === undefined){
        // create it 
        const res = await PluginFS.mkdir(hooksPath)
        // create _remote.js 
        const res2 = await PluginFS.write(hooksPath + `/_remote.js`,"export default[]")
        if(res && res2){
            return true
        }
        // fail on creating
        return false
    }

    // hooksPath exist
    return true
}

const checkProviderFolderMap = async (hookProvider:string) => {
    const hooksPath = `./hooks/${hookProvider}`
    const res = await PluginFS.ls(hooksPath)

    // hooksPath not exist
    if(res === undefined){
        // create it 
        const res = await PluginFS.mkdir(hooksPath)
        // create _remote.js 
        const res2 = await PluginFS.write(hooksPath + `/_remote.js`,"export default{}")
        if(res && res2){
            return true
        }
        // fail on creating
        return false
    }

    // hooksPath exist
    return true
}

export const collectHooksArray = async (hookProvider:string) => {
    const logger = getLogger()
    let hooks = []
    const hookPromises = []

    const bExist = checkProviderFolderArray(hookProvider)
    if(!bExist){
        logger.warn(`Cannot create dir: ./hooks/${hookProvider}. Please report a issue on github.`)
    }

    // Local hooks
    const pLocal = await PluginFS.ls(`./hooks/${hookProvider}`)
    for (const fileName of pLocal!) {
        if (fileName.startsWith("_")) continue
        // Here is to force run-time importing by passing string not string literal into import
        const filePath = `./hooks/${hookProvider}/` + fileName
        const fileStat = await PluginFS.stat(filePath)
        if( fileStat == undefined || fileStat.length < 16 ){
            logger.warn(`"${filePath}" is illegal. Check it or Ask for devs for help.`)
            continue
        }
        hookPromises.push(import(filePath))
        logger.info(`Registered ${hookProvider} hook from: "${filePath}"`)
    }

    // Remote hooks
    const _remotePath = `./hooks/${hookProvider}/_remote.js`
    const _remoteStat = await PluginFS.stat(_remotePath)
    if( _remoteStat == undefined || _remoteStat.length < 16 ){
        logger.warn(`"${_remotePath}" not exist or illegal. Will only load local hooks from provider "${hookProvider}".`)   
    }else{
        const pRemote = await import(_remotePath)
        for (const url of pRemote.default) {
            hookPromises.push(import(url))
            logger.info(`Registered ${hookProvider} hook from: "${url}"`)
        }
    }
  
    const hookModules = await Promise.all(hookPromises)
    for (const hookModule of hookModules) {
        hooks.push(...hookModule.default)
    }
    return hooks
}

export const collectHooksMap = async (hookProvider:string) => {
    const logger = getLogger()
    let hooks:Map<string,any> = new Map()
    const hookPromises = []

    const bExist = checkProviderFolderMap(hookProvider)
    if(!bExist){
        logger.warn(`Cannot create dir: ./hooks/${hookProvider}. Please report a issue on github.`)
    }

    // Local hooks
    const pLocal = await PluginFS.ls(`./hooks/${hookProvider}`)
    for (const fileName of pLocal!) {
        if (fileName.startsWith("_")) continue
        // Here is to force run-time importing by passing string not string literal into import
        const filePath = `./hooks/${hookProvider}/` + fileName
        const fileStat = await PluginFS.stat(filePath)
        if( fileStat == undefined || fileStat.length < 16 ){
            logger.warn(`"${filePath}" is illegal. Check it or Ask for devs for help.`)
            continue
        }
        hookPromises.push(import(filePath))
        logger.info(`Registered ${hookProvider} hook from: "${filePath}"`)
    }

    // Remote hooks
    const _remotePath = `./hooks/${hookProvider}/_remote.js`
    const _remoteStat = await PluginFS.stat(_remotePath)
    if( _remoteStat == undefined || _remoteStat.length < 16 ){
        logger.warn(`"${_remotePath}" not exist or illegal. Will only load local hooks from provider "${hookProvider}".`)   
    }else{
        const pRemote = await import(_remotePath)
        for (const url of pRemote.default) {
            hookPromises.push(import(url))
            logger.info(`Registered ${hookProvider} hook from: "${url}"`)
        }
    }
  
    const hookModules = await Promise.all(hookPromises)
    for (const hookModule of hookModules) {
        const hookMap = new Map(Object.entries(hookModule.default))
        for (const [key, value] of hookMap) {
            hooks.set(key, value);
          }
    }
    return hooks
}