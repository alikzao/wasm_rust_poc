/* tslint:disable */
import * as wasm from './hello_bg';

let cachedTextDecoder = new TextDecoder('utf-8');

let cachegetUint8Memory = null;
function getUint8Memory() {
    if (cachegetUint8Memory === null || cachegetUint8Memory.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory;
}

function getStringFromWasm(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory().subarray(ptr, ptr + len));
}

export function __wbg_alert_a552494a6f920a2c(arg0, arg1) {
    let varg0 = getStringFromWasm(arg0, arg1);
    alert(varg0);
}

let cachedTextEncoder = new TextEncoder('utf-8');

let WASM_VECTOR_LEN = 0;

function passStringToWasm(arg) {

    const buf = cachedTextEncoder.encode(arg);
    const ptr = wasm.__wbindgen_malloc(buf.length);
    getUint8Memory().set(buf, ptr);
    WASM_VECTOR_LEN = buf.length;
    return ptr;
}
/**
* @param {string} arg0
* @returns {void}
*/
export function greet(arg0) {
    const ptr0 = passStringToWasm(arg0);
    const len0 = WASM_VECTOR_LEN;
    try {
        return wasm.greet(ptr0, len0);

    } finally {
        wasm.__wbindgen_free(ptr0, len0 * 1);

    }

}

const heap = new Array(32);

heap.fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

const __widl_f_get_element_by_id_Document_target = typeof Document === 'undefined' ? null : Document.prototype.getElementById || function() {
    throw new Error(`wasm-bindgen: Document.getElementById does not exist`);
};

export function __widl_f_get_element_by_id_Document(arg0, arg1, arg2) {
    let varg1 = getStringFromWasm(arg1, arg2);

    const val = __widl_f_get_element_by_id_Document_target.call(getObject(arg0), varg1);
    return isLikeNone(val) ? 0 : addHeapObject(val);

}

export function __widl_instanceof_HTMLCanvasElement(idx) {
    return getObject(idx) instanceof HTMLCanvasElement ? 1 : 0;
}

const __widl_f_get_context_HTMLCanvasElement_target = typeof HTMLCanvasElement === 'undefined' ? null : HTMLCanvasElement.prototype.getContext || function() {
    throw new Error(`wasm-bindgen: HTMLCanvasElement.getContext does not exist`);
};

let cachegetUint32Memory = null;
function getUint32Memory() {
    if (cachegetUint32Memory === null || cachegetUint32Memory.buffer !== wasm.memory.buffer) {
        cachegetUint32Memory = new Uint32Array(wasm.memory.buffer);
    }
    return cachegetUint32Memory;
}

export function __widl_f_get_context_HTMLCanvasElement(arg0, arg1, arg2, exnptr) {
    let varg1 = getStringFromWasm(arg1, arg2);
    try {

        const val = __widl_f_get_context_HTMLCanvasElement_target.call(getObject(arg0), varg1);
        return isLikeNone(val) ? 0 : addHeapObject(val);

    } catch (e) {
        const view = getUint32Memory();
        view[exnptr / 4] = 1;
        view[exnptr / 4 + 1] = addHeapObject(e);

    }
}

function GetOwnOrInheritedPropertyDescriptor(obj, id) {
    while (obj) {
        let desc = Object.getOwnPropertyDescriptor(obj, id);
        if (desc) return desc;
        obj = Object.getPrototypeOf(obj);
    }
return {}
}

const __widl_f_width_HTMLCanvasElement_target = GetOwnOrInheritedPropertyDescriptor(typeof HTMLCanvasElement === 'undefined' ? null : HTMLCanvasElement.prototype, 'width').get || function() {
    throw new Error(`wasm-bindgen: HTMLCanvasElement.width does not exist`);
};

export function __widl_f_width_HTMLCanvasElement(arg0) {
    return __widl_f_width_HTMLCanvasElement_target.call(getObject(arg0));
}

const __widl_f_set_width_HTMLCanvasElement_target = GetOwnOrInheritedPropertyDescriptor(typeof HTMLCanvasElement === 'undefined' ? null : HTMLCanvasElement.prototype, 'width').set || function() {
    throw new Error(`wasm-bindgen: HTMLCanvasElement.width does not exist`);
};

export function __widl_f_set_width_HTMLCanvasElement(arg0, arg1) {
    __widl_f_set_width_HTMLCanvasElement_target.call(getObject(arg0), arg1);
}

const __widl_f_height_HTMLCanvasElement_target = GetOwnOrInheritedPropertyDescriptor(typeof HTMLCanvasElement === 'undefined' ? null : HTMLCanvasElement.prototype, 'height').get || function() {
    throw new Error(`wasm-bindgen: HTMLCanvasElement.height does not exist`);
};

export function __widl_f_height_HTMLCanvasElement(arg0) {
    return __widl_f_height_HTMLCanvasElement_target.call(getObject(arg0));
}

const __widl_f_set_height_HTMLCanvasElement_target = GetOwnOrInheritedPropertyDescriptor(typeof HTMLCanvasElement === 'undefined' ? null : HTMLCanvasElement.prototype, 'height').set || function() {
    throw new Error(`wasm-bindgen: HTMLCanvasElement.height does not exist`);
};

export function __widl_f_set_height_HTMLCanvasElement(arg0, arg1) {
    __widl_f_set_height_HTMLCanvasElement_target.call(getObject(arg0), arg1);
}

const __widl_f_set_onload_HTMLElement_target = GetOwnOrInheritedPropertyDescriptor(typeof HTMLElement === 'undefined' ? null : HTMLElement.prototype, 'onload').set || function() {
    throw new Error(`wasm-bindgen: HTMLElement.onload does not exist`);
};

export function __widl_f_set_onload_HTMLElement(arg0, arg1) {
    __widl_f_set_onload_HTMLElement_target.call(getObject(arg0), getObject(arg1));
}

export function __widl_f_new_Image(exnptr) {
    try {
        return addHeapObject(new Image());
    } catch (e) {
        const view = getUint32Memory();
        view[exnptr / 4] = 1;
        view[exnptr / 4 + 1] = addHeapObject(e);

    }
}

const __widl_f_set_src_HTMLImageElement_target = GetOwnOrInheritedPropertyDescriptor(typeof HTMLImageElement === 'undefined' ? null : HTMLImageElement.prototype, 'src').set || function() {
    throw new Error(`wasm-bindgen: HTMLImageElement.src does not exist`);
};

export function __widl_f_set_src_HTMLImageElement(arg0, arg1, arg2) {
    let varg1 = getStringFromWasm(arg1, arg2);
    __widl_f_set_src_HTMLImageElement_target.call(getObject(arg0), varg1);
}

export function __widl_instanceof_WebGLRenderingContext(idx) {
    return getObject(idx) instanceof WebGLRenderingContext ? 1 : 0;
}

const __widl_f_tex_image_2d_with_u32_and_u32_and_image_WebGLRenderingContext_target = typeof WebGLRenderingContext === 'undefined' ? null : WebGLRenderingContext.prototype.texImage2D || function() {
    throw new Error(`wasm-bindgen: WebGLRenderingContext.texImage2D does not exist`);
};

export function __widl_f_tex_image_2d_with_u32_and_u32_and_image_WebGLRenderingContext(arg0, arg1, arg2, arg3, arg4, arg5, arg6, exnptr) {
    try {
        __widl_f_tex_image_2d_with_u32_and_u32_and_image_WebGLRenderingContext_target.call(getObject(arg0), arg1, arg2, arg3, arg4, arg5, getObject(arg6));
    } catch (e) {
        const view = getUint32Memory();
        view[exnptr / 4] = 1;
        view[exnptr / 4 + 1] = addHeapObject(e);

    }
}

const __widl_f_active_texture_WebGLRenderingContext_target = typeof WebGLRenderingContext === 'undefined' ? null : WebGLRenderingContext.prototype.activeTexture || function() {
    throw new Error(`wasm-bindgen: WebGLRenderingContext.activeTexture does not exist`);
};

export function __widl_f_active_texture_WebGLRenderingContext(arg0, arg1) {
    __widl_f_active_texture_WebGLRenderingContext_target.call(getObject(arg0), arg1);
}

const __widl_f_bind_texture_WebGLRenderingContext_target = typeof WebGLRenderingContext === 'undefined' ? null : WebGLRenderingContext.prototype.bindTexture || function() {
    throw new Error(`wasm-bindgen: WebGLRenderingContext.bindTexture does not exist`);
};

export function __widl_f_bind_texture_WebGLRenderingContext(arg0, arg1, arg2) {
    __widl_f_bind_texture_WebGLRenderingContext_target.call(getObject(arg0), arg1, getObject(arg2));
}

const __widl_f_clear_WebGLRenderingContext_target = typeof WebGLRenderingContext === 'undefined' ? null : WebGLRenderingContext.prototype.clear || function() {
    throw new Error(`wasm-bindgen: WebGLRenderingContext.clear does not exist`);
};

export function __widl_f_clear_WebGLRenderingContext(arg0, arg1) {
    __widl_f_clear_WebGLRenderingContext_target.call(getObject(arg0), arg1);
}

const __widl_f_clear_color_WebGLRenderingContext_target = typeof WebGLRenderingContext === 'undefined' ? null : WebGLRenderingContext.prototype.clearColor || function() {
    throw new Error(`wasm-bindgen: WebGLRenderingContext.clearColor does not exist`);
};

export function __widl_f_clear_color_WebGLRenderingContext(arg0, arg1, arg2, arg3, arg4) {
    __widl_f_clear_color_WebGLRenderingContext_target.call(getObject(arg0), arg1, arg2, arg3, arg4);
}

const __widl_f_create_texture_WebGLRenderingContext_target = typeof WebGLRenderingContext === 'undefined' ? null : WebGLRenderingContext.prototype.createTexture || function() {
    throw new Error(`wasm-bindgen: WebGLRenderingContext.createTexture does not exist`);
};

export function __widl_f_create_texture_WebGLRenderingContext(arg0) {

    const val = __widl_f_create_texture_WebGLRenderingContext_target.call(getObject(arg0));
    return isLikeNone(val) ? 0 : addHeapObject(val);

}

const __widl_f_pixel_storei_WebGLRenderingContext_target = typeof WebGLRenderingContext === 'undefined' ? null : WebGLRenderingContext.prototype.pixelStorei || function() {
    throw new Error(`wasm-bindgen: WebGLRenderingContext.pixelStorei does not exist`);
};

export function __widl_f_pixel_storei_WebGLRenderingContext(arg0, arg1, arg2) {
    __widl_f_pixel_storei_WebGLRenderingContext_target.call(getObject(arg0), arg1, arg2);
}

const __widl_f_tex_parameteri_WebGLRenderingContext_target = typeof WebGLRenderingContext === 'undefined' ? null : WebGLRenderingContext.prototype.texParameteri || function() {
    throw new Error(`wasm-bindgen: WebGLRenderingContext.texParameteri does not exist`);
};

export function __widl_f_tex_parameteri_WebGLRenderingContext(arg0, arg1, arg2, arg3) {
    __widl_f_tex_parameteri_WebGLRenderingContext_target.call(getObject(arg0), arg1, arg2, arg3);
}

const __widl_f_viewport_WebGLRenderingContext_target = typeof WebGLRenderingContext === 'undefined' ? null : WebGLRenderingContext.prototype.viewport || function() {
    throw new Error(`wasm-bindgen: WebGLRenderingContext.viewport does not exist`);
};

export function __widl_f_viewport_WebGLRenderingContext(arg0, arg1, arg2, arg3, arg4) {
    __widl_f_viewport_WebGLRenderingContext_target.call(getObject(arg0), arg1, arg2, arg3, arg4);
}

export function __widl_instanceof_Window(idx) {
    return getObject(idx) instanceof Window ? 1 : 0;
}

export function __widl_f_document_Window(arg0) {

    const val = getObject(arg0).document;
    return isLikeNone(val) ? 0 : addHeapObject(val);

}

export function __wbg_newnoargs_6a80f84471205fc8(arg0, arg1) {
    let varg0 = getStringFromWasm(arg0, arg1);
    return addHeapObject(new Function(varg0));
}

export function __wbg_call_582b20dfcad7fee4(arg0, arg1, exnptr) {
    try {
        return addHeapObject(getObject(arg0).call(getObject(arg1)));
    } catch (e) {
        const view = getUint32Memory();
        view[exnptr / 4] = 1;
        view[exnptr / 4 + 1] = addHeapObject(e);

    }
}

export function __wbindgen_object_clone_ref(idx) {
    return addHeapObject(getObject(idx));
}

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

export function __wbindgen_object_drop_ref(i) { dropObject(i); }

export function __wbindgen_number_get(n, invalid) {
    let obj = getObject(n);
    if (typeof(obj) === 'number') return obj;
    getUint8Memory()[invalid] = 1;
    return 0;
}

export function __wbindgen_is_null(idx) {
    return getObject(idx) === null ? 1 : 0;
}

export function __wbindgen_is_undefined(idx) {
    return getObject(idx) === undefined ? 1 : 0;
}

export function __wbindgen_boolean_get(i) {
    let v = getObject(i);
    if (typeof(v) === 'boolean') {
        return v ? 1 : 0;
    } else {
        return 2;
    }
}

export function __wbindgen_is_symbol(i) {
    return typeof(getObject(i)) === 'symbol' ? 1 : 0;
}

export function __wbindgen_string_get(i, len_ptr) {
    let obj = getObject(i);
    if (typeof(obj) !== 'string') return 0;
    const ptr = passStringToWasm(obj);
    getUint32Memory()[len_ptr / 4] = WASM_VECTOR_LEN;
    return ptr;
}

export const __wbindgen_cb_forget = dropObject;

export function __wbindgen_closure_wrapper11(a, b, _ignored) {
    const f = wasm.__wbg_function_table.get(13);
    const d = wasm.__wbg_function_table.get(14);
    const cb = function() {
        this.cnt++;
        try {
            return f(this.a, b);

        } finally {
            if (this.cnt-- == 1) d(this.a, b);

        }

    };
    cb.a = a;
    cb.cnt = 1;
    let real = cb.bind(cb);
    real.original = cb;
    return addHeapObject(real);
}

export function __wbindgen_throw(ptr, len) {
    throw new Error(getStringFromWasm(ptr, len));
}

