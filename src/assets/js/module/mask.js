class Mask{
  constructor(webgl){
  	this.webgl = webgl;
  	this.objNum = 20;
	  this.init();
  }

  init(){
  	this.width = this.webgl.width * 0.35;
		this.height = this.webgl.height * 0.35;
		this.scene = new THREE.Scene();

	  this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 10000);
	  var cameraZ = (this.height / 2) / Math.tan((45 * Math.PI / 180) / 2);
	  this.camera.position.set(0, 0, cameraZ);

	  this.camera.lookAt(this.scene.position);


	  var renderTargetParameters = {
			minFilter: THREE.LinearFilter,
			magFilter: THREE.LinearFilter,
			format: THREE.RGBAFormat
		};

		this.fbo = new THREE.WebGLRenderTarget( this.width * 2, this.height * 2, renderTargetParameters );
		this.fbo.texture.format = THREE.RGBAFormat;

		this.createObj();
  }


  createObj(){
  	this.originalG = new THREE.PlaneBufferGeometry(this.width / 20, this.height * 1.3, 1, 50);

  	this.instanceG = new THREE.InstancedBufferGeometry();


  	this.colorPallete = [
  	 new THREE.Color(0xd4ab06), new THREE.Color(0xf5c506), new THREE.Color(0xffd42a), new THREE.Color(0xc3a118)
  	];

  	// 頂点
		var vertices = this.originalG.attributes.position.clone();
		this.instanceG.addAttribute("position", vertices);

		var normals = this.originalG.attributes.normal.clone();
		this.instanceG.addAttribute("normal", normals);

    // uv
		var uvs = this.originalG.attributes.uv.clone();
		this.instanceG.addAttribute("uv", uvs);

    // index
		var indices = this.originalG.index.clone();
		this.instanceG.setIndex(indices);

		var nums = new THREE.InstancedBufferAttribute(new Float32Array(this.objNum), 1, 1);
		var noises = new THREE.InstancedBufferAttribute(new Float32Array(this.objNum), 1, 1);
		var colors = new THREE.InstancedBufferAttribute(new Float32Array(this.objNum * 3), 3, 1);


		for(let i = 0, len = nums.count; i < len; i++){
			nums.setX(i, i);
			// console.log(i);
			var random = Math.random();
			noises.setX(i, random);
			// var color = this.colorPallete[Math.floor(Math.random() * this.colorPallete.length)];
			var color = this.colorPallete[i % this.colorPallete.length];
			colors.setXYZ(i, color.r, color.g, color.b);
		}


		this.instanceG.addAttribute("aNum", nums);
		this.instanceG.addAttribute("aNoise", noises);
		this.instanceG.addAttribute("aColor", colors);


  	this.uniforms = {
  		uTick: {type: "f", value: 0},
  		uSize: {type: "v2", value: new THREE.Vector2(this.width, this.height)},
  		uMaxNum: {type: "f", value: this.objNum},
  		uFrequencyAvr: {type: "f", value: 0}
  	};

  	var material = new THREE.ShaderMaterial({
  		vertexShader: this.webgl.vertShader[2],
  		fragmentShader: this.webgl.fragShader[2],
  		uniforms: this.uniforms,
  		// side: THREE.DoubleSide,
  		transparent: true,
  		// depthwrite: false
  	});

  	

  	this.instanceG.maxInstancedCount = this.objNum;


  	var mesh = new THREE.Mesh(this.instanceG, material);
  	this.scene.add(mesh);
  }


  render(){
  	this.uniforms.uTick.value++;

  	var avr = this.webgl.audio.analyzer.avrBass;
  	avr = (avr === 0) ? -60 : avr;
  	avr += 60;
  	avr /= 20;
  	// console.log(avr);

  	this.targetAvr = avr;
  	if(!this.currentAvr) this.currentAvr = 0;

  	this.currentAvr += (this.targetAvr - this.currentAvr) * 0.015;

  	this.uniforms.uFrequencyAvr.value = this.currentAvr;

    this.webgl.renderer.render(this.scene, this.camera, this.fbo);
  }

}