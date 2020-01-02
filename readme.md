# webapck

webpack 是一个现代 JavaScript 应用程序的静态模块打包器(module bundler)。当 webpack 处理应用程序时，它会递归地构建一个依赖关系图(dependency graph)，其中包含应用程序需要的每个模块，然后将所有这些模块打包成一个或多个 bundle。

## 原理

### 依赖关系图

+ 万物之源---入口文件
+ 获取依赖
    迭代


### 打包

+ 优化
    ModuleConcatenation ： Dead code is code that is never used in your app. Functions that are never called. Exports that are never imported.
+ 插件 vs loader
    The difference between a plugin and a loader is that a loader can only transform a single file just before it’s added to the dependency graph. 

## 进化

## 特性

## 实验
