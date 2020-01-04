class WelcomePlugin {
    constructor(option) {
        this.option = option;
    }
    apply(compiler) {
        compiler.hooks.done.tap('welcomePlugin', (
            stats /* 在 hook 被触及时，会将 stats 作为参数传入。 */
        ) => {
            console.log('WelcomePlugin!');
        });
    }
}

module.exports = WelcomePlugin;