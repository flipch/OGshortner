//UberViz ControlsHandler
//Handles side menu controls

var ControlsHandler = function() {

	var audioParams = {
		useMic: false,
		useSample: true,
		showDebug:false,
		volSens:2.2,
		beatHoldTime:40,
		beatDecayRate:0.97,
		bpmMode: false,
		bpmRate:0,
		sampleURL: "assets/fy.mp3"
	};

	var vizParams = {
		fullSize: true,
		showControls: false,
		// useBars: false,
		// useGoldShapes: true,
		// useNebula:true,
		// useNeonShapes:true,
		// useStripes:true,
		// useTunnel:true,
		// useWaveform:true,
	};

	var fxParams = {
		glow: 1.0
	};

	function init(){
		AudioHandler.onUseSample();
	}

	return {
		init:init,
		audioParams: audioParams,
		fxParams: fxParams,
		vizParams:vizParams
	};
}();