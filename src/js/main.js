import Loading from "./loading";
import YoutubeController from "./youtube-controller";
import {
	searchURLParams,
	updateURLParam,
	removeURLParam,
	humanizeTime,
	convertDurationToSeconds,
	getId,
} from "./utils";

let loadingAnimation;
let loadingContainer = document.querySelector(".player");
let youtubeController;

const startBtn = document.getElementById("set-start");
const stopBtn = document.getElementById("set-stop");
const searchbtn = document.getElementById("set-video");
const applyBtn = document.getElementById("apply");

const startInput = document.getElementById("start-time");
const stopInput = document.getElementById("stop-time");
const searchInput = document.getElementById("youtube-id");

window.addEventListener("DOMContentLoaded", () => {
	loadingAnimation = new Loading(loadingContainer);
	loadingAnimation.show();
});

window.addEventListener("load", () => {
	const { id, start, stop } = searchURLParams();
	if (id) {
		searchInput.value = id;
		youtubeController = new YoutubeController({ videoId: id });
		if (start) {
			youtubeController.startTime = start;
			startInput.value = humanizeTime(start);
		}
		if (stop) {
			youtubeController.stopTime = stop;
			stopInput.value = humanizeTime(stop);
		}
		youtubeController.show();
		youtubeController.readyEvent = () => loadingAnimation.destroy();
	} else {
		loadingAnimation.destroy();
	}
});

startBtn.addEventListener("click", (_) => {
	if (!youtubeController) return;
	const time = Math.round(youtubeController.getCurrentTime());
	youtubeController.startTime = time;
	startInput.value = humanizeTime(time);
	updateURLParam("start", time);
});

stopBtn.addEventListener("click", (_) => {
	if (!youtubeController) return;
	const time = Math.round(youtubeController.getCurrentTime());
	if (youtubeController.startTime >= time) return;
	youtubeController.stopTime = time;
	stopInput.value = humanizeTime(time);
	updateURLParam("stop", time);
});

searchbtn.addEventListener("click", (_) => {
	if (youtubeController) youtubeController.destroy();

	loadingAnimation = new Loading(loadingContainer);
	loadingAnimation.show();
	let id = getId(searchInput.value);
	youtubeController = new YoutubeController({ videoId: id });
	updateURLParam("id", id);
	removeURLParam("start");
	removeURLParam("stop");
	youtubeController.readyEvent = () => loadingAnimation.destroy();
	youtubeController.show();
});

applyBtn.addEventListener("click", (_) => {
	const startTime = convertDurationToSeconds(startInput.value);
	const stopTime = convertDurationToSeconds(stopInput.value);
	if (startTime >= stopTime) return;

	youtubeController.startTime = startTime;
	youtubeController.stopTime = stopTime;
	updateURLParam("start", startTime);
	updateURLParam("stop", stopTime);
});
