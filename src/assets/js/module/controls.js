class Controls{
  constructor(analyzer){
    this.analyzer = analyzer;
    this.props = {
      // start: 1,
      end: 700,
      isCubic: true,
      scaleSize: 2.7
    };
    this.init();
  }

  init(){
    this.gui = new dat.GUI({width: 300});
    // this.gui.remember(this.controls);

    // this.gui.add(this.props, "start", 1, 90).name("start frequency").onChange(this.changeFunc.bind(this));
    this.gui.add(this.props, "end", 200, 2000).name("end frequency").onChange(this.changeFunc.bind(this));
    this.gui.add(this.props, "isCubic").name("cubic interpolation");
    this.gui.add(this.props, "scaleSize", 1/7 * 10, 1/2 * 10).name("scale size");
  }

  changeFunc(value){

    this.analyzer.setRange();
    
  }
  
}