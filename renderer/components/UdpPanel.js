import { startUDP, onUDP } from "../services/api.js";
import JsonViewer from "./JsonViewer.js";

export default class UdpPanel {
    constructor() {
        this.viewer = new JsonViewer();
        this.buildUI();

        onUDP((message) => {
            this.receivePacket(message);
        });
    }

    buildUI() {
        this.element = document.createElement("div");
        this.element.className = "panel";

        const title = document.createElement("div");
        title.className = "panel-title";
        title.textContent = "UDP Monitor";
        this.element.appendChild(title);

        const controls = document.createElement("div");
        controls.className = "udp-controls";

        const portField = document.createElement("div");
        portField.className = "field";
        const portLabel = document.createElement("label");
        portLabel.textContent = "Port";
        this.portInput = document.createElement("input");
        this.portInput.type = "number";
        this.portInput.value = 5000;
        this.portInput.min = 1;
        this.portInput.max = 65535;
        portField.append(portLabel, this.portInput);
        controls.appendChild(portField);

        this.startButton = document.createElement("button");
        this.startButton.className = "btn btn-success";
        this.startButton.textContent = "Start";
        this.startButton.addEventListener("click", () => {
            startUDP(Number(this.portInput.value));
            this.portInput.disabled = true;
            this.startButton.disabled = true;
            this.startButton.textContent = "Listening…";
        });
        controls.appendChild(this.startButton);

        this.element.appendChild(controls);
        this.element.appendChild(this.viewer.element);
    }

    receivePacket(message) {
        try {
            const json = JSON.parse(message);
            this.viewer.setJSON(json);
        } catch (err) {
            this.viewer.element.textContent = message;
        }
    }
}