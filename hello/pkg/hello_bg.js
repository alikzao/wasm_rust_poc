import * as wasm from './hello_bg.wasm';

const heap = new Array(32).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

let WASM_VECTOR_LEN = 0;

let cachegetUint8Memory0 = null;
function getUint8Memory0() {
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory0;
}

let cachedTextEncoder = new TextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length);
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len);

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3);
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachegetInt32Memory0 = null;
function getInt32Memory0() {
    if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) {
        cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachegetInt32Memory0;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

function makeClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        try {
            return f(state.a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_2.get(state.dtor)(state.a, state.b);
                state.a = 0;

            }
        }
    };
    real.original = state;

    return real;
}
function __wbg_adapter_14(arg0, arg1) {
    wasm._dyn_core__ops__function__Fn_____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h0df79314967ecf37(arg0, arg1);
}

/**
* @param {string} name
*/
export function greet(name) {
    var ptr0 = passStringToWasm0(name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    wasm.greet(ptr0, len0);
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        wasm.__wbindgen_exn_store(addHeapObject(e));
    }
}

export function __wbindgen_object_drop_ref(arg0) {
    takeObject(arg0);
};

export function __wbg_alert_8b1e92fa5b69a044(arg0, arg1) {
    alert(getStringFromWasm0(arg0, arg1));
};

export function __wbg_instanceof_Window_c4b70662a0d2c5ec(arg0) {
    var ret = getObject(arg0) instanceof Window;
    return ret;
};

export function __wbg_document_1c64944725c0d81d(arg0) {
    var ret = getObject(arg0).document;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};

export function __wbg_getElementById_f3e94458ce77f0d0(arg0, arg1, arg2) {
    var ret = getObject(arg0).getElementById(getStringFromWasm0(arg1, arg2));
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};

export function __wbg_instanceof_WebGlRenderingContext_101b938bec1286a3(arg0) {
    var ret = getObject(arg0) instanceof WebGLRenderingContext;
    return ret;
};

export function __wbg_bufferData_6beb22ecb30c1316(arg0, arg1, arg2, arg3) {
    getObject(arg0).bufferData(arg1 >>> 0, getObject(arg2), arg3 >>> 0);
};

export function __wbg_texImage2D_5ca3c9c359bb4b3b() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
    getObject(arg0).texImage2D(arg1 >>> 0, arg2, arg3, arg4 >>> 0, arg5 >>> 0, getObject(arg6));
}, arguments) };

export function __wbg_attachShader_eaa824fd5b37a770(arg0, arg1, arg2) {
    getObject(arg0).attachShader(getObject(arg1), getObject(arg2));
};

export function __wbg_bindBuffer_2ca7e1c18819ecb2(arg0, arg1, arg2) {
    getObject(arg0).bindBuffer(arg1 >>> 0, getObject(arg2));
};

export function __wbg_bindTexture_edd827f3dba6038e(arg0, arg1, arg2) {
    getObject(arg0).bindTexture(arg1 >>> 0, getObject(arg2));
};

export function __wbg_clear_da26620d46f0a11a(arg0, arg1) {
    getObject(arg0).clear(arg1 >>> 0);
};

export function __wbg_clearColor_cbf22f8faa5a52c1(arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).clearColor(arg1, arg2, arg3, arg4);
};

export function __wbg_compileShader_8fb70a472f32552c(arg0, arg1) {
    getObject(arg0).compileShader(getObject(arg1));
};

export function __wbg_createBuffer_4802e2f0e1b1acdf(arg0) {
    var ret = getObject(arg0).createBuffer();
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};

export function __wbg_createProgram_b1d94f4c7554d3a1(arg0) {
    var ret = getObject(arg0).createProgram();
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};

export function __wbg_createShader_da09e167692f0dc7(arg0, arg1) {
    var ret = getObject(arg0).createShader(arg1 >>> 0);
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};

export function __wbg_createTexture_bafc7c08393ae59d(arg0) {
    var ret = getObject(arg0).createTexture();
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};

export function __wbg_drawArrays_deb0ae940b2e372b(arg0, arg1, arg2, arg3) {
    getObject(arg0).drawArrays(arg1 >>> 0, arg2, arg3);
};

export function __wbg_enableVertexAttribArray_d539e547495bea44(arg0, arg1) {
    getObject(arg0).enableVertexAttribArray(arg1 >>> 0);
};

export function __wbg_getAttribLocation_706a0beabcdaebcf(arg0, arg1, arg2, arg3) {
    var ret = getObject(arg0).getAttribLocation(getObject(arg1), getStringFromWasm0(arg2, arg3));
    return ret;
};

export function __wbg_getUniformLocation_c3b3570b4632cc5c(arg0, arg1, arg2, arg3) {
    var ret = getObject(arg0).getUniformLocation(getObject(arg1), getStringFromWasm0(arg2, arg3));
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};

export function __wbg_linkProgram_7080c84b0233cea2(arg0, arg1) {
    getObject(arg0).linkProgram(getObject(arg1));
};

export function __wbg_shaderSource_67b991301db003d0(arg0, arg1, arg2, arg3) {
    getObject(arg0).shaderSource(getObject(arg1), getStringFromWasm0(arg2, arg3));
};

export function __wbg_texParameteri_bd724f6a5ad0cbbc(arg0, arg1, arg2, arg3) {
    getObject(arg0).texParameteri(arg1 >>> 0, arg2 >>> 0, arg3);
};

export function __wbg_uniform2f_c4c110dee7f069e7(arg0, arg1, arg2, arg3) {
    getObject(arg0).uniform2f(getObject(arg1), arg2, arg3);
};

export function __wbg_useProgram_b72b0bfcbc720fa9(arg0, arg1) {
    getObject(arg0).useProgram(getObject(arg1));
};

export function __wbg_vertexAttribPointer_b5cb524c6fe9eec8(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
    getObject(arg0).vertexAttribPointer(arg1 >>> 0, arg2, arg3 >>> 0, arg4 !== 0, arg5, arg6);
};

export function __wbg_viewport_89af3aceb7036a2c(arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).viewport(arg1, arg2, arg3, arg4);
};

export function __wbg_offsetWidth_69cd6669725b154f(arg0) {
    var ret = getObject(arg0).offsetWidth;
    return ret;
};

export function __wbg_offsetHeight_8da312843e7777ab(arg0) {
    var ret = getObject(arg0).offsetHeight;
    return ret;
};

export function __wbg_setonload_2a9b922c65b0f6ae(arg0, arg1) {
    getObject(arg0).onload = getObject(arg1);
};

export function __wbg_setsrc_3eb04f553f8335c7(arg0, arg1, arg2) {
    getObject(arg0).src = getStringFromWasm0(arg1, arg2);
};

export function __wbg_width_dd6eae8d0018c715(arg0) {
    var ret = getObject(arg0).width;
    return ret;
};

export function __wbg_height_15afde5f8e06de94(arg0) {
    var ret = getObject(arg0).height;
    return ret;
};

export function __wbg_new_265b3e027a3022bd() { return handleError(function () {
    var ret = new Image();
    return addHeapObject(ret);
}, arguments) };

export function __wbg_instanceof_HtmlCanvasElement_25d964a0dde6717e(arg0) {
    var ret = getObject(arg0) instanceof HTMLCanvasElement;
    return ret;
};

export function __wbg_width_555f63ab09ba7d3f(arg0) {
    var ret = getObject(arg0).width;
    return ret;
};

export function __wbg_setwidth_c1a7061891b71f25(arg0, arg1) {
    getObject(arg0).width = arg1 >>> 0;
};

export function __wbg_height_7153faec70fbaf7b(arg0) {
    var ret = getObject(arg0).height;
    return ret;
};

export function __wbg_setheight_88894b05710ff752(arg0, arg1) {
    getObject(arg0).height = arg1 >>> 0;
};

export function __wbg_getContext_f701d0231ae22393() { return handleError(function (arg0, arg1, arg2) {
    var ret = getObject(arg0).getContext(getStringFromWasm0(arg1, arg2));
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
}, arguments) };

export function __wbg_newnoargs_be86524d73f67598(arg0, arg1) {
    var ret = new Function(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
};

export function __wbg_call_888d259a5fefc347() { return handleError(function (arg0, arg1) {
    var ret = getObject(arg0).call(getObject(arg1));
    return addHeapObject(ret);
}, arguments) };

export function __wbindgen_object_clone_ref(arg0) {
    var ret = getObject(arg0);
    return addHeapObject(ret);
};

export function __wbg_self_c6fbdfc2918d5e58() { return handleError(function () {
    var ret = self.self;
    return addHeapObject(ret);
}, arguments) };

export function __wbg_window_baec038b5ab35c54() { return handleError(function () {
    var ret = window.window;
    return addHeapObject(ret);
}, arguments) };

export function __wbg_globalThis_3f735a5746d41fbd() { return handleError(function () {
    var ret = globalThis.globalThis;
    return addHeapObject(ret);
}, arguments) };

export function __wbg_global_1bc0b39582740e95() { return handleError(function () {
    var ret = global.global;
    return addHeapObject(ret);
}, arguments) };

export function __wbindgen_is_undefined(arg0) {
    var ret = getObject(arg0) === undefined;
    return ret;
};

export function __wbg_buffer_397eaa4d72ee94dd(arg0) {
    var ret = getObject(arg0).buffer;
    return addHeapObject(ret);
};

export function __wbg_newwithbyteoffsetandlength_8bd669b4092b7244(arg0, arg1, arg2) {
    var ret = new Float32Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);
    return addHeapObject(ret);
};

export function __wbindgen_debug_string(arg0, arg1) {
    var ret = debugString(getObject(arg1));
    var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};

export function __wbindgen_throw(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

export function __wbindgen_memory() {
    var ret = wasm.memory;
    return addHeapObject(ret);
};

export function __wbindgen_closure_wrapper71(arg0, arg1, arg2) {
    var ret = makeClosure(arg0, arg1, 14, __wbg_adapter_14);
    return addHeapObject(ret);
};

