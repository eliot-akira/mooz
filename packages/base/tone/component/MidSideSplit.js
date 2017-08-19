var Tone = require('../core/Tone');
require('../signal/Expr');
require('../signal/Signal');
require('../component/Split');

module.exports = (function(){

  

  /**
   *  @class Mid/Side processing separates the the 'mid' signal 
   *         (which comes out of both the left and the right channel) 
   *         and the 'side' (which only comes out of the the side channels). <br><br>
   *         <code>
   *         Mid = (Left+Right)/sqrt(2);   // obtain mid-signal from left and right<br>
   *         Side = (Left-Right)/sqrt(2);   // obtain side-signal from left and righ<br>
   *         </code>
   *
   *  @extends {Tone}
   *  @constructor
   */
  Tone.MidSideSplit = function(){
    this.createInsOuts(0, 2);

    /**
     *  split the incoming signal into left and right channels
     *  @type  {Tone.Split}
     *  @private
     */
    this._split = this.input = new Tone.Split();

    /**
     *  The mid send. Connect to mid processing. Alias for
     *  <code>output[0]</code>
     *  @type {Tone.Expr}
     */
    this.mid = this.output[0] = new Tone.Expr("($0 + $1) * $2");

    /**
     *  The side output. Connect to side processing. Alias for
     *  <code>output[1]</code>
     *  @type {Tone.Expr}
     */
    this.side = this.output[1] = new Tone.Expr("($0 - $1) * $2");

    this._split.connect(this.mid, 0, 0);
    this._split.connect(this.mid, 1, 1);
    this._split.connect(this.side, 0, 0);
    this._split.connect(this.side, 1, 1);
    this.context.getConstant(Math.SQRT1_2).connect(this.mid, 0, 2);
    this.context.getConstant(Math.SQRT1_2).connect(this.side, 0, 2);
  };

  Tone.extend(Tone.MidSideSplit);

  /**
   *  clean up
   *  @returns {Tone.MidSideSplit} this
   */
  Tone.MidSideSplit.prototype.dispose = function(){
    Tone.prototype.dispose.call(this);
    this.mid.dispose();
    this.mid = null;
    this.side.dispose();
    this.side = null;
    this._split.dispose();
    this._split = null;
    return this;
  };

  return Tone.MidSideSplit;
})();