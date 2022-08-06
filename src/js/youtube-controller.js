export default class YoutubeController {
	#videoId;
	#container;
	#player;
	#startTime;
	#stopTime;
	#interval;
	#readyEvent;
	#sensitivity;
	constructor({ container = "player", videoId, startTime = 0, stopTime = null, sensitivity = 1000 }) {
		this.#container = container;
		this.#startTime = startTime;
		this.#stopTime = stopTime;
		this.#videoId = videoId;
		this.#interval = null;
		this.#readyEvent = () => {};
		this.#sensitivity = sensitivity;
	}

	get startTime() {
		return this.#startTime;
	}

	get stopTime() {
		return this.#stopTime;
	}

	/**
	 * @param {Number} time
	 */
	set startTime(time) {
		this.#startTime = time;
	}

	/**
	 * @param {Number} time;
	 */
	set stopTime(time) {
		this.#stopTime = time;
	}

	/**
	 * @param {Function} func
	 */
	set readyEvent(func) {
		this.#readyEvent = func;
	}

	getCurrentTime() {
		return this.#player.getCurrentTime();
	}

	show() {
		this.#player = new YT.Player(this.#container, {
			videoId: this.#videoId,
			playerVars: {
				autoplay: 1,
				loop: 1,
				modestbranding: 1,
			},
			events: {
				onReady: (e) => {
					this.#onVideoReady(e);
				},
				onStateChange: (e) => {
					this.#onStateChange(e);
				},
			},
		});
	}

	destroy() {
		clearInterval(this.#interval);
		this.#player.destroy();
	}

	#onStateChange(event) {
		if (event.data === YT.PlayerState.PLAYING) {
			if (!this.#interval) this.#startCheck();
		} else if (event.data === YT.PlayerState.PAUSED) {
			this.#stopCheck();
		}
	}

	#onVideoReady(event) {
		this.#player.playVideo();
		this.#readyEvent();
		if (!this.#stopTime) this.#stopTime = this.#player.getDuration();
	}

	#startCheck() {
		this.#interval = setInterval(() => {
			this.#check();
		}, this.#sensitivity);
	}

	#stopCheck() {
		clearInterval(this.#interval);
		this.#interval = null;
	}

	#check() {
		const currentTime = Math.round(this.#player.getCurrentTime());

		if (currentTime >= this.#stopTime || currentTime < this.#startTime) {
			this.#player.seekTo(this.#startTime, true);
		}
	}
}
