class Controls{
  constructor(analyzer){
    this.analyzer = analyzer;
    this.props = {
      // start: 1,
      end: 700
    };
    this.init();
  }

  init(){
    this.gui = new dat.GUI({width: 300});
    // this.gui.remember(this.controls);

    // this.gui.add(this.props, "start", 1, 90).name("start frequency").onChange(this.changeFunc.bind(this));
    this.gui.add(this.props, "end", 100, 6000).name("end frequency").onChange(this.changeFunc.bind(this));
  }

  changeFunc(value){

    this.analyzer.setRange();
    
  }
  
}