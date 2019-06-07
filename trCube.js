import { toRadian } from "gl-matrix/src/gl-matrix/common";

var gl;

function testGLError(functionLastCalled) {

    var lastError = gl.getError();

    if (lastError != gl.NO_ERROR) {
        alert(functionLastCalled + " failed (" + lastError + ")");
        return false;
    }

    return true;
}

function initialiseGL(canvas) {
    try {
 // Try to grab the standard context. If it fails, fallback to experimental
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        gl.viewport(0, 0, canvas.width, canvas.height);
    }
    catch (e) {
    }

    if (!gl) {
        alert("Unable to initialise WebGL. Your browser may not support it");
        return false;
    }

    return true;
}

function zoomValue(value){

	zoombit = value/100;
	document.getElementById("zoom").innerHTML = "Zoom in/out : " + zoombit;
	console.log(toRadian(value));
	
}	

function projectionValue(value){

	projectionbit = value/100;
	document.getElementById("projection").innerHTML = "projection : " + projectionbit;
}

function insertImage(){

	imagebit = 1;
}
function repeatImage(){

	repeatbit = 1;
}
function mirrorImage(){

	repeatbit =1;
	mirrorbit = 1;
}
function clampImage(){

	repeatbit =1;
	clampbit = 1;
}
function deleteImage(){

	deletebit = 1;
}

var shaderProgram;
var imagebit = 0;
var repeatbit = 0;
var clampbit = 0;
var mirrorbit = 0;
var deletebit = 0;
var zoombit = 5;
var projectionbit = 7;

function initialiseBuffer() {

	var texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
	// Fill the texture with a 1x1 blue pixel.
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
	new Uint8Array([0, 0, 255, 255]));
	// Asynchronously load an image
	var image = new Image();
	image.src = "  data:image/jpeg;base64,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";
		image.addEventListener('load', function() {
		// Now that the image has loaded make copy it to the texture.
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
		gl.generateMipmap(gl.TEXTURE_2D);
	});

	
	if(repeatbit == 1){	

		var vertexData = [
			-0.5, 0.5, 0.5,		1.0, 1.0, 1.0, 0.5,		0.0, 1.0,  0.0, 1.0, 0.0, //3
			0.5, 0.5, 0.5,		1.0, 1.0, 1.0, 0.5,		1.0, 1.0,  0.0, 1.0, 0.0, //1
			0.5, 0.5, -0.5,		1.0, 1.0, 1.0, 0.5,		1.0, 1.0,  0.0, 1.0, 0.0, //2
					
			-0.5, 0.5, 0.5,		1.0, 1.0, 1.0, 0.5,		0.0, 1.0,  0.0, 1.0, 0.0, //3
			0.5, 0.5, -0.5,		1.0, 1.0, 1.0, 0.5,		1.0, 1.0,  0.0, 1.0, 0.0, //2
			-0.5, 0.5, -0.5,	1.0, 1.0, 1.0, 0.5,		0.0, 1.0,  0.0, 1.0, 0.0, //4
			 
			0.5, 0.5, -0.5,		0.0, 0.0, 0.0, 0.5,		-1.0, -1.0,  0.0, 0.0, -1.0,	//2
			0.5, -0.5, -0.5,	0.0, 0.0, 0.0, 0.5,		2.0, -1.0,  0.0, 0.0, -1.0, 	//6
			-0.5,-0.5,-0.5,		0.0, 0.0, 0.0, 0.5,		2.0, 2.0,  0.0, 0.0, -1.0, 		//8 //뒷면
			   
			-0.5, 0.5, -0.5,	0.0, 0.0, 0.0, 0.5,		-1.0, 2.0,  0.0, 0.0, -1.0, //4
			0.5, 0.5, -0.5,		0.0, 0.0, 0.0, 0.5,		-1.0, -1.0,  0.0, 0.0, -1.0, //2
			-0.5,-0.5,-0.5,		0.0, 0.0, 0.0, 0.5,		2.0, 2.0,  0.0, 0.0, -1.0, //8
				
			0.5, -0.5, 0.5,		1.0, 0.5, 0.0, 0.5,		0.0, 1.0,  1.0, 0.0, 0.0, //5
			0.5, -0.5, -0.5,	1.0, 0.5, 0.0, 0.5,		0.0, 1.0,  1.0, 0.0, 0.0, //6
			0.5, 0.5, -0.5,		1.0, 0.5, 0.0, 0.5,		1.0, 1.0,  1.0, 0.0, 0.0, //2
	
			0.5, -0.5, 0.5,		1.0, 0.5, 0.0, 0.5,		0.0, 1.0,  1.0, 0.0, 0.0, //5
			0.5, 0.5, -0.5,		1.0, 0.5, 0.0, 0.5,		1.0, 1.0,  1.0, 0.0, 0.0, //2
			0.5, 0.5, 0.5,		1.0, 0.5, 0.0, 0.5,		1.0, 1.0,  1.0, 0.0, 0.0, //1
					 
			-0.5, 0.5, -0.5,	1.0, 0.0, 0.0, 0.5,		0.0, 1.0,  -1.0, 0.0, 0.0, //4
			-0.5,-0.5, -0.5,	1.0, 0.0, 0.0, 0.5,		0.0, 0.0,  -1.0, 0.0, 0.0, //8
			-0.5, -0.5, 0.5,	1.0, 0.0, 0.0, 0.5,		0.0, 0.0,  -1.0, 0.0, 0.0, //7
			
			-0.5, 0.5, 0.5,		1.0, 0.0, 0.0, 0.5,		0.0, 1.0,  -1.0, 0.0, 0.0,	//3
			-0.5, 0.5, -0.5,	1.0, 0.0, 0.0, 0.5,		0.0, 1.0,  -1.0, 0.0, 0.0,	//4
			-0.5, -0.5, 0.5,	1.0, 0.0, 0.0, 0.5,		0.0, 0.0,  -1.0, 0.0, 0.0,	//7
			
			-0.5, -0.5, 0.5,	0.0, 0.0, 1.0, 0.5,		2.0, 2.0,   0.0, 0.0, 1.0, //7
			0.5, -0.5, 0.5,		0.0, 0.0, 1.0, 0.5,		-1.0, 2.0,  0.0, 0.0, 1.0,  //5
			0.5, 0.5, 0.5,		0.0, 0.0, 1.0, 0.5,	    -1.0, -1.0,  0.0, 0.0, 1.0,  //1 // 앞면
					 
			-0.5, -0.5, 0.5,	0.0, 0.0, 1.0, 0.5,		2.0, 2.0,   0.0, 0.0, 1.0,   //7
			0.5, 0.5, 0.5,		0.0, 0.0, 1.0, 0.5,	    -1.0, -1.0,  0.0, 0.0, 1.0,	 //1
			-0.5, 0.5, 0.5,		0.0, 0.0, 1.0, 0.5,	    2.0,  -1.0,   0.0, 0.0, 1.0,  //3
			
			 0.5, -0.5, -0.5,	0.0, 1.0, 0.0, 0.5,		1.0, 0.0,   0.0, -1.0, 0.0,	//6
			 0.5, -0.5, 0.5,	0.0, 1.0, 0.0, 0.5,		1.0, 0.0,   0.0, -1.0, 0.0, //5
			-0.5, -0.5, 0.5,	0.0, 1.0, 0.0, 0.5,		0.0, 0.0,   0.0, -1.0, 0.0, //7
			
			-0.5,-0.5, -0.5,	0.0, 1.0, 0.0, 0.5,		0.0, 0.0,  0.0, -1.0, 0.0, 	//8
			 0.5, -0.5, -0.5,	0.0, 1.0, 0.0, 0.5,		1.0, 0.0,  0.0, -1.0, 0.0, 	//6
			-0.5, -0.5, 0.5,	0.0, 1.0, 0.0, 0.5,		0.0, 0.0,  0.0, -1.0, 0.0,	//7
		];
		if(clampbit == 1 ){
			gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
		}
		if(mirrorbit == 1){
			gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.MIRRORED_REPEAT);
			gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.MIRRORED_REPEAT);
		}
	}
	else {

  	  var vertexData = [
		-0.5, 0.5, 0.5,		1.0, 1.0, 1.0, 0.5,		0.0, 1.0,  0.0, 1.0, 0.0, //3
		0.5, 0.5, 0.5,		1.0, 1.0, 1.0, 0.5,		1.0, 1.0,  0.0, 1.0, 0.0, //1
		0.5, 0.5, -0.5,		1.0, 1.0, 1.0, 0.5,		1.0, 1.0,  0.0, 1.0, 0.0, //2

		-0.5, 0.5, 0.5,		1.0, 1.0, 1.0, 0.5,		0.0, 1.0,  0.0, 1.0, 0.0, //3
		0.5, 0.5, -0.5,		1.0, 1.0, 1.0, 0.5,		1.0, 1.0,  0.0, 1.0, 0.0, //2
		-0.5, 0.5, -0.5,	1.0, 1.0, 1.0, 0.5,		0.0, 1.0,  0.0, 1.0, 0.0, //4

		0.5, 0.5, -0.5,		0.0, 0.0, 0.0, 0.5,		0.0, 0.0,  0.0, 0.0, -1.0,	//2
		0.5, -0.5, -0.5,	0.0, 0.0, 0.0, 0.5,		1.0, 0.0,  0.0, 0.0, -1.0, 	//6
		-0.5,-0.5,-0.5,		0.0, 0.0, 0.0, 0.5,		1.0, 1.0,  0.0, 0.0, -1.0, 	//8 //뒷면

		-0.5, 0.5, -0.5,	0.0, 0.0, 0.0, 0.5,		0.0, 1.0,  0.0, 0.0, -1.0, //4
		0.5, 0.5, -0.5,		0.0, 0.0, 0.0, 0.5,		0.0, 0.0,  0.0, 0.0, -1.0, //2
		-0.5,-0.5,-0.5,		0.0, 0.0, 0.0, 0.5,		1.0, 1.0,  0.0, 0.0, -1.0, //8

		0.5, -0.5, 0.5,		1.0, 0.5, 0.0, 0.5,		0.0, 1.0,  1.0, 0.0, 0.0, //5
		0.5, -0.5, -0.5,	1.0, 0.5, 0.0, 0.5,		0.0, 1.0,  1.0, 0.0, 0.0, //6
		0.5, 0.5, -0.5,		1.0, 0.5, 0.0, 0.5,		1.0, 1.0,  1.0, 0.0, 0.0, //2		

		0.5, -0.5, 0.5,		1.0, 0.5, 0.0, 0.5,		0.0, 1.0,  1.0, 0.0, 0.0, //5
		0.5, 0.5, -0.5,		1.0, 0.5, 0.0, 0.5,		1.0, 1.0,  1.0, 0.0, 0.0, //2
		0.5, 0.5, 0.5,		1.0, 0.5, 0.0, 0.5,		1.0, 1.0,  1.0, 0.0, 0.0, //1

		-0.5, 0.5, -0.5,	1.0, 0.0, 0.0, 0.5,		0.0, 1.0,  -1.0, 0.0, 0.0, //4
		-0.5,-0.5, -0.5,	1.0, 0.0, 0.0, 0.5,		0.0, 0.0,  -1.0, 0.0, 0.0, //8
		-0.5, -0.5, 0.5,	1.0, 0.0, 0.0, 0.5,		0.0, 0.0,  -1.0, 0.0, 0.0, //7

		-0.5, 0.5, 0.5,		1.0, 0.0, 0.0, 0.5,		0.0, 1.0,  -1.0, 0.0, 0.0,	//3
		-0.5, 0.5, -0.5,	1.0, 0.0, 0.0, 0.5,		0.0, 1.0,  -1.0, 0.0, 0.0,	//4
		-0.5, -0.5, 0.5,	1.0, 0.0, 0.0, 0.5,		0.0, 0.0,  -1.0, 0.0, 0.0,	//7

		-0.5, -0.5, 0.5,	0.0, 0.0, 1.0, 0.5,		1.0, 1.0,   0.0, 0.0, 1.0, //7
		0.5, -0.5, 0.5,		0.0, 0.0, 1.0, 0.5,		0.0, 1.0,  0.0, 0.0, 1.0,  //5
		0.5, 0.5, 0.5,		0.0, 0.0, 1.0, 0.5,	    0.0, 0.0,  0.0, 0.0, 1.0,  //1 // 앞면

		-0.5, -0.5, 0.5,	0.0, 0.0, 1.0, 0.5,		1.0, 1.0,   0.0, 0.0, 1.0,   //7
		0.5, 0.5, 0.5,		0.0, 0.0, 1.0, 0.5,	    0.0, 0.0,  0.0, 0.0, 1.0,	 //1
		-0.5, 0.5, 0.5,		0.0, 0.0, 1.0, 0.5,	    1.0,  0.0,   0.0, 0.0, 1.0,  //3

		 0.5, -0.5, -0.5,	0.0, 1.0, 0.0, 0.5,		1.0, 0.0,   0.0, -1.0, 0.0,	//6
		 0.5, -0.5, 0.5,	0.0, 1.0, 0.0, 0.5,		1.0, 0.0,   0.0, -1.0, 0.0, //5
		-0.5, -0.5, 0.5,	0.0, 1.0, 0.0, 0.5,		0.0, 0.0,   0.0, -1.0, 0.0, //7

		-0.5,-0.5, -0.5,	0.0, 1.0, 0.0, 0.5,		0.0, 0.0,  0.0, -1.0, 0.0, 	//8
		 0.5, -0.5, -0.5,	0.0, 1.0, 0.0, 0.5,		1.0, 0.0,  0.0, -1.0, 0.0, 	//6
		-0.5, -0.5, 0.5,	0.0, 1.0, 0.0, 0.5,		0.0, 0.0,  0.0, -1.0, 0.0,	//7
	];
	
	}
    // Generate a buffer object
    gl.vertexBuffer = gl.createBuffer();
    // Bind buffer as a vertex buffer so we can fill it with data
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);
    return testGLError("initialiseBuffers");
}

function initialiseShaders() {

	if(imagebit == 1 ){ // click input image
   		 var fragmentShaderSource = '\
			varying mediump vec4 color; \
			varying mediump vec2 texCoord;\
			uniform sampler2D sampler2d; \
			void main(void) \
			{ \
				gl_FragColor = texture2D(sampler2d, texCoord);\
			}';
	}
	else{ // others

		var fragmentShaderSource = '\
			varying mediump vec4 color; \
			varying mediump vec2 texCoord;\
			uniform sampler2D sampler2d; \
			void main(void) \
			{ \
				gl_FragColor = 1.0 * color;\
			}';

	}
    gl.fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(gl.fragShader, fragmentShaderSource);
    gl.compileShader(gl.fragShader);
    if (!gl.getShaderParameter(gl.fragShader, gl.COMPILE_STATUS)) {
        alert("Failed to compile the fragment shader.\n" + gl.getShaderInfoLog(gl.fragShader));
        return false;
    }

    var vertexShaderSource = '\
			attribute highp vec3 myVertex; \
			attribute highp vec4 myColor; \
			attribute highp vec2 myUV; \
			attribute highp vec3 myNormal; \
			uniform mediump mat4 Pmatrix; \
			uniform mediump mat4 Vmatrix; \
			uniform mediump mat4 Mmatrix; \
			uniform mediump mat4 Nmatrix; \
			varying mediump vec4 color; \
			varying mediump vec2 texCoord;\
			void main(void)  \
			{ \
				vec4 nN;\
				vec4 v1, v2, v3, v4;\
				vec3 v5;\
				v1 = Mmatrix*vec4(myVertex,1.0);	\
				v2 = Mmatrix*vec4(myVertex+myNormal,1.0);	\
				v1.xyz = v1.xyz/v1.w;\
				v2.xyz = v2.xyz/v1.w;\
				v3 = v2 - v1;\
				v5 = normalize(v3.xyz); \
				gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(myVertex, 1.0);\
					/* \
				if (gl_Position.w != 0.0) \
					gl_Position.x /= gl_Position.w; \
				gl_Position.x += 1.0; \
				if (gl_Position.w != 1.0) \
					gl_Position.x *= gl_Position.w; */ \
				color = 0.2*myColor+vec4(0.8,0.8,0.8,1.0)*0.5 * (dot(v5, vec3(1,1,1))+1.0);\
				color.a = 1.0;\
				texCoord = myUV; \
			}';

		
    gl.vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(gl.vertexShader, vertexShaderSource);
    gl.compileShader(gl.vertexShader);
    if (!gl.getShaderParameter(gl.vertexShader, gl.COMPILE_STATUS)) {
        alert("Failed to compile the vertex shader.\n" + gl.getShaderInfoLog(gl.vertexShader));
        return false;
    }

    gl.programObject = gl.createProgram();

    // Attach the fragment and vertex shaders to it
    gl.attachShader(gl.programObject, gl.fragShader);
    gl.attachShader(gl.programObject, gl.vertexShader);

    // Bind the custom vertex attribute "myVertex" to location 0
    gl.bindAttribLocation(gl.programObject, 0, "myVertex");
	gl.bindAttribLocation(gl.programObject, 1, "myColor");
	gl.bindAttribLocation(gl.programObject, 2, "myUV");
	gl.bindAttribLocation(gl.programObject, 3, "myNormal");

    // Link the program
    gl.linkProgram(gl.programObject);

    if (!gl.getProgramParameter(gl.programObject, gl.LINK_STATUS)) {
        alert("Failed to link the program.\n" + gl.getProgramInfoLog(gl.programObject));
        return false;
    }

    gl.useProgram(gl.programObject);

    return testGLError("initialiseShaders");
}

// FOV, Aspect Ratio, Near, Far 
function get_projection(angle, a, zMin, zMax) {
    var ang = Math.tan((angle*.5)*Math.PI/180);//angle*.5
    return [
    	0.5/ang, 0 , 0, 0,
        0, 0.5*a/ang, 0, 0,
        0, 0, -(zMax+zMin)/(zMax-zMin), -1,
        0, 0, (-2*zMax*zMin)/(zMax-zMin), 0 ];
}
			
var proj_matrix = get_projection(30, 1.0, 1, 7.0);
var mov_matrix = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
var view_matrix = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
// translating z
view_matrix[14] = view_matrix[14]-5//zoom

function idMatrix(m) {
    m[0] = 1; m[1] = 0; m[2] = 0; m[3] = 0; 
    m[4] = 0; m[5] = 1; m[6] = 0; m[7] = 0; 
    m[8] = 0; m[9] = 0; m[10] = 1; m[11] = 0; 
    m[12] = 0; m[13] = 0; m[14] = 0; m[15] = 1; 
}

function mulStoreMatrix(r, m, k) {
    m0=m[0];m1=m[1];m2=m[2];m3=m[3];m4=m[4];m5=m[5];m6=m[6];m7=m[7];
    m8=m[8];m9=m[9];m10=m[10];m11=m[11];m12=m[12];m13=m[13];m14=m[14];m15=m[15];
    k0=k[0];k1=k[1];k2=k[2];k3=k[3];k4=k[4];k5=k[5];k6=k[6];k7=k[7];
    k8=k[8];k9=k[9];k10=k[10];k11=k[11];k12=k[12];k13=k[13];k14=k[14];k15=k[15];

    a0 = k0 * m0 + k3 * m12 + k1 * m4 + k2 * m8;
    a4 = k4 * m0 + k7 * m12 + k5 * m4 + k6 * m8 ;
    a8 = k8 * m0 + k11 * m12 + k9 * m4 + k10 * m8 ;
    a12 = k12 * m0 + k15 * m12 + k13 * m4 + k14 * m8;

    a1 = k0 * m1 + k3 * m13 + k1 * m5 + k2 * m9;
    a5 = k4 * m1 + k7 * m13 + k5 * m5 + k6 * m9;
    a9 = k8 * m1 + k11 * m13 + k9 * m5 + k10 * m9;
    a13 = k12 * m1 + k15 * m13 + k13 * m5 + k14 * m9;

    a2 = k2 * m10 + k3 * m14 + k0 * m2 + k1 * m6;
    a6 =  k6 * m10 + k7 * m14 + k4 * m2 + k5 * m6;
    a10 =  k10 * m10 + k11 * m14 + k8 * m2 + k9 * m6;
    a14 = k14 * m10 + k15 * m14 + k12 * m2 + k13 * m6; 

    a3 = k2 * m11 + k3 * m15 + k0 * m3 + k1 * m7;
    a7 = k6 * m11 + k7 * m15 + k4 * m3 + k5 * m7;
    a11 = k10 * m11 + k11 * m15 + k8 * m3 + k9 * m7;
    a15 = k14 * m11 + k15 * m15 + k12 * m3 + k13 * m7;

    r[0]=a0; r[1]=a1; r[2]=a2; r[3]=a3; r[4]=a4; r[5]=a5; r[6]=a6; r[7]=a7;
    r[8]=a8; r[9]=a9; r[10]=a10; r[11]=a11; r[12]=a12; r[13]=a13; r[14]=a14; r[15]=a15;
}

function mulMatrix(m,k)
{
	mulStoreMatrix(m,m,k);
}

function translate(m, tx,ty,tz) {
   var tm = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]; 
   tm[12] = tx; tm[13] = ty; tm[14] = tz; 
   mulMatrix(m, tm); 
}


function rotateX(m, angle) {
	var rm = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]; 
    var c = Math.cos(angle);
    var s = Math.sin(angle);

	rm[5] = c;  rm[6] = s; 
	rm[9] = -s;  rm[10] = c;
	mulMatrix(m, rm); 
}

function rotateY(m, angle) {
	var rm = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]; 
    var c = Math.cos(angle);
    var s = Math.sin(angle);

	rm[0] = c;  rm[2] = -s;
	rm[8] = s;  rm[10] = c; 
	mulMatrix(m, rm); 
}

function rotateZ(m, angle) {
	var rm = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]; 
    var c = Math.cos(angle);
    var s = Math.sin(angle);

	rm[0] = c;  rm[1] = s;
	rm[4] = -s;  rm[5] = c; 
	mulMatrix(m, rm); 
}

function scale(m, sx,sy,sz) {
	var rm = [sx,0,0,0, 0,sy,0,0, 0,0,sz,0, 0,0,0,1]; 
	mulMatrix(m, rm); 
}

function normalizeVec3(v)
{
	sq = v[0]*v[0] + v[1]*v[1] + v[2]*v[2]; 
	sq = Math.sqrt(sq);
	if (sq < 0.000001 ) // Too Small
		return -1; 
	v[0] /= sq; v[1] /= sq; v[2] /= sq; 
}

function rotateArbAxis(m, angle, axis)
{
	var axis_rot = [0,0,0];
	var ux, uy, uz;
	var rm = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]; 
    var c = Math.cos(angle);
	var c1 = 1.0 - c; 
    var s = Math.sin(angle);
	axis_rot[0] = axis[0]; 
	axis_rot[1] = axis[1]; 
	axis_rot[2] = axis[2]; 
	if (normalizeVec3(axis_rot) == -1 )
		return -1; 
	ux = axis_rot[0]; uy = axis_rot[1]; uz = axis_rot[2];
	//console.log("Log", angle);
	rm[0] = c + ux * ux * c1;
	rm[1] = uy * ux * c1 + uz * s;
	rm[2] = uz * ux * c1 - uy * s;
	rm[3] = 0;

	rm[4] = ux * uy * c1 - uz * s;
	rm[5] = c + uy * uy * c1;
	rm[6] = uz * uy * c1 + ux * s;
	rm[7] = 0;

	rm[8] = ux * uz * c1 + uy * s;
	rm[9] = uy * uz * c1 - ux * s;
	rm[10] = c + uz * uz * c1;
	rm[11] = 0;

	rm[12] = 0;
	rm[13] = 0;
	rm[14] = 0;
	rm[15] = 1;

	mulMatrix(m, rm);
}

rotValue = 0.0; 
rotValueSmall = 0.0; 
incRotValue = 0.0;
incRotValueSmall = 0.02; 

transX = 0.0;
frames = 1;
tempRotValue = 0.0; 
function stopRotate()
{
	if (incRotValue == 0.0)
	{
		incRotValue = tempRotValue; 
	}
	else
	{
		tempRotValue = incRotValue; 
		incRotValue = 0.0; 
	}
}

function animRotate()
{
	incRotValue += 0.01;
}

function trXinc()
{
	transX += 0.01;
	document.getElementById("webTrX").innerHTML = "transX : " + transX.toFixed(4);
}

function renderScene() {

	if(zoombit != 5){
		view_matrix[14] = -zoombit;//zoom
		if(!initialiseShaders()){
			return;
		}
		zoombit=5;
	}

	if(projectionbit !=7){
		proj_matrix = get_projection(30, 1.0, 1, projectionbit); // set z-buffer 
		if(!initialiseShaders()){
			return;
		}
		projectionbit = 7;
	}

	if(repeatbit == 1 ){
		if(!initialiseBuffer()){
			return;
		}
		repeatbit = 0;
		clampbit = 0;
		mirrorbit = 0;
	}
	if(imagebit == 1){
		if(!initialiseBuffer()){
			return;
		}
		if(!initialiseShaders()){
			return;
		}
		imagebit = 0;
	}
	if(deletebit ==1){
		if(!initialiseShaders()){
			return;
		}
		deletebit = 0;
	}
	

	//console.log("Frame "+frames+"\n");
    frames += 1 ;
	rotAxis = [1,1,0];


    var Pmatrix = gl.getUniformLocation(gl.programObject, "Pmatrix");
    var Vmatrix = gl.getUniformLocation(gl.programObject, "Vmatrix");
    var Mmatrix = gl.getUniformLocation(gl.programObject, "Mmatrix");
    var Nmatrix = gl.getUniformLocation(gl.programObject, "Nmatrix");
	
    idMatrix(mov_matrix); 
	rotateArbAxis(mov_matrix, rotValue, rotAxis);
    rotValue += incRotValue; 
	rotValueSmall += incRotValueSmall;
    translate(mov_matrix, transX, 0.0, 0.0); 

    gl.uniformMatrix4fv(Pmatrix, false, proj_matrix);
    gl.uniformMatrix4fv(Vmatrix, false, view_matrix);
    gl.uniformMatrix4fv(Mmatrix, false, mov_matrix);

    if (!testGLError("gl.uniformMatrix4fv")) {
        return false;
    }

    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, gl.FALSE, 48, 0);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 4, gl.FLOAT, gl.FALSE, 48, 12);
	gl.enableVertexAttribArray(2);
    gl.vertexAttribPointer(2, 2, gl.FLOAT, gl.FALSE, 48, 28);
	gl.enableVertexAttribArray(3);
	gl.vertexAttribPointer(3, 3, gl.FLOAT, gl.FALSE, 48, 36);


    if (!testGLError("gl.vertexAttribPointer")) {
        return false;
    }
     gl.enable(gl.DEPTH_TEST);
     gl.depthFunc(gl.LEQUAL); 
	// gl.enable(gl.CULL_FACE);
	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	gl.blendEquation(gl.FUNC_ADD);

    gl.clearColor(0.2, 0.2, 0.2, 1.0);
    gl.clearDepth(1.0); 
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	gl.drawArrays(gl.TRIANGLES, 0, 36);
	
	/*var mov_matrix2 = mov_matrix.slice(); 
	translate(mov_matrix2, 0.75, 0.75, 0.75);
	rotateY(mov_matrix2, rotValueSmall); 
	scale(mov_matrix2, 0.25, 0.25, 0.25);
    gl.uniformMatrix4fv(Mmatrix, false, mov_matrix2);
	gl.drawArrays(gl.TRIANGLES, 0, 36);

	var mov_matrix3 = mov_matrix2.slice(); 
	translate(mov_matrix3, 0.75, -0.75, 0.75);
	rotateY(mov_matrix3, rotValueSmall); 
	scale(mov_matrix3, 0.25, 0.25, 0.25);
    gl.uniformMatrix4fv(Mmatrix, false, mov_matrix3);
	gl.drawArrays(gl.TRIANGLES, 0, 36);*/

    document.getElementById("matrix0").innerHTML = mov_matrix[0].toFixed(4);
	document.getElementById("matrix1").innerHTML = mov_matrix[1].toFixed(4);
	document.getElementById("matrix2").innerHTML = mov_matrix[2].toFixed(4);
	document.getElementById("matrix3").innerHTML = mov_matrix[3].toFixed(4);
	document.getElementById("matrix4").innerHTML = mov_matrix[4].toFixed(4);
	document.getElementById("matrix5").innerHTML = mov_matrix[5].toFixed(4);
	document.getElementById("matrix6").innerHTML = mov_matrix[6].toFixed(4);
	document.getElementById("matrix7").innerHTML = mov_matrix[7].toFixed(4);
	document.getElementById("matrix8").innerHTML = mov_matrix[8].toFixed(4);
	document.getElementById("matrix9").innerHTML = mov_matrix[9].toFixed(4);
	document.getElementById("matrix10").innerHTML = mov_matrix[10].toFixed(4);
	document.getElementById("matrix11").innerHTML = mov_matrix[11].toFixed(4);
	document.getElementById("matrix12").innerHTML = mov_matrix[12].toFixed(4);
	document.getElementById("matrix13").innerHTML = mov_matrix[13].toFixed(4);
	document.getElementById("matrix14").innerHTML = mov_matrix[14].toFixed(4);
	document.getElementById("matrix15").innerHTML = mov_matrix[15].toFixed(4);
    if (!testGLError("gl.drawArrays")) {
        return false;
    }

    return true;
}

function main() {
    var canvas = document.getElementById("helloapicanvas");
    console.log("Start");

    if (!initialiseGL(canvas)) {
        return;
    }

    if (!initialiseBuffer()) {
        return;
    }

    if (!initialiseShaders()) {
        return;
    }

    // Render loop
    requestAnimFrame = (
	function () {
        //	return window.requestAnimationFrame || window.webkitRequestAnimationFrame 
	//	|| window.mozRequestAnimationFrame || 
	   	return function (callback) {
			    // console.log("Callback is"+callback); 
			    window.setTimeout(callback, 10, 10); };
    })();

    (function renderLoop(param) {
        if (renderScene()) {
            // Everything was successful, request that we redraw our scene again in the future
            requestAnimFrame(renderLoop);
        }
    })();
}
