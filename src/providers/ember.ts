import { CollectHooks, wrap_method } from "./_utils.js";

const Hook_extend = (Ember: any, EMBER_HOOKS: Array<EmberHook>) => {
    wrap_method(Ember.Component, 'extend', function (original: any, args: Array<any>) {
        let res = original(...args);

        const classNames = args
            .filter(x => typeof x === 'object' && x.classNames && Array.isArray(x.classNames))
            .map(x => x.classNames.join(' '));

        const matchingHooks = EMBER_HOOKS.filter(x => x.matcher === classNames[0]);

        matchingHooks.forEach(hook => {
            const Mixin = hook.mixin;

            if (typeof Mixin === 'function') {
                res = res.extend(Mixin(Ember, args));
            }

            if (hook.wraps && hook.wraps.length > 0) {
                hook.wraps.forEach(wrap => {
                    wrap_method(res.proto(), wrap.name, wrap.replacement);
                });
            }
        });

        return res;
    });
}

export const RegisterHook_ember =  (context: PenguInitContext) => {
    context.rcp.postInit('rcp-fe-ember-libs', async api => {
        const EMBER_HOOKS = await CollectHooks("ember")
        wrap_method(api, 'getEmber', function (original: any, args: any) {
            const res = original(...args)
            return res.then((Ember: any) => {
                Hook_extend(Ember, EMBER_HOOKS)
                return Ember
            })
        })
    })
}