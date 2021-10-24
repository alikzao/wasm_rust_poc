extern crate wasm_bindgen;
// use crate::shader::Shader;
// use crate::shader::ShaderKind;
// use crate::State;

// use js_sys::WebAssembly;
use wasm_bindgen::prelude::*;

use std::rc::Rc;
use web_sys::*;
//use console_error_panic_hook;
use std::cell::RefCell;
use wasm_bindgen::JsCast;
use web_sys::HtmlImageElement;
// use web_sys::WebGlRenderingContext;
use web_sys::WebGlRenderingContext as GL;

pub static CANVAS_WIDTH: i32 = 1000;
pub static CANVAS_HEIGHT: i32 = 800;

#[wasm_bindgen]
extern "C" {
    pub fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet(name: &str) {
    alert(&format!("Hello, {}!", name));
    //let gl = &self.gl;
    // let app = Rc::new(App::new());
    // let gl = Rc::new(create_webgl_context(Rc::clone(&app)).unwrap());
    // load_texture_image(_gl, "./atlas.png.png");
    // let shader_program = init_shaders(&_gl);
    main();
}

fn get_shader(gl: &GL, shader_type: u32, source: &str) -> WebGlShader {
    let shader = gl.create_shader(shader_type).unwrap();
    gl.shader_source(&shader, source);
    gl.compile_shader(&shader);
    shader
}

fn set_rectangle(gl: &GL, x: f32, y: f32, width: f32, height: f32) {
    let x1 = x;
    let x2 = x + width;
    let y1 = y;
    let y2 = y + height;
    #[rustfmt::skip]
    let vertices = [
        x1, y1, 
        x2, y1, 
        x1, y2, 
        x1, y2, 
        x2, y1, 
        x2, y2,
    ];
    let data_array = unsafe { js_sys::Float32Array::view(&vertices) };
    gl.buffer_data_with_array_buffer_view(GL::ARRAY_BUFFER, &data_array, GL::STATIC_DRAW);
}

fn main() {
    let image = Rc::new(RefCell::new(HtmlImageElement::new().unwrap()));
    let onload = Closure::wrap(Box::new({
        let image = image.clone();
        move || {
            render(&image.borrow());
        }
    }) as Box<dyn Fn()>);
    let image = image.borrow_mut();
    image.set_onload(Some(onload.as_ref().unchecked_ref()));
    image.set_src("./atlas.png.png");
    onload.forget();
}

fn render(image: &HtmlImageElement) {
    let canvas = get_canvas("canvas");
    let gl = get_context(&canvas);
    let program = gl.create_program().unwrap();
    gl.attach_shader(&program, &get_shader(&gl, GL::VERTEX_SHADER, VERTEX_SHADER)); //GL::VERTEX_SHADER,
    gl.attach_shader(
        &program,
        &get_shader(&gl, GL::FRAGMENT_SHADER, FRAGMENT_SHADER),
    ); //GL::FRAGMENT_SHADER
    gl.link_program(&program);
    let position_location = gl.get_attrib_location(&program, "a_position");
    let texcoord_location = gl.get_attrib_location(&program, "a_texCoord");

    let position_buffer = gl.create_buffer().unwrap();
    gl.bind_buffer(GL::ARRAY_BUFFER, Some(&position_buffer));

    set_rectangle(&gl, 0.0, 0.0, 500.0, 500.0); // !!!

    let texcoord_buffer = gl.create_buffer().unwrap();
    gl.bind_buffer(GL::ARRAY_BUFFER, Some(&texcoord_buffer));
    #[rustfmt::skip]
    let vertices = &[
        0.0,  0.0,
        1.0,  0.0,
        0.0,  1.0,
        0.0,  1.0,
        1.0,  0.0,
        1.0,  1.0,
    ];
    let data_array = unsafe { js_sys::Float32Array::view(vertices) };
    gl.buffer_data_with_array_buffer_view(GL::ARRAY_BUFFER, &data_array, GL::STATIC_DRAW);
    // ----
    let texture = gl.create_texture();
    gl.bind_texture(GL::TEXTURE_2D, texture.as_ref());
    gl.tex_parameteri(GL::TEXTURE_2D, GL::TEXTURE_WRAP_S, GL::CLAMP_TO_EDGE as i32);
    gl.tex_parameteri(GL::TEXTURE_2D, GL::TEXTURE_WRAP_T, GL::CLAMP_TO_EDGE as i32);
    gl.tex_parameteri(GL::TEXTURE_2D, GL::TEXTURE_MIN_FILTER, GL::NEAREST as i32);
    gl.tex_parameteri(GL::TEXTURE_2D, GL::TEXTURE_MAG_FILTER, GL::NEAREST as i32);
    #[rustfmt::skip]
    gl.tex_image_2d_with_u32_and_u32_and_image(GL::TEXTURE_2D, 0, GL::RGBA as i32, GL::RGBA, GL::UNSIGNED_BYTE, &image).expect("Texture image 2d");
    let resolution_location = gl.get_uniform_location(&program, "u_resolution");
    resize_canvas(canvas, &gl);
    // lookup uniforms
    gl.use_program(Some(&program));
    gl.enable_vertex_attrib_array(position_location as u32);
    // Bind the position buffer.
    gl.bind_buffer(GL::ARRAY_BUFFER, Some(&position_buffer));
    // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    gl.vertex_attrib_pointer_with_i32(position_location as u32, 2, GL::FLOAT, false, 0, 0);
    // Turn on the texcoord attribute
    gl.enable_vertex_attrib_array(texcoord_location as u32);
    // bind the texcoord buffer.
    gl.bind_buffer(GL::ARRAY_BUFFER, Some(&texcoord_buffer));
    // Tell the texcoord attribute how to get data out of texcoordBuffer (ARRAY_BUFFER)
    gl.vertex_attrib_pointer_with_i32(texcoord_location as u32, 2, GL::FLOAT, false, 0, 0);
    // set the resolution
    gl.uniform2f(resolution_location.as_ref(), 1000.0, 500.0);
    // Draw the rectangle.
    gl.draw_arrays(GL::TRIANGLES, 0, 6);
}
static FRAGMENT_SHADER: &'static str = r#"
precision mediump float;

// our texture
uniform sampler2D u_image;

// the texCoords passed in from the vertex shader.
varying vec2 v_texCoord;

void main() {
   gl_FragColor = texture2D(u_image, v_texCoord);
}
"#;

static VERTEX_SHADER: &'static str = r#"
attribute vec2 a_position;
attribute vec2 a_texCoord;

uniform vec2 u_resolution;

varying vec2 v_texCoord;

void main() {
   // convert the rectangle from pixels to 0.0 to 1.0
   vec2 zeroToOne = a_position / u_resolution;

   // convert from 0->1 to 0->2
   vec2 zeroToTwo = zeroToOne * 2.0;

   // convert from 0->2 to -1->+1 (clipspace)
   vec2 clipSpace = zeroToTwo - 1.0;

   gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);

   // pass the texCoord to the fragment shader
   // The GPU will interpolate this value between points.
   v_texCoord = a_texCoord;
}
"#;

fn get_canvas(id: &str) -> HtmlCanvasElement {
    let document = web_sys::window().unwrap().document().unwrap();
    let canvas = document.get_element_by_id(id).unwrap().dyn_into::<web_sys::HtmlCanvasElement>().unwrap();
    canvas
}

fn get_context(canvas: &HtmlCanvasElement)  -> WebGlRenderingContext {
    let context = canvas.get_context("webgl").unwrap().unwrap().dyn_into::<WebGlRenderingContext>().unwrap();
    context
}

fn resize_canvas(canvas: HtmlCanvasElement, gl: &WebGlRenderingContext){
    canvas.set_width(CANVAS_WIDTH as u32);
    canvas.set_height(CANVAS_HEIGHT as u32);
    gl.viewport(0, 0, canvas.width() as i32, canvas.height() as i32);
    gl.clear_color(0.53, 0.8, 0.98, 1.);
    gl.clear(GL::COLOR_BUFFER_BIT | GL::DEPTH_BUFFER_BIT);
}

fn resize_canvas1(canvas: HtmlCanvasElement, gl: &WebGlRenderingContext){
    let offset_width = canvas.offset_width() as u32;
    let offset_height = canvas.offset_height() as u32;
    let width = canvas.width();
    let height = canvas.height();
    let (diff_width, diff_height) = (width != offset_width, height != offset_height);
    if diff_width {
        canvas.set_width(offset_width);
    }
    if diff_height {
        canvas.set_height(offset_height);
    }
    // if diff_width || diff_height {
        // canvas.resize(offset_width, offset_height); // NOT COMPILE
        // canvas.onresize();
    // }
    gl.viewport(0, 0, canvas.width() as i32, canvas.height() as i32);
    gl.clear_color(0.53, 0.8, 0.98, 1.);
    gl.clear(GL::COLOR_BUFFER_BIT | GL::DEPTH_BUFFER_BIT);
}



