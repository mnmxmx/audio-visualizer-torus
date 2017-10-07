class Audio{
  constructor(webgl){
  	this.webgl = webgl;
  	// this.torus = this.webgl.torus;
    this.audioContext = (window.AudioContext) ? new AudioContext : new webkitAudioContext;
    this.fileReader  = new FileReader;
    this.isReady = false;
    this.count = 0;
  }

  init(){
  	this.analyzer = new Analyzer(this, 0.8, 3.5);
    
    this.render();
    
    document.getElementById('file').addEventListener('change', function(e){
      this.fileReader.readAsArrayBuffer(e.target.files[0]);
    }.bind(this));


    var _this = this;
    
    this.fileReader.onload = function(){
      _this.audioContext.decodeAudioData(_this.fileReader.result, function(buffer){
        if(_this.source) {
          _this.source.stop();
        }
        _this.source = _this.audioContext.createBufferSource();
        _this.source.buffer = buffer;
        
        _this.source.loop = true;

        _this.connectNode(buffer);

        _this.isReady = true;
      });
    };
  };

  connectNode(){
    this.source.loop = true;
    
    this.source.connect(this.analyzer.analyser);
    
    this.source.connect(this.audioContext.destination);
    this.source.start(0);
  };


  render(){
  	this.analyzer.update();
  	this.webgl.render();
  	requestAnimationFrame(this.render.bind(this));
  };
}