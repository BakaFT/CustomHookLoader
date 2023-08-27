# Introduction

This provider is to hook `Ember.Component.Extend` from Ember.js (which is used to construct LeagueClient FrontEnd) to edit almost every part of LeagueClient.

In LeagueClient there are so many Ember.js Components inside the front end source code. 

For example, in `rcp-fe-lol-champ-select.js` you can search `classNames: ["champion-select"]` to find a structure like:

```javascript
var _ = i.Ember.Component.extend(m, u, s.default, a.default, {
        classNames: ["champion-select"],
	    //........
}
```

It's using `Ember.component.extend` to create a new Component by "extending"  `m`、`u`、`s.default` and `a.default`. What's in the curly braces is called a `Mixin`. In this case, this Mixin controls all data and logics of champion selection stage in LeagueClient.

**The key part is that in Ember.js we can apply `extend` to the result of extending to OVERRIDE the member of it.**That's to say, by hooking `extend` we can edit the Mixin and do what we want. But how can we found the correct Mixin we want to edit? 

Well, in CustomHookLoader it's now matching by `classnames`, which in most cases should be unique

Let's take a look at some examples

# Example

### Bench Killer

some of you may seen the `Bench Killer` plugin by me. Let's see how it works.

This file contains two hooks. It match `champion-bench` and `champion-bench-item` then hook `runTaks` function of them.

Before calling original `runTask`, it change the second argument(task execution delay) to 0, making that swap cooldown reset immediately. And since this function is only used to schedule swapping cooldown in these two mixin  so it's safe to hook it.

```javascript
// You must export a array of hooks by using "export default"
const CHAMP_BENCH = [
    {
        matcher: 'champion-bench',
        wraps: [
            {
                name: 'runTask',
                replacement: function (original, args) {
                    args[1] = 0
                    return original(...args)
                },
            },
        ],
    }
]
const CHAMP_BENCH_ITEM = [
    {
        matcher: 'champion-bench-item',
        wraps: [
            {
                name: 'runTask',
                replacement: function (original, args) {
                    args[1] = 0
                    return original(...args)
                },
            },
        ],
    }
]

// It's recommended using this syntax to export groups of hooks in one file
export default [
    ...CHAMP_BENCH,
    ...CHAMP_BENCH_ITEM,
]
```

# Hook structure

If you want  load a `ember` hook from CustomHookLoader. You need to construct it in this way.

`mixin` and `wraps` are **optional** depends on what you do

- `matcher` is the name of the component, you can find it in the source code of RCPs by searching `classNames`
- `mixin` is a Ember.js Mixin(A function that returns an object literal). Mixin is used to add/override properties or methods of a component.
- `wraps` is a list of hooks, used to hook methods of a component.

```javascript
// use "export default ARRAY_OF_HOOKS" is a must
export default [
    {
        matcher: "the-classname-you-want-to-match",
        wraps: [
            {
                name: "function-member-name-of-this-mixin",
                replacement: function (original, args) {
                    // do some edit on args

                    // original(...args) equals to calling it as it was
                    const res = original(...args)

                    // do some edit on res

                    // Remeber to return the result at the end
                    return res;
                }
            }
        ],
        mixin: (Ember, args) => (
            {
                addingNewMeber: "Hi:), this is a new string member",
                // assume this exist in source code
                overriding: "This member is forced to be mine",

                // assume this function member exist in source code
                functionMember() {
                    // YOU SHOULD ALWAYS COPY THE ORIGINAL CODE HERE TO PREVENT ISSUES
                    // And do what you want to do now.
                }
            }
        )
    }
]
```

# Difference between mixin and wraps

## Mixin

`mixin` is to totally override a member of component.

That's to say, if you are overriding a `method`, you have to define everything that a function has including:

- Arguments
- Internal logic
- Return value

If you are overriding a `property`, you have to keep everything still except things you change, just like the second hook example in last section. (Or you can use some more elegant way to do that in Ember.js, let me know if you do, thx)

## Wraps

`wraps`is to hook a `function` of a component, you can:

- Change the arguments of it
- Get the return value of it
- And do anything you want before/after this function executes