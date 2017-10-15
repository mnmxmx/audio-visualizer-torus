class Audio{
  constructor(webgl){
    this.webgl = webgl;
    this.torus = this.webgl.torus;
    this.audioContext = (window.AudioContext) ? new AudioContext : new webkitAudioContext;
    this.fileReader  = new FileReader;
    this.isReady = false;
    this.count = 0;

    this.startEle = document.getElementById('start');
    this.playEle = document.getElementById('play');
    this.loadingEle = document.getElementById('loading');

    // this.init();
  }

  init(){
    this.analyzer = new Analyzer(this, 0.8, 3.5);
    
    this.render();
    

    this.playEle.addEventListener("click", function(){
      if(this.isReady) return;
      this.source.start(0);
      this.isReady = true;
      this.startEle.classList.add("isHidden");
    }.bind(this))

    this.loadAudio();
    
    // document.getElementById('file').addEventListener('change', function(e){
    //   this.fileReader.readAsArrayBuffer(e.target.files[0]);
    // }.bind(this));


    // var _this = this;
    
    // this.fileReader.onload = function(){
    //   _this.audioContext.decodeAudioData(_this.fileReader.result, function(buffer){
    //     if(_this.source) {
    //       _this.source.stop();
    //     }
    //     _this.source = _this.audioContext.createBufferSource();
    //     _this.source.buffer = buffer;
        
    //     _this.source.loop = true;

    //     _this.connectNode(buffer);

    //     _this.isReady = true;
    //   });
    // };
  };


  loadAudio(){
    var _this = this;

    var request = new XMLHttpRequest();

    request.open('GET', "assets/data/s.txt", true);
    request.responseType = 'arraybuffer';

    request.onload = function() {
      _this.audioContext.decodeAudioData(request.response, function(buffer){
        _this.loadingEle.classList.add("isHidden");
        _this.playEle.classList.remove("isHidden");

        _this.connectNode(buffer);
      });
    }.bind(this);

    request.send();
  };


  connectNode(buffer){
    if(this.source) {
      this.source.stop();
    }

    this.source = this.audioContext.createBufferSource();
    this.source.buffer = buffer;
    this.source.loop = true;
    
    this.source.connect(this.analyzer.analyser);
    
    this.source.connect(this.audioContext.destination);
  };


  render(){
    this.analyzer.update();
    this.webgl.render();
    requestAnimationFrame(this.render.bind(this));
  };
}