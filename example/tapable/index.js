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
    run() {
        this.step1();
        this.asyncStep1()
        this.step2();
        this.step3();
    }
    step1() {
        // 触发对应hook
        console.log('tap step1');
        this.hooks.step1.call();
    }
    asyncStep1() {
        // this.hooks.asyncStep1.promise().then(() => {

        // })
        console.log('tap asyncStep1');
        this.hooks.asyncStep1.callAsync((err, data) => {
            //TODO
            console.log('所有asyncStep1的监听者回调完成:' , { err, data})
        })
    }
    step2() {
        // 触发对应hook
        console.log('tap step2');
    }
    step3() {
        // 触发对应hook
        console.log('tap step3');
        this.hooks.step3.call();
    }
}

// Test Code
const demo = new TapableDemo();
const nowDate = new Date();

// 调用tap方法注册一个consument
demo.hooks.step1.tap('watcher 1', () => {
    setTimeout(() => {
        console.log("watcher 1 监测到 step1 触发， ", `时间为${new Date() - nowDate}`);
    }, 100);
})
// 再添加一个
demo.hooks.step1.tap('watcher 2', () => {
    console.log("watcher 2 监测到 step1 触发，", `时间为${new Date() - nowDate}`);
});
demo.hooks.step3.tap('watcher 2', () => {
    console.log("watcher 2 监测到 step3 触发，", `时间为${new Date() - nowDate}`);
});

// 异步钩子
demo.hooks.asyncStep1.tapAsync('asyncWatcher 1', (callback) => {
    console.log("asyncWatcher 1 监测到 delay asyncStep1 触发，", `时间为${new Date() - nowDate}`);
    setTimeout(callback, 5000);
});

demo.hooks.asyncStep1.tap('asyncWatcher 1', () => {
    console.log("asyncWatcher 1 监测到 asyncStep1 触发，", `时间为${new Date() - nowDate}`);
});

demo.hooks.asyncStep1.tapAsync('asyncWatcher 2', (callback) => {
    console.log("asyncWatcher 2 监测到 asyncStep1 触发，", `时间为${new Date() - nowDate}`);
    setTimeout(callback, 3000);
});

demo.hooks.asyncStep1.tapPromise('asyncWatcher 1', () => {
    return new Promise((resolve, reject) => {
        setTimeout(function () {
            console.log("asyncWatcher 1 监测到 asyncStep1 触发，", `时间为${new Date() - nowDate}`)
            resolve('asyncWatcher 1 : asyncStep1 finished');
        }, 6000);
    });
});

demo.hooks.asyncStep1.tapPromise('asyncWatcher 2', () => {
    return new Promise((resolve, reject) => {
        setTimeout(function () {
            console.log("asyncWatcher 2 监测到 asyncStep1 触发，", `时间为${new Date() - nowDate}`)
            resolve('asyncWatcher 2 : asyncStep1 finished');
        }, 5000);
    });
});

// 调用
demo.run();
