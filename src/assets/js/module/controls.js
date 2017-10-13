class Controls{
  constructor(analyzer){
    this.analyzer = analyzer;
    this.props = {
      // start: 1,
      end: 700,
      scaleSize: 2.7,

      isNo: false,
      isLinear: false,
      isCubic: true,
      isCosine: false,
      isHermite: false
    };

    this.init();
  }

  init(){
    this.gui = new dat.GUI({width: 400});
    // this.gui.remember(this.controls);

    // this.gui.add(this.props, "start", 1, 90).name("start frequency").onChange(this.changeFunc.bind(this));
    this.gui.add(this.props, "end", 200, 2000).name("end frequency").onChange(this.changeFreq.bind(this));
    this.gui.add(this.props, "scaleSize", 1/7 * 10, 1/2 * 10).name("scale size");

    this.gui_type = this.gui.addFolder('type of interpolation');
    this.gui_type.open();
    this.gui_type.add(this.props, "isNo").name("no interpolation(stepped)").listen().onChange(this.changeType1.bind(this));
    this.gui_type.add(this.props, "isLinear").name("linear interpolation").listen().onChange(this.changeType2.bind(this));
    this.gui_type.add(this.props, "isCubic").name("Catmull–Rom spline(cubic)").listen().onChange(this.changeType3.bind(this));
    this.gui_type.add(this.props, "isCosine").name("cosine interpolation").listen().onChange(this.changeType4.bind(this));
    // this.gui_type.add(this.props, "isHermite").name("hermite interpolation").listen().onChange(this.changeType5.bind(this));
  }

  changeFreq(value){

    this.analyzer.setRange();
    
  }

  changeType1(){
    this.props.isNo = true;
    this.props.isLinear = false;
    this.props.isCubic = false;
    this.props.isCosine = false;
    // this.props.isHermite = false;
  }

  changeType2(){
    this.props.isNo = false;
    this.props.isLinear = true;
    this.props.isCubic = false;
    this.props.isCosine = false;
    // this.props.isHermite = false;
  }

  changeType3(){
    this.props.isNo = false;
    this.props.isLinear = false;
    this.props.isCubic = true;
    this.props.isCosine = false;
    // this.props.isHermite = false;


  }

  changeType4(){
    this.props.isNo = false;
    this.props.isLinear = false;
    this.props.isCubic = false;
    this.props.isCosine = true;
    // this.props.isHermite = false;

  }

  // changeType5(){
  //   this.props.isNo = false;
  //   this.props.isLinear = false;
  //   this.props.isCubic = false;
  //   this.props.isCosine = false;
  //   this.props.isHermite = true;
  // }
}