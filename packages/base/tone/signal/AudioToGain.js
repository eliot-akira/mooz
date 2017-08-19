var Tone = require('../core/Tone');
require('../signal/WaveShaper');
require('../signal/Signal');

module.exports = (function(){

  

  /**
   *  @class AudioToGain converts an input in AudioRange [-1,1] to NormalRange [0,1]. 
   *         See Tone.GainToAudio.
   *
   *  @extends {Tone.SignalBase}
   *  @constructor
   *  @example
   *  var a2g = new Tone.AudioToGain();
   */
  Tone.AudioToGain = function(){

    /**
     *  @type {WaveShaperNode}
     *  @private
     */
    this._norm = this.input = this.output = new Tone.WaveShaper(function(x){
      return (x + 1) / 2;
    });
  };

  Tone.extend(Tone.AudioToGain, Tone.SignalBase);

  /**
   *  clean up
   *  @returns {Tone.AudioToGain} this
   */
  Tone.AudioToGain.prototype.dispose = function(){
    Tone.prototype.dispose.call(this);
    this._norm.dispose();
    this._norm = null;
    return this;
  };

  return Tone.AudioToGain;
})();