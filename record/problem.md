# React and Electron, the useful things to know

> 参考文章: https://gist.github.com/Arkellys/96359e7ba19e98260856c897bc378606

I like to help folks with their Electron and React problems, but I often have to repeat the same things over and over again. So here is a short guide to some of the most common questions and issues people have.

1. [Read the docs](#read-the-docs)
2. [Adding Electron to an existing React app](#adding-electron-to-an-existing-react-app)
3. [Common issues](#common-issues)

---

## Read the docs

Yes, I start with this, because Electron's documentation very good and complete, and lot of problems can be solved just by reading it. But since I'm being nice, here is (to me) some important parts:

[Quick Start](https://www.electronjs.org/docs/latest/tutorial/quick-start) | [Inter-Process Communication](https://www.electronjs.org/docs/latest/tutorial/ipc) | [Using Preload Scripts](https://www.electronjs.org/docs/latest/tutorial/tutorial-preload) | [Security](https://www.electronjs.org/docs/latest/tutorial/security) | [Process Model](https://www.electronjs.org/docs/latest/tutorial/process-model)

**Please, read them before asking for help.**

## Adding Electron to an existing React app

If you have an existing React app and want to wrap it with Electron (i.e. not using a template, boilerplate or special tool), you can start by reading the instructions of the [Quick Start](https://www.electronjs.org/docs/latest/tutorial/quick-start) guide. You don't have to create a new app, but you will need these:

- [Run the main process](https://www.electronjs.org/docs/latest/tutorial/quick-start#run-the-main-process)
- [Opening your web page in a browser window](https://www.electronjs.org/docs/latest/tutorial/quick-start#opening-your-web-page-in-a-browser-window)
- Add electron `start` script to your `package.json`

### Setup with React

When creating a [`BrowserWindow`](https://www.electronjs.org/docs/latest/api/browser-window), you can either load an **URL** ([`loadURL`](https://www.electronjs.org/docs/latest/api/web-contents#contentsloadurlurl-options)) or a **File** ([`loadFile`](https://www.electronjs.org/docs/latest/api/web-contents#contentsloadfilefilepath-options)) into this window. And when developing a React app, you either have a development server (**URL**), or a production build (**File**).

**So, how to connect Electron and React?**

In development you have to start your React dev server, wait for it to be ready and _then_ start Electron with your `BrowserWindow` loading the server URL (`localhost`). In production, you have to build your React app and make your `BrowserWindow` load the built HTML file. To start Electron in production, you have to [package it into a real app](#packaging-for-production).

Here is how it looks with code (paths and names depend on your config):

```js
app.isPackaged
  ? mainWindow.loadFile(path.join(__dirname, 'index.html')) // Prod
  : mainWindow.loadURL('http://localhost:3000') // Dev
```

**Wait for my dev server to be ready?**

However you created your React app in the first place, on your `package.json` you must have a script to run your app in dev (`start`, `dev`, `serve`... the name depends on how your app was configured). Now that you have a new script to start electron, you may want to add another script so you can run React and Electron with a single command line.

For this, you can use the modules [`wait-on`](https://github.com/jeffbski/wait-on) (to wait for the server to be ready) and [`concurrently`](https://github.com/open-cli-tools/concurrently) (to run multiple scripts). Here is an example for a React app created with [CRA](https://create-react-app.dev/):

```json
"scripts": {
  "start:react": "react-scripts start",
  "start:electron": "electron .",
  "start": "concurrently \"yarn start:react\" \"wait-on http://localhost:3000/ && yarn start:electron\"",
}
```

```shell
yarn start
```

If you don't use [Yarn](https://yarnpkg.com/), replace `yarn` with `npm`.

### Packaging for production

To package your app for production, you can start by reading the [application packaging docs](https://www.electronjs.org/docs/latest/tutorial/application-distribution).

Whether you decide to use [Electron Forge](https://www.electronforge.io/), [electron-builder](https://www.electron.build/index.html) or [Electron Packager](https://github.com/electron/electron-packager) (if you feel confident), you will want to package only what you need. In the context of a React app, it means you will need to first _build_ your React app (with whatever bundler you use), and then **only package the bundled files**. Note that some dependencies, such as native modules, cannot be bundled, so you will need to configure your packager to handle them separately from your bundled files.

For **Electron Forge** (which use **Electron Packager** under the hood), you can only specify the files you _don't want_ to package, using the [`ignore`](https://electron.github.io/packager/main/interfaces/Options.html#ignore) option. Here is an example of configuration (you can also use an [`ignoreFunction`](https://electron.github.io/packager/main/types/IgnoreFunction.html)):

```js
packagerConfig: {
  ignore: [
    "^\\/public$",
    "^\\/src$",
    "^\\/node_modules$",
    "^\\/[.].+",
    // ...
  ]
},
```

For **electron-builder**, you can specify the files you _want_ to package with the [`files`](https://www.electron.build/configuration/contents#files) option:

```js
{
  files: ["./build/**/*"],
  // ...
}
```

Of course, this configuration entirely depends on your file and folder structure. Here is my personal advice though: to prevent conflicts, make sure your _build_ folder (for React) has a different name than your _packaging_ folder (for Electron).

## Common issues

The issues below are not always specific to React+Electron apps, but they are so common that I prefer to include them.

1. [It doesn't work, and there is no error](#1)
2. [Error when using `require`](#2)
3. [Cannot find module 'fs'](#3)
4. [Can't load files/modules into preload](#4)
5. [Blank page in production](#5)
6. [Images/assets not displayed with Vite in production](#6)
7. [Application entry file does not exist](#7)
8. [\_\_dirname is not defined](#8)

---

### <a href="#1" name="1">1. It doesn't work, and there is no error</a>

Have you tried to look into the developer console?

No joke, people doing front-end development with the console closed is far too common. When working with Electron, remember you have two consoles: the one for your main process (i.e. the one you used to start your app) and the one for your renderer (i.e. the browser's). Look for errors into **both** of them.

You can open the DevTools from the menu or your app or using the shortcut <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>I</kbd>. You can also configure your window to open them automatically:

```js
mainWindow.webContents.openDevTools()
```

### <a href="#2" name="2">2. Error when using `require`</a>

Problems with `require` will give you various types of errors, such as:

```diff
- Uncaught ReferenceError: require is not defined
```

```diff
- TypeError: windows.require is not a function
```

```diff
- Uncaught Error: Dynamic require of "xxx" is not supported
```

You will find a lot of questions about this on Stack Overflow, and sadly a lot of accepted answers will just tell you to disable security, which is **bad** (unless you know what you're doing).

Electron comes with several [security](https://www.electronjs.org/docs/latest/tutorial/security) features that are all enabled by default. These features will stop you from using `require` in your [renderer process](https://www.electronjs.org/docs/latest/tutorial/process-model#the-renderer-process) (i.e. your React code). It means that, by default, your `BrowserWindow` will have this configuration:

```js
const mainWindow = new BrowserWindow({
  webPreferences: {
    contextIsolation: true,
    nodeIntegration: false,
    sandbox: true,
    webSecurity: true,
  },
})
```

If you care about security, you _want_ to keep it this way.

Fortunately, you don't need to disable security to use Node.js APIs, you can use [IPC](https://www.electronjs.org/docs/latest/tutorial/ipc) and a [preload](https://www.electronjs.org/docs/latest/tutorial/tutorial-preload) file. You will find a lot of nice examples in the docs linked. If you have difficulties to understand how IPC and preload work, I also suggest you take a look at [this very good article](https://www.debugandrelease.com/the-ultimate-electron-guide/).

### <a href="#3" name="3">3. Cannot find module 'fs'</a>

```diff
- Uncaught Error: Cannot find module 'fs'
```

```diff
- Error: Can't resolve 'fs' in 'xxx'
```

This error happens when you try to compile Node.js code with [webpack](https://webpack.js.org/), and that it is not configured for it. This usually means you `require`/`import` something from `electron`, or try to use Node.js APIs in your [renderer process](https://www.electronjs.org/docs/latest/tutorial/process-model#the-renderer-process) (i.e. your React code). **Doing this is a [security](https://www.electronjs.org/docs/latest/tutorial/security#2-do-not-enable-nodejs-integration-for-remote-content) risk.**

To solve this issue, you can follow the same instructions as for [common issue #2](#2). If you can't find where the bad import is in your code, also make sure you are not importing your main or your preload file into your renderer.

If you get this error when trying to bundle your main and/or preload files, then it means you need to configure webpack with the correct [target](https://webpack.js.org/configuration/target/): `electron-main` or `electron-preload`. Note that the target `electron-renderer` also exists.

### <a href="#4" name="4">4. Can't load files/modules into preload</a>

You followed the [IPC](https://www.electronjs.org/docs/latest/tutorial/ipc) tutorial, implemented a [`contextBridge`](https://www.electronjs.org/docs/latest/api/context-bridge) on your preload file, tried to use an exposed function on your renderer, but you get this error:

```diff
- Error: Cannot read properties of undefined (reading xxx)
```

Or maybe you get this:

```diff
- Unable to load preload script: xxx
- Error: module not found: xxx
```

This is because for [security](https://www.electronjs.org/docs/latest/tutorial/security) reasons, Electron's processes are [sandboxed](https://www.electronjs.org/docs/latest/tutorial/sandbox) by default. For the preload, it means that you can only `require` some [specific modules](https://www.electronjs.org/docs/latest/tutorial/sandbox#preload-scripts) (emphasis mine):

> In order to allow renderer processes to communicate with the main process, preload scripts attached to sandboxed renderers will still have a polyfilled subset of Node.js APIs available. A `require` function similar to Node's `require` module is exposed, **but can only import a subset of Electron and Node's built-in modules**: [...]

If you're only looking to split your preload into multiple files, you should be able to do so with your bundler (and then use `import` instead of `require`). If what you want is to use Node.js APIs not included in the subset, you will need to move these on your [main process](https://www.electronjs.org/docs/latest/tutorial/process-model#the-main-process) and use [IPC](https://www.electronjs.org/docs/latest/tutorial/ipc) to get what you need.

If for whatever reason you don't want to move everything on main, another possibility is to disable sandboxing. But don't forget that it is a security feature which is [not recommended to disable](https://www.electronjs.org/docs/latest/tutorial/security#4-enable-process-sandboxing).

```diff
const mainWindow = new BrowserWindow({
  webPreferences: {
+   sandbox: false,
    preload: path.join(__dirname, 'preload.js')
  }
});
```

### <a href="#5" name="5">5. Blank page in production</a>

The first thing you should check is that your HTML file is correcly loaded. If your HTML is here and [you don't have any error](#1) but your page is empty, most of the time it's because you are not using the correct router or that you've forgotten something in your configuration (or both).

When using [React Router](https://reactrouter.com/en/main) with Electron, you should use **hash** routing. It means either [`<HashRouter>`](https://reactrouter.com/en/main/router-components/hash-router#hashrouter) or [`createHashRouter`](https://reactrouter.com/en/main/routers/create-hash-router). Don't worry if you were using [`<BrowserRouter>`](https://reactrouter.com/en/main/router-components/browser-router)/[`createBrowserRouter`](https://reactrouter.com/en/main/routers/create-browser-router), you can just replace it and it will work, no further code changes are required.

```diff
root.render(
- <BrowserRouter>
+ <HashRouter>
    {/* ... */}
- </BrowserRouter>,
+ </HashRouter>,
  root
);
```

Note that it should also work with [`<MemoryRouter>`](https://reactrouter.com/en/main/router-components/memory-router)/[`createMemoryRouter`](https://reactrouter.com/en/main/routers/create-memory-router) as long as you don't need to navigate on a page using [`loadURL`](https://www.electronjs.org/docs/latest/api/web-contents#contentsloadurlurl-options)/[`loadFile`](https://www.electronjs.org/docs/latest/api/web-contents#contentsloadfilefilepath-options).

Another reason for the blank page can be a missing configuration. Depending on the tool you use to run React, you may need to specify the base path to serve your app. For example, if you used [CRA](https://create-react-app.dev/) to create your app, you have to add a [`homepage`](https://create-react-app.dev/docs/deployment/#step-1-add-homepage-to-packagejson) field on your `package.json`:

```js
{
  "homepage": "./",
  // ...
}
```

For [Vite](https://vitejs.dev/), see [common issues #6](#6). If you use another tool, you will have to check its documentation to see if a similar option is required.

### <a href="#6" name="6">6. Images/assets not displayed with Vite in production</a>

If you use [Vite](https://vitejs.dev/) for your React app, in order to load assets correctly in production on an Electron app you need to add the [`base`](https://vitejs.dev/guide/build.html#public-base-path) option on your configuration file:

```diff
export default defineConfig({
  plugins: [react()],
+ base: "./",
  // ...
});
```

### <a href="#7" name="7">7. Application entry file does not exist</a>

```diff
- Error: Application entry file "build/electron.js" in the "xxx" does not exist. Seems like a wrong configuration.
```

This [electron-builder](https://www.electron.build/index.html) error is specific to React app created with [CRA](https://create-react-app.dev/). Electron-builder has a [built-in preset](https://www.electron.build/app-builder-lib.interface.configuration#extends_1) for CRA, which it will apply by default when detecting `react-scripts`:

> #### extends?
>
> `optional` **extends**: `null` | `string` | `string[]`
>
> The name of a built-in configuration preset (currently, only `react-cra` is supported) or any number of paths to config files (relative to project dir).
>
> The latter allows to mixin a config from multiple other configs, as if you `Object.assign` them, but properly combine `files` glob patterns.
>
> If `react-scripts` in the app dependencies, `react-cra` will be set automatically. Set to `null` to disable automatic detection.

This preset expects your entry file to be named `electron.js` and to be in the `build` folder when packaging. You can either decide to respect the expected file structure, or you can disable the preset using the `extends` option on your [configuration](https://www.electron.build/app-builder-lib.interface.configuration):

```diff
"build": {
+ "extends": null,
  // ...
}
```

### <a href="#8" name="8">8. \_\_dirname is not defined</a>

```diff
- Uncaught ReferenceError: __dirname is not defined
```

If you get this error, you are probably trying to use `electron` APIs on your [renderer process](https://www.electronjs.org/docs/latest/tutorial/process-model#the-renderer-process) (i.e. your React code). The variable `__dirname` is a [Node.js global](https://nodejs.org/docs/latest/api/globals.html#globals_dirname), which require access to the Node.js APIs to be used. And for [security reasons](https://www.electronjs.org/docs/latest/tutorial/security#2-do-not-enable-nodejs-integration-for-remote-content), access to Node.js from your renderer is disabled by default.

To solve this issue, you can follow the same instructions as for [common issue #2](#2). If you can't find where the bad import is in your code, also make sure you are not importing your main or your preload file into your renderer.

---

**You still have an issue that you can't solve?**

Try to search on [Stack Overflow](https://stackoverflow.com/questions/tagged/electron) and [Electron's issues](https://github.com/electron/electron/issues?q=is%3Aissue) to see if anyone else has had the same problem as you. You can also join Electron's [official Discord server](https://discord.com/invite/APGC3k5yaH) and seek for help here.
