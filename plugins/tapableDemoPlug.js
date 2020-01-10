// tapable提供多种hook类型
const {
    SyncHook,
    SyncBailHook,
    SyncWaterfallHook,
    SyncLoopHook,
    AsyncParallelHook,
    AsyncParallelBailHook,
    AsyncSeriesHook,
    AsyncSeriesBailHook,
    AsyncSeriesWaterfallHook
} = require("tapable");

class TapableDemo {
    constructor() {
        // 定义可以订阅的hook名称及其类型
        this.hooks = {
            step1: new SyncHook(['params']),
            step3: new SyncHook(['params']),
            asyncStep1: new AsyncParallelHook(['param1', 'param2'])
        }
    }
    run(params) {
        this.step1(params);
        this.asyncStep1()
        this.step2(params);
        this.step3(params);
    }
    step1(params) {
        // 触发对应hook
        console.log('tap step1');
        this.hooks.step1.call(params);
    }
    asyncStep1(param1, param2) {
        // this.hooks.asyncStep1.promise(param1, param2).then(() => {

        // })
        this.hooks.asyncStep1.callAsync(param1, param2, (err, data) => {
            //TODO
        })
    }
    step2(params) {
        // 触发对应hook
        console.log('tap step2');
    }
    step3(params) {
        // 触发对应hook
        console.log('tap step3');
        this.hooks.step3.call(params);
    }
}

// Test Code
const demo = new TapableDemo();

// 调用tap方法注册一个consument
demo.hooks.step1.tap('watcher 1', (params) => {
    console.log("watcher 1 监测到 step1 触发， 参数为：", params)
})
// 再添加一个
demo.hooks.step1.tap('watcher 2', (params) => {
    console.log("watcher 1 监测到 step1 触发，参数为：", params)
})
demo.hooks.step3.tap('watcher 2', (params) => {
    console.log("watcher 2 监测到 step3 触发，参数为：", params)
})

// 异步钩子
demo.hooks.asyncStep1.tap('asyncWatcher', (param1, param2) => {
    console.log("asyncWatcher 2 监测到 asyncStep1 触发，参数为：", { param1, param2 })
})

demo.hooks.asyncStep1.tapAsync('asyncWatcher', (param1, param2, callback) => {
    console.log("asyncWatcher 2 监测到 asyncStep1 触发，参数为：", { param1, param2 })
    setTimeout(callback, 5000)
})

demo.hooks.asyncStep1.tapPromise('asyncWatcher', (param1, param2) => {
    console.log("asyncWatcher 2 监测到 asyncStep1 触发，参数为：", { param1, param2 })
    return new Promise((resolve, reject) => {
        setTimeout(function () {
            resolve();
        }, 6000)
    })
})


// 调用
demo.run({ name: 'tapable' })
