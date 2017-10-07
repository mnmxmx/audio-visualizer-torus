class Webgl{
	constructor(){
		this.vertShader = [
		  "assets/glsl/torus.vert",
		];

		this.fragShader = [
		  "assets/glsl/torus.frag",
		];

		this.shaderLength = this.vertShader.length + this.fragShader.length;
		this.shaderCount = 0;


		for(var i = 0; i < this.vertShader.length; i++){
			this.importShader_vert(i);
		}


		for(var i = 0; i < this.fragShader.length; i++){
			this.importShader_frag(i);
		}
	}


	importShader_vert(i){

		var myRequest = new XMLHttpRequest();

		var _this = this;
		myRequest.onreadystatechange = function() {
	    if ( myRequest.readyState === 4 ) {
	    	 _this.vertShader[i] = myRequest.response;
	    	_this.completeShaderLoad();
	    }
		};


		myRequest.open("GET", this.vertShader[i], true);
		myRequest.send();
	};


	importShader_frag(i){

		var myRequest = new XMLHttpRequest();

		var _this = this;
		myRequest.onreadystatechange = function() {
	    if ( myRequest.readyState === 4 ) {
	    	 _this.fragShader[i] = myRequest.response;


	    	_this.completeShaderLoad();
	    }
		};

		myRequest.open("GET", this.fragShader[i], true);
		myRequest.send();
	}



	completeShaderLoad(){
		this.shaderCount++;

		if(this.shaderCount === this.shaderLength) {
			this.isShaderComplete = true;
			this.init();
		}
	}



	init(){
		// console.log(this.vertShader, this.fragShader);
		ResizeWatch.register(this);

		this.width = 1600;
		this.height = 1600;
		this.aspect = this.width / this.height;

		this.scene = new THREE.Scene();

		this.setProps();

	  this.camera = new THREE.PerspectiveCamera(this.props.fov, this.props.aspect, this.props.near, this.props.far);
	  var cameraZ = (this.props.height / 2) / Math.tan((45 * Math.PI / 180) / 2);

  	this.camera.position.set(0, 0, cameraZ/1.8);

		this.camera.lookAt(this.scene.position);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });

    var ratio = 1.5;

    this.renderer.setPixelRatio(ratio);

    this.renderer.setClearColor(0xffffff, 1);
    this.renderer.setSize(ResizeWatch.width, ResizeWatch.height);

    this.div = document.getElementById("wrapper");
    this.div.appendChild(this.renderer.domElement);

    this.torus = new Torus(this);


    var control =  new THREE.OrbitControls(this.camera, this.renderer.domElement); 

    this.audio = new Audio(this);
    this.audio.init();
    this.resizeUpdate();
	}



	setProps(){
		var width = ResizeWatch.width;
		var height = ResizeWatch.height;
		var aspect = width / height;

		this.props = {
			width: width,
			height: height,
			aspect: aspect,
			fov: 45,
			left: -width / 2,
			right: width / 2,
			top: height / 2,
			bottom: -height / 2,
			near: 0.1,
			far: 10000,
			parent: document.getElementById("wrapper")
		};
	};

	resizeUpdate(){
	  this.setProps();
		this.renderer.setSize(this.props.width, this.props.height);

		this.camera.aspect = this.props.aspect;

		var cameraZ = (this.props.height / 2) / Math.tan((this.props.fov * Math.PI / 180) / 2);

  	this.camera.position.set(0, 0, cameraZ/1.8);
		
		this.camera.lookAt(this.scene.position);

		this.camera.updateProjectionMatrix();
	}

	

	render(){
		  if(this.uniforms) this.uniforms.uTick.value += 1;
	    this.renderer.render(this.scene, this.camera);
	    this.torus.render();
	    // this.effect.render();
  }
}


  
  
  
  