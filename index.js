//const js = import("./node_modules/@yournpmusername/hello-wasm/hello_wasm.js");
const js = import("./hello/pkg/hello.js");
js.then( js => {
    console.debug("test2 !!!!!!!!!!!!!!");
    js.greet("!!! WebAssembly !!!");
    /*const wasm_obj = new Object();
    render.start();
    let time = new Date.now();
    function render (){
        const dt = Date.now() - time;
        wasm_obj.update(dt);
        wasm_obj.render();
        window.requestAnimationFrame(render);
        time = new Date.now();
    }

    render();*/
});