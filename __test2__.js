const gl = document.querySelector('canvas').getContext('webgl');
const ext = gl.getExtension('ANGLE_instanced_arrays');
if (!ext) alert('need ANGLE_instanced_arrays');

const vs = `
attribute vec2 position;
attribute vec2 uv;
attribute vec2 offset;    // instanced
attribute vec2 scale;     // instanced
attribute vec2 uvOffset;  // instanced
attribute vec2 uvScale;   // instanced

uniform mat4 matrix;

varying vec2 v_uv;

void main() {
  gl_Position = matrix * vec4(position * scale + offset, 0, 1);
  
  v_uv = uv * uvScale + uvOffset;
}
`;

const fs = `
precision highp float;
varying vec2 v_uv;
uniform sampler2D spriteAtlas;

void main() {
  gl_FragColor = texture2D(spriteAtlas, v_uv);
}
`;

const program = twgl.createProgram(gl, [vs, fs]);
const positionLoc = gl.getAttribLocation(program, 'position');
const uvLoc = gl.getAttribLocation(program, 'uv');
const offsetLoc = gl.getAttribLocation(program, 'offset');
const scaleLoc = gl.getAttribLocation(program, 'scale');
const uvOffsetLoc = gl.getAttribLocation(program, 'uvOffset');
const uvScaleLoc = gl.getAttribLocation(program, 'uvScale');
const matrixLoc = gl.getUniformLocation(program, 'matrix');

// setup quad positions and uv
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    0, 0,
    1, 0,
    0, 1,
    0, 1,
    1, 0,
    1, 1,
]), gl.STATIC_DRAW);

const uvBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    0, 0,
    1, 0,
    0, 1,
    0, 1,
    1, 0,
    1, 1,
]), gl.STATIC_DRAW);


// create typed array for instanced data
const maxSprites = 1000;
const offsets = new Float32Array(maxSprites * 2);
const scales = new Float32Array(maxSprites * 2);
const uvOffsets = new Float32Array(maxSprites * 2);
const uvScales = new Float32Array(maxSprites * 2);

// create buffers fo instanced data
const offsetBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, offsetBuffer);
gl.bufferData(gl.ARRAY_BUFFER, offsets.byteLength, gl.DYNAMIC_DRAW);
const scaleBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, scaleBuffer);
gl.bufferData(gl.ARRAY_BUFFER, scales.byteLength, gl.DYNAMIC_DRAW);
const uvOffsetBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, uvOffsetBuffer);
gl.bufferData(gl.ARRAY_BUFFER, uvOffsets.byteLength, gl.DYNAMIC_DRAW);
const uvScaleBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, uvScaleBuffer);
gl.bufferData(gl.ARRAY_BUFFER, uvScales.byteLength, gl.DYNAMIC_DRAW);

let spriteNdx = 0;
function addSprite(
    spriteAtlasWidth, spriteAtlasHeight,
    srcX, srcY, srcWidth, srcHeight,
    dstX, dstY, dstWidth, dstHeight) {
    const off0 = spriteNdx * 2;
    const off1 = off0 + 1;
    offsets[off0] = dstX;
    offsets[off1] = dstY;
    scales[off0] = dstWidth;
    scales[off1] = dstHeight;
    uvOffsets[off0] = srcX / spriteAtlasWidth;
    uvOffsets[off1] = srcY / spriteAtlasHeight;
    uvScales[off0] = srcWidth / spriteAtlasWidth;
    uvScales[off1] = srcHeight / spriteAtlasHeight;
    ++spriteNdx;
}

const sprites = [
    {msg: 'A', x: 0,  y:  0, w: 64, h: 32, bg: 'red',    fg: 'yellow'},
    {msg: 'B', x: 64, y:  0, w: 64, h: 32, bg: 'blue',   fg: 'white' },
    {msg: 'C', x: 0,  y: 32, w: 40, h: 32, bg: 'green',  fg: 'pink'  },
    {msg: 'D', x: 40, y: 32, w: 48, h: 32, bg: 'purple', fg: 'cyan'  },
    {msg: 'F', x: 88, y: 32, w: 40, h: 32, bg: 'black',  fg: 'red'   },
];

// make 5 sprites in an atlas
const spriteAtlasWidth = 128;
const spriteAtlasHeight = 64;
const ctx = document.createElement('canvas').getContext('2d');
ctx.canvas.width = spriteAtlasWidth;
ctx.canvas.height = spriteAtlasHeight;
for (const spr of sprites) {
    ctx.fillStyle = spr.bg;
    ctx.fillRect(spr.x, spr.y, spr.w, spr.h);
    ctx.strokeStyle = spr.fg;
    ctx.strokeRect(spr.x + .5, spr.y + .5, spr.w - 1, spr.h - 1);
    ctx.fillStyle = spr.fg;
    ctx.font = 'bold 26px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(spr.msg, spr.x + spr.w / 2, spr.y + spr.h / 2);
}
// show the atlas
document.body.appendChild(ctx.canvas);

// copy the atlas to a texture
const tex = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, tex);
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, ctx.canvas);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);


function render(time) {
    time *= 0.001;  // convert to seconds

    spriteNdx = 0;
    const numSprites = 10;
    for (let i = 0; i < numSprites; ++i) {
        const sp = sprites[i % sprites.length];
        addSprite(
            spriteAtlasWidth, spriteAtlasHeight,
            sp.x, sp.y, sp.w, sp.h,
            Math.sin(time + i * 15) * gl.canvas.width / 2 + gl.canvas.width / 2,
            Math.cos(time + i * 17) * gl.canvas.height / 2 + gl.canvas.height / 2,
            sp.w, sp.h,
        );
    }

    // copy the latest sprite instance data
    // to their respective buffers and setup
    // the attributes.
    // NOTE: for the attributes it would be better
    // to use a vertex array

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.enableVertexAttribArray(uvLoc);
    gl.vertexAttribPointer(uvLoc, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, offsetBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, offsets);
    gl.enableVertexAttribArray(offsetLoc);
    gl.vertexAttribPointer(offsetLoc, 2, gl.FLOAT, false, 0, 0);

    ext.vertexAttribDivisorANGLE(offsetLoc, 1);
    gl.bindBuffer(gl.ARRAY_BUFFER, scaleBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, scales);
    gl.enableVertexAttribArray(scaleLoc);
    gl.vertexAttribPointer(scaleLoc, 2, gl.FLOAT, false, 0, 0);

    ext.vertexAttribDivisorANGLE(scaleLoc, 1);
    gl.bindBuffer(gl.ARRAY_BUFFER, uvOffsetBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, uvOffsets);
    gl.enableVertexAttribArray(uvOffsetLoc);
    gl.vertexAttribPointer(uvOffsetLoc, 2, gl.FLOAT, false, 0, 0);
    ext.vertexAttribDivisorANGLE(uvOffsetLoc, 1);

    gl.bindBuffer(gl.ARRAY_BUFFER, uvScaleBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, uvScales);
    gl.enableVertexAttribArray(uvScaleLoc);
    gl.vertexAttribPointer(uvScaleLoc, 2, gl.FLOAT, false, 0, 0);
    ext.vertexAttribDivisorANGLE(uvScaleLoc, 1);

    gl.useProgram(program);
    // pass in a projection matrix that
    // converts to pixel space so the top
    // left corner is 0,0 and the bottom right corner
    // is canvas.width, canvas.height
    //
    // if you had a 3d math library this would be something like
    // m4.ortho(0, gl.canvas.width, gl.canvas.height, 0, -1, 1);
    gl.uniformMatrix4fv(matrixLoc, false, [
        2 / gl.canvas.width, 0, 0, 0,
        0, -2 / gl.canvas.height, 0, 0,
        0, 0, 1, 0,
        -1, 1, 0, 1,
    ]);
    // note as there as only 1 texture and
    // uniforms default to 0 we don't need to
    // bind the texture to setup a uniform
    // as the defaults happen to work.
    ext.drawArraysInstancedANGLE(gl.TRIANGLES, 0, 6,/* verts per instance*/ spriteNdx,/* num instances*/);
    requestAnimationFrame(render);
}
requestAnimationFrame(render);


