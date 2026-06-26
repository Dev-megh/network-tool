export default class JsonViewer {
    constructor() {
        this.element = document.createElement("pre");
        this.element.className = "json-viewer";
    }

    setJSON(data) {
        this.element.textContent = JSON.stringify(data, null, 2);
    }
}