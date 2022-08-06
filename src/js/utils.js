import moment from "moment";

export function searchURLParams() {
	const url = new URL(window.location.href);

	const id = url.searchParams.get("id");
	const start = url.searchParams.get("start");
	const stop = url.searchParams.get("stop");

	return { id, start, stop };
}

export function updateURLParam(param, value) {
	const url = new URL(window.location.href);
	url.searchParams.set(param, value);
	window.history.replaceState(null, null, url);
}

export function removeURLParam(param) {
	const url = new URL(window.location.href);
	url.searchParams.delete(param);
	window.history.replaceState(null, null, url);
}

export function humanizeTime(time) {
	if (!time) return null;
	return moment.utc(time * 1000).format("HH:mm:ss");
}
