class Torus{
  constructor(webgl){
    this.webgl = webgl;
    this.init();
  }

  init(){
    const geometry = this.createGeometry();

    this.uniforms = {
      uRadius: {type: "f", value: this.radius},
      uTick: {type: "f", value: 0}
    }

    const material = new THREE.ShaderMaterial( { 
      vertexShader: this.webgl.vertShader[0],
      fragmentShader: this.webgl.fragShader[0],
      uniforms: this.uniforms,
      shading: THREE.FlatShading,
      side: THREE.DoubleSide,

     } );

    const torus = new THREE.Mesh( geometry, material );
    torus.frustumCulled = false;

    this.webgl.scene.add( torus );
  }


  createGeometry(){
    this.geometry = new THREE.BufferGeometry();

    this.radius = 180 * 1.1;

    const tube = 1.5 * 1.1;

    this.radialSegments = 18;

    this.tubularSegments = 360;

    this.orderNumArray = [];
    const vertices = [];
    const normals = [];
    const radians = [];
    const uvs = [];
    const indices = [];

    for ( let j = 0; j <= this.radialSegments; j ++ ) {
      for ( let i = 0; i <= this.tubularSegments; i ++ ) {

        this.orderNumArray.push(i);

        var u = i / this.tubularSegments * Math.PI * 2;
        var v = j / this.radialSegments * Math.PI * 2;


        radians.push(u);

        // vertex

        var vertex = {};

        vertex.x = ( this.radius + tube * Math.cos( v ) ) * Math.cos( u );
        vertex.y = ( this.radius + tube * Math.cos( v ) ) * Math.sin( u );
        vertex.z = tube * Math.sin( v );

        vertices.push( vertex.x, vertex.y, vertex.z );

        // normal

        var center = {};

        center.x = this.radius * Math.cos( u );
        center.y = this.radius * Math.sin( u );

        var normal = {};

        normal.x = vertex.x - center.x;
        normal.y = vertex.y - center.y;
        normal.z = vertex.z - center.z;

        var normalRatio = Math.sqrt(normal.x * normal.x + normal.y * normal.y + normal.z * normal.z);

        // normal.subVectors( , center ).normalize();

        normals.push( normal.x/normalRatio, normal.y/normalRatio, normal.z/normalRatio);

        // uv

        uvs.push( i / this.tubularSegments );
        uvs.push( j / this.radialSegments );

      }
    }

    // indices
    for ( let j = 1; j <= this.radialSegments; j ++ ) {
      for ( let i = 1; i <= this.tubularSegments; i ++ ) {

        // indices

        let a = ( this.tubularSegments + 1 ) * j + i - 1;
        let b = ( this.tubularSegments + 1 ) * ( j - 1 ) + i - 1;
        let c = ( this.tubularSegments + 1 ) * ( j - 1 ) + i;
        let d = ( this.tubularSegments + 1 ) * j + i;

        // faces
        indices.push( a, b, d );
        indices.push( b, c, d );
      }
    }

    this.radians = new THREE.Float32BufferAttribute( radians, 1 );


    this.indices = new ( indices.length > 65535 ? THREE.Uint32BufferAttribute : THREE.Uint16BufferAttribute )( indices, 1 );
    this.positions = new THREE.Float32BufferAttribute( vertices, 3 );
    this.normals = new THREE.Float32BufferAttribute( normals, 3 );
    

    this.uvs = new THREE.Float32BufferAttribute( uvs, 2 );

    this.frequencies = new THREE.BufferAttribute( new Float32Array((this.radialSegments + 1) * (this.tubularSegments + 1)), 1 );

    this.geometry.setIndex(this.indices);
    this.geometry.addAttribute("position", this.positions);
    this.geometry.addAttribute("normal", this.normals);
    this.geometry.addAttribute("uv", this.uvs);

    this.geometry.addAttribute("aFrequency", this.frequencies);
    this.geometry.addAttribute("aRadian", this.radians);

    return this.geometry;
  }



  render(){
    this.uniforms.uTick.value++;
    var spectrums = this.webgl.audio.analyzer.frequencyArray;

    var aFrequency = this.geometry.attributes.aFrequency;
    aFrequency.needsUpdate = true;

    for(let i = 0; i < aFrequency.count; i++){
      let num = this.orderNumArray[i];
      if(num === this.tubularSegments) num = 0;
      let spectrum = spectrums[num];
      aFrequency.array[i] = spectrum;
    }
  }

}