// Pengu
interface FileStat {
    fileName: string
    length: number
    isDir: boolean
}

interface PluginFS {
    read: (path: string) => Promise<string | undefined>
    write: (path: string, content: string, enableAppendMode?: boolean) => Promise<boolean>
    mkdir: (path: string) => Promise<boolean>
    stat: (path: string) => Promise<FileStat | undefined>
    ls: (path: string) => Promise<string[] | undefined>
    rm: (path: string, recursively: boolean) => Promise<number>
}

interface Rcp {
    preInit(name: string, callback: (provider: any) => any): void;
    postInit(name: string, callback: (api: any) => any): void;
    whenReady(name: string): Promise<any>;
    whenReady(names: string[]): Promise<any[]>;
    get(name: string): object | undefined;
}

declare interface PenguInitContext {
    rcp: Rcp;
}

declare const openDevTools: (remote?: boolean) => void;
declare const openAssetsFolder: () => void;
declare const openPluginsFolder: (path?: string) => boolean;
declare const reloadClient: () => void;
declare const restartClient: () => void;
declare const getLocalScriptPath: () => string | undefined;
declare const getLocalPluginName: () => string | undefined;
declare const __llver: string;
declare const rcp: Rcp;
declare const PluginFS: PluginFS;

