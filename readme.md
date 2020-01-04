
<!-- @import "[TOC]" {cmd="toc" depthFrom=1 depthTo=6 orderedList=false} -->

<!-- code_chunk_output -->

- [webapck](#webapck)
  - [1. 原理](#1-%e5%8e%9f%e7%90%86)
    - [1.1 依赖关系图](#11-%e4%be%9d%e8%b5%96%e5%85%b3%e7%b3%bb%e5%9b%be)
    - [1.2 打包](#12-%e6%89%93%e5%8c%85)
    - [1.3 loader &amp; plugin](#13-loader-amp-plugin)
      - [生命周期](#%e7%94%9f%e5%91%bd%e5%91%a8%e6%9c%9f)
      - [diff](#diff)
  - [2. 配置](#2-%e9%85%8d%e7%bd%ae)
  - [3. webpack 5](#3-webpack-5)
  - [4. demo](#4-demo)
    - [4.1 打包输出](#41-%e6%89%93%e5%8c%85%e8%be%93%e5%87%ba)

<!-- /code_chunk_output -->

# webapck

webpack 是一个现代 JavaScript 应用程序的静态模块打包器(module bundler)。当 webpack 处理应用程序时，它会递归地构建一个依赖关系图(dependency graph)，其中包含应用程序需要的每个模块，然后将所有这些模块打包成一个或多个 bundle。

## 1. 原理

读取入口文件（entry），然后递归查找所依赖的模块(module)，构建成一个“依赖图”，然后根据配置中的加载器(loader)和打包策略来对模块进行编译。

### 1.1 依赖关系图

+ 万物之源---入口文件
    默认值为 ./src
+ 获取依赖

```javascript
const fs = require('fs');
const path = require('path');
const babylon = require('babylon');
const traverse = require('babel-traverse').default;
const {transformFromAst} = require('babel-core');

let ID = 0;

// 该函数将接受 文件路径 ,读取内容并提取它的依赖关系.
function createAsset(filename) {
  // 以字符串形式读取文件的内容.
  const content = fs.readFileSync(filename, 'utf-8');
  //   现在我们试图找出这个文件依赖于哪个文件. 我们可以通过查看其内容
  //   使用Babylon解析、获取  `import` 字符串.
  const ast = babylon.parse(content, {
    sourceType: 'module',
  });

  // 这个数组将保存这个模块依赖的模块的相对路径.
  const dependencies = [];

  //   遍历`ast`来试着理解这个模块依赖哪些模块.
  //   我们检查`ast`中的每个 `import` 声明. 
  traverse(ast, {
    // 找到`import`声明时,我们都可以将其数值视为`依赖性`.
    ImportDeclaration: ({node}) => {
      // 我们将依赖关系数组推入我们导入的值. ⬅️
      dependencies.push(node.source.value);
    },
  });

  //   通过递增简单计数器为此模块分配唯一标识符.
  const id = ID++;

  //   为了确保`我们的bundle`在所有浏览器中运行,
  //   用`babel-preset-env``将我们的代码转换为浏览器可以运行的东西.
  const {code} = transformFromAst(ast, null, {
    presets: ['env'],
  });

  // 返回有关此模块的所有信息.
  return {
    id,
    filename,
    dependencies,
    code,
  };
}
```

导出的结果如下：

```javascript
{ 
    id: 0,
    filename: './example/entry.js',
    dependencies: [ './message.js' ],
    code: '"use strict";\n\nvar _message = require("./message.js");\n\nvar _message2 = _interopRequireDefault(_message);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nconsole.log(_message2.default);'
}
```

**迭代**

```javascript
// 现在我们可以提取单个模块的依赖关系,我们将通过提取`入口文件{entry}`的依赖关系来解决问题.
// 那么,我们将提取它的每一个依赖关系的依赖关系. 循环下去
// 直到我们了解应用程序中的每个模块以及它们如何相互依赖. 即`依赖图`.
function createGraph(entry) {
  // 首先解析入口文件.
  const mainAsset = createAsset(entry);

  //   我们将使用`队列{queue}`来解析每个`模块`的依赖关系.
  //   初始化一个只有 入口模块的数组.
  const queue = [mainAsset];

  // 循环遍历 待解析模块的任务队列.
  for (const asset of queue) {
    //  给模块挂载mapping属性，记录它所依赖模块的相对路径列表.
    asset.mapping = {};

    // 这是这个模块所在的目录.
    const dirname = path.dirname(asset.filename);

    // 我们遍历其相关路径的列表
    asset.dependencies.forEach(relativePath => {
      // relativePath是相对路径，
      // 我们可以通过将相对路径与父资源目录的路径连接,将相对路径转变为绝对路径.
      const absolutePath = path.join(dirname, relativePath);

      // 解析模块,读取其内容并提取其依赖关系.
      const child = createAsset(absolutePath);

      //   了解`asset`依赖取决于`child`这一点对我们来说很重要.
      //   通过给`asset.mapping`对象增加一个新的属性(值为child.id)来表达这种一一对应的关系.
      asset.mapping[relativePath] = child.id;

      // 最后,我们将`child`这个资产推入队列,这样它的依赖关系也将被迭代和解析.
      queue.push(child);
    });
  }

  //   到这一步,队列 就是一个包含目标应用中 每个模块 的数组:
  //   这就是我们的表示图.
  return queue;
}

```

获得依赖图，结构如下：

```javascript
[
  { id: 0,
    filename: './example/entry.js',
    dependencies: [ './message.js' ],
    code: '"use strict";\n\nvar _message = require("./message.js");\n\nvar _message2 = _interopRequireDefault(_message);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nconsole.log(_message2.default);',
    mapping: { './message.js': 1 } 
  },
  { id: 1,
    filename: 'example\\message.js',
    dependencies: [ './name.js' ],
    code: '"use strict";\n\nObject.defineProperty(exports, "__esModule", {\n  value: true\n});\n\nvar _name = require("./name.js");\n\nexports.default = "hello " + _name.name + "!";',
    mapping: { './name.js': 2 } 
  },
  { id: 2,
    filename: 'example\\name.js',
    dependencies: [],
    code: '"use strict";\n\nObject.defineProperty(exports, "__esModule", {\n  value: true\n});\nvar name = exports.name = \'world\';',
    mapping: {}
  }
]
```

### 1.2 打包

根据依赖图

```javascript
// 接受依赖图作为输入
function bundle(graph) {
  let modules = '';
  // 遍历依赖图，将依赖图转换为 js对象， key 是模块id， value组成是[ 模块定义code, 依赖描述mapping ]
  graph.forEach(mod => {
    // 模块定义code：使用commonjs模块系统: 接受require、module、exports作为输入.

    // 用stringify转化mapping字段，解析后如: {'./relative/path': 1}
    modules += `${mod.id}: [
      function (require, module, exports) { ${mod.code} },
      ${JSON.stringify(mod.mapping)},
    ],`;
  });

  // 通过上面的code，我们将依赖图中的木块都定义成了commonjs模块，而且记录了对应模块的依赖项，方便记载时查找依赖
  // 最后我们需要一个自执行函数，从入口开始加载：假设加载函数是require，入口模块id必然为0，因此，调用require(0)即可；
  // 但是commonjs当中的接收的require可不是通过id来加载的，而是相对路径，这个时候需要通过mapping做映射，同时定义localRequire作为commonjs的require入参；
  
  const result = `
    (function(modules) {
      function require(id) {
        const [fn, mapping] = modules[id];

        function localRequire(name) {
          return require(mapping[name]);
        }

        const module = { exports : {} };

        fn(localRequire, module, module.exports); 

        return module.exports;
      }

      require(0);
    })({${modules}})
  `;
  return result;
}

```

最后得到的js代码如下：

```javascript
(function(modules) {
    function require(id) {
        const [fn, mapping] = modules[id];

        function localRequire(name) {
          return require(mapping[name]);
        }

        const module = { exports : {} };

        fn(localRequire, module, module.exports);

        return module.exports;
    }

    require(0);

})(
    {
        0: [
                function (require, module, exports) { "use strict";

                    var _message = require("./message.js");

                    var _message2 = _interopRequireDefault(_message);

                    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

                    console.log(_message2.default); 
                },
                {
                    "./message.js":1
                },
        ],
        1: [
                function (require, module, exports) { "use strict";

                    Object.defineProperty(exports, "__esModule", {
                      value: true
                    });

                    var _name = require("./name.js");

                    exports.default = "hello " + _name.name + "!"; 
                },
                {
                    "./name.js":2
                },
        ],
        2: [
                function (require, module, exports) { "use strict";

                    Object.defineProperty(exports, "__esModule", {
                      value: true
                    });
                    var name = exports.name = 'world';
                },
                {}
        ]
    }
)

```

### 1.3 loader & plugin

#### 生命周期

![avatar](./static/lifeCycle.jpg)

#### diff

+ loader 让 webpack 能够去处理那些非 JavaScript 文件（webpack 自身只理解 JavaScript）。loader 可以将所有类型的文件转换为 webpack 能够处理的有效模块，然后你就可以利用 webpack 的打包能力，对它们进行处理。

+ 插件的范围包括，从打包优化和压缩，一直到重新定义环境中的变量。插件接口功能极其强大，可以用来处理各种各样的任务。

[plugin hooks](https://webpack.docschina.org/api/plugins/#tapable)
  
**The difference between a plugin and a loader is that a loader can only transform a single file just before it’s added to the dependency graph.**

## 2. 配置

## 3. webpack  5

+ 持久缓存（Persistent Caching）
    开发调试过程编译速度加快： 当检测到某个文件变化时，依照“依赖图”，只对修改过的文件进行编译，从而大幅提高了编译速度。

+ 命名IDs
    命名chunk id算法，编译后的chunk名称可读性大大加强。模块ID(Module ID)由其相对于上下文的路径而确定，代码块ID(Chunk ID)由其内容来决定。

    chunkIds: "deterministic”,
moduleIds: “deterministic"
+ NodeJS的polyfill脚本被移除

    最开始，webpack的目标是允许在浏览器中运行大多数的Node模块，但是现在模块格局已经发生了重大变化，现在有很多模块是专门为前端开发的。在v4及以前的版本中，对于大多数的Node模块将自动添加polyfill脚本（腻子脚本）。

然而，这些大量繁杂的脚本都会添加到最终编译的代码中(bundle)，但其实通常情况下是没有必要的。在v5版本中将尝试停止自动地添加polyfill脚本，转而专注于前端兼容模块。

+ 废弃了一些特性

## 4. demo

### 4.1 打包输出

