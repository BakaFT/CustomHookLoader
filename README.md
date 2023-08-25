![logo](https://raw.githubusercontent.com/BakaFT/CustomHookLoader/assets/logo.svg)

# Introduction

This plugin allows you to easily manage various custom hooks, supporting both **remote and local** loading.

Hook your game client in a more easy and structured way by putting a file or adding a new line!

![console](https://raw.githubusercontent.com/BakaFT/CustomHookLoader/assets/console.jpg)

# Feature 

- [x] Load hooks from both local and remote easily

  - Put hook file into `./hooks/HOOK_PROVIDER_NAME/`

  - Add a remote hook file URL into `./hooks/HOOK_PROVIDER_NAME/_remote`
- [x] Support various custom hook provider

  - [x] Ember.js Component Hook
  - [x] XHR Hook
  - [ ] Settings panel hook
  - [ ] l10n hook
- [ ] API for other plugins
- [ ] Enable/Disable hooks within an external UI

# Installation

1. Download from Releases

2. Create a new folder under `plugins` folder and put `index.js` in it

**After first run, this plugin will create folders along with a `_remote.js` for providers if they don't exist**

That's it. You can get hooks from Pengu Loader Community and install them by instructions given by authors.

A typical folder structure with some hooks should be like:

```powershell
├── assets
├── config
├── core.dll
├── datastore
├── Pengu Loader.exe
├── plugins
│   ├── CustomHookLoader
│   │   ├── hooks
│   │   │   ├── ember
│   │   │   │   ├── bench_killer.js
│   │   │   │   └── _remote.js
│   │   │   └── xhr
│   │   │   │   ├── betterTencentLcu.js
│   │   │   │   └── _remote.js
│	│	│	│── OTHER_PROVIDERS
│   │   ├── index.js
```

# Usage

## Adding a hook

### Local way

> For Devs:
>
> This is designed for those hooks that do not need update frequently or do not need configs

This way CHL will load the hook from local file.

Get the hook file from somewhere and put it under the **CORRESPODING** provider folder.

```javascript
├── plugins
│   ├── CustomHookLoader
│   │   ├── hooks
│   │   │   ├── ember
│   │   │   │   ├── bench_killer.js // This will be loaded as a `ember` hook
│   │   │   │   └── _remote.js
│   │   │   └── xhr
│   │   │   │   ├── betterTencentLcu.js // This will be loaded by antoher provider `xhr`
│   │   │   │   └── _remote.js
```

### Remote way

> For Devs:
>
> This is usually for those hooks that do not need configs

This way CHL will load the hook from remote.

Every hook provider got a `_remote.js` , it should contain a structure like:

```javascript
export default[]
```

> **Be careful that every hook provider got its own `_remote.js`, do not mix them up**

What we gonna do is copy the hook URL from author and paste it in `_remote.js` like:

```javascript
export default[
    "https://whatever-cdn.com/balabala/hook.js",
    "https://whatever-cdn.com/balabala/another_hook.js",
    // and more
]
```

# Contribution

I'm willing to see any PRs including docs and new hook providers :)
