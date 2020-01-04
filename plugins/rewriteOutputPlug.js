const pluginName = 'rewriteOutputPlug';
class rewriteOutputPlug {
    constructor(option) {
        this.option = option;
    }
    apply(compiler) {
        if (this.option && this.option.name) {
            compiler.hooks.make.tap(pluginName, (compilation, callback) => {
                compilation.outputOptions.filename = this.option.name + '.js';
                console.log(
                    compilation.outputOptions
                );
            });
        }
    }
}

module.exports = rewriteOutputPlug;