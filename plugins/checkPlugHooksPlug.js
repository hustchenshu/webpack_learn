const pluginName = 'checkPlugHooksPlug';
class checkPlugHooksPlug {
    apply(compiler) {
        let total = 0, taped = 0;
        for (const key of Object.keys(compiler.hooks)) {
            total++;
            // console.log(key);
            compiler.hooks[key].tap(pluginName, (compilation, callback) => {
                console.log(`${++taped} : webpack ${key}  tap！`);
            });
        }
        console.log(`total ${total} hooks available`)
    }
}

module.exports = checkPlugHooksPlug;