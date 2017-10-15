class Analyzer{
  constructor(audio, smoothTime, scale){
    this.audio = audio;
    this.controls = new Controls(this);

    this.scale = scale;

    this.audioContext = this.audio.audioContext;
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 2048;
    this.frequencyNum = 1024;
    this.hz = 22028;
    this.analyser.smoothingTimeConstant = smoothTime;

    this.frequencyArray = [];

    this.distLength_1 = 120 * 2;
    this.distLength_2 = 60 * 2;

    this.setRange();

    this.level = 5;

    this.avrBass = 0;
  }


  setRange(){
    this.minHz = 1;
    this.maxHz = this.controls.props.end;

    this.sourceStart = Math.ceil(this.frequencyNum * this.minHz / this.hz);
    this.sourceEnd = Math.round(this.frequencyNum * this.maxHz / this.hz);
    this.sourceLength = this.sourceEnd - this.sourceStart + 1;

    this.adjustOffset = Math.round(this.sourceLength * 0.12);

    this.interval_1 =  (this.sourceLength - 1) / (this.distLength_1 - 1) ;
    this.interval_2 =  (this.sourceLength - 1) / (this.distLength_2 - 1) ;
  }



  adjustFrequency(i, avr){
    var f = Math.max(0, this.spectrums[this.sourceStart + i] - avr) * this.scale;
    var offset = i - this.sourceStart;
    
    var ratio = offset / this.adjustOffset;
    
    f *= Math.max(0, Math.min(1, 5 / 6 * (ratio - 1) *  (ratio - 1) *  (ratio - 1) + 1));
    
    return f;
  }


  update(){
    this.frequencyArray = [];
    
    var spectrums = new Float32Array(this.frequencyNum);

    if(this.audio.isReady) {
      this.analyser.getFloatFrequencyData(spectrums);
    }

    this.spectrums = spectrums;
    
    this.avr = 0;
    this.avrBass = 0;

    
    for(let i=this.sourceStart; i<=this.sourceEnd; i++){
      this.avr += this.spectrums[i];
      if(i < 6) this.avrBass += this.spectrums[i];
    }
    
    this.avr /= this.sourceLength;
    this.avrBass /= 6;
    // console.log(this.avrBass);

    this.avr = (!this.audio.isReady || this.avr === 0) ? this.avr : Math.min(-40, Math.max(this.avr, -60));
    this.avrBass = (!this.audio.isReady || this.avrBass === 0) ? this.avrBass : Math.max(-60, this.avrBass);

    this.createArray(this.distLength_1, this.interval_1);
    this.createArray(this.distLength_2, this.interval_2, true);
  }


  createArray(num, interval, isReverse){
    if(!isReverse){
      for(let i = 0; i < num; i++){
        this.calcFrequency(num, interval, i);
      }
    } else {
      for(let i = num - 1; i >= 0; i--){
        this.calcFrequency(num, interval, i);
      }
    }
  }

  calcFrequency(num, interval, i){
    let n1 = Math.floor(i * interval);
    let n2 = n1 + 1;
    let n0 = Math.abs(n1 - 1);
    let n3 = n1 + 2;
    
    
    n2 = (n2 > this.sourceLength - 1) ? (this.sourceLength - 1) * 2 - n2 : n2;
    n3 = (n3 > this.sourceLength - 1) ? (this.sourceLength - 1) * 2 - n3 : n3;
    
    let p0 = this.adjustFrequency(n0, this.avr);
    let p1 = this.adjustFrequency(n1, this.avr);
    let p2 = this.adjustFrequency(n2, this.avr);
    let p3 = this.adjustFrequency(n3, this.avr);
    
    let mu = i * interval - n1;

    let targetFrequency;

    // interpolation
    if(this.controls.props.isCubic){
      targetFrequency = this.cubic(mu, p0, p1, p2, p3);
    } else if(this.controls.props.isLinear){
      targetFrequency = this.linear(mu, p1, p2);
    } else if(this.controls.props.isNo){
      targetFrequency = p1;
    } else if(this.controls.props.isCosine){
      targetFrequency = this.cosine(mu, p1, p2);
    } else if(this.controls.props.isHermite){
      targetFrequency = this.hermite(mu, p0, p1, p2, p3);

    }

    targetFrequency = Math.max(0, targetFrequency);
    this.frequencyArray.push(targetFrequency * this.controls.props.scaleSize / 10);
  }

  cubic(mu, p0, p1, p2, p3){
    let mu2 = mu * mu;
    

    let a0 = -0.5 * p0 + 1.5 * p1 - 1.5 * p2 + 0.5 * p3;
    let a1 = p0 - 2.5 * p1 + 2 * p2 - 0.5*p3;
    let a2 = -0.5 * p0 + 0.5 * p2;

    return a0 * mu * mu2 + a1 * mu2 + a2 * mu + p1;
  }

  linear(mu, p1, p2){
    return p1 * (1 - mu) + p2 * mu;
  }

  cosine(mu, p1, p2){
     let mu2;

     mu2 = (1 - Math.cos( mu * Math.PI)) / 2;
     return (p1 * (1 - mu2) + p2 * mu2);
  }

  hermite(mu, p0, p1, p2, p3){
    const tension = this.controls.props.tension;
    const bias = this.controls.props.bias;

    let m0,m1,mu2,mu3;
    let a0,a1,a2,a3;

    mu2 = mu * mu;
    mu3 = mu2 * mu;

    m0  = (p1 - p0) * (1 + bias) * (1 - tension) / 2;
    m0 += (p2 - p1) * (1 - bias) * (1 - tension) / 2;
    m1  = (p2 - p1) * (1 + bias) * (1 - tension) / 2;
    m1 += (p3 - p2) * (1 - bias) * (1 - tension) / 2;

    a0 =  2 * mu3 - 3 * mu2 + 1;
    a1 =  mu3 - 2 * mu2 + mu;
    a2 =  mu3 - mu2;
    a3 = - 2 * mu3 + 3 * mu2;

   return a0 * p1 + a1 * m0 + a2 * m1 + a3 * p2;
  }

}