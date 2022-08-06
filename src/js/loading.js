export default class Loading {
	#loading;
	constructor(container) {
		this.container = container;
		const HTML = `<div class="lds-ring"><div></div><div></div><div></div><div></div></div>`;
		const template = document.createElement("template");
		template.innerHTML = HTML;
		this.#loading = template.content.querySelector(".lds-ring");
	}

	show() {
		this.container.append(this.#loading);
	}

	destroy() {
		if (this.#loading) this.#loading.remove();
	}
}
