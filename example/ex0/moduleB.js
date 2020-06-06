function b() {
    console.log("moduleB");
    require.ensure('./moduleA.js', (data) => {
        console.log('console', data)
    })
    return "this is ModuleB";
}
module.exports = b;