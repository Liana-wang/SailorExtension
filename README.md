# sailor-extension
该仓库包含浏览器扩展包和 qiankun 微应用的开发。
* 解决manifest v3 不支持执行远程托管代码的限制。
* 该框架具有高度可扩展性，有利于企业跨团队协作。

## 1、目录说明
-- apps：存放应用模块   
    -- Plugins： 插件应用  
    -- SailorExtensionPkg： 扩展包  
-- config：配置文件  
-- packages：可复用的模块

## 2、开发步骤
1. 必须使用 pnpm 安装依赖。
2. 安装依赖 pnpm install。
3. 开发扩展包 pnpm sailor:dev。
4. 打包扩展包 pnpm sailor:build。
5. 开发插件应用 pnpm plugins:dev。
6. 打包插件应用 pnpm plugins:build。

### 2.1 新增插件应用
1. 在 apps/Plugins/src/entrypoints/ 下以插件名称新增目录，增加入口 (可参照 search)。
2. 重新执行 pnpm plugins:dev。

## 3、扩展包功能
1. 在任意 web 界面显示入口。
2. 用户鼠标选中文本后显示入口。
3. 点击 popup 按钮弹出插件应用。
4. 登录：使用 AnyShare web 客户端登录界面认证授权，能在 background 中获取到 accessToken，使用该 token 发起 http 请求。
5. 能够通过 qiankun 加载微应用。

## 4、通信方式
1. content 与 injected 通信场景:
    * 登录：在 content 中通 window.open 打开 AnyShare web 客户端登录窗口，登录认证完成后 injected 通过 window.postMessage 通知 content 关闭登录窗口。
2. content 与 background 通信场景：
   * 获取 cookies 和 fetch 请求: 在 content 通过 browser.runtime.sendMessage 通知 background 获取 cookies 或者发起 fetch 请求，在 background 中返回结果。
   * background 作为桥梁，监听 popup 图标被点击，通知 content 弹出抽屉界面：通过 browser.tabs.sendMessage 通知 content。
3. background 监听 popup 点击事件：在 background 中通过 browser.onClicked.addListener 监听点击事件。
4. content 与 iframe 通信场景:
   * 引入 iframe 的原因：因为 manifest v3 不再支持远程托管代码，扩展程序只允许执行其软件包中的 js，qiankun 微前端是通过 eval 执行远程托管代码来完成加载，所以也需要借助 sandbox 和 iframe 来实现引入 qiankun 框架。
   * content 将全局配置、用户信息等传入微应用。
   * 在微应用中获取 cookies，刷新 token，打开新页面，发起 fetch 请求等。
   * content 中用户激活了指定插件应用。
   * content 中用户鼠标选中了文本。
