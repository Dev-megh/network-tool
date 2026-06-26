import { sendRequest } from "../services/api.js";

export default class HttpPanel {
    constructor() {
        this.buildUI();
        this.paramRows = [];
    }

    buildUI() {
        this.element = document.createElement("div");
        this.element.className = "panel";

        const title = document.createElement("div");
        title.className = "panel-title";
        title.textContent = "HTTP Request";
        this.element.appendChild(title);

        const topRow = document.createElement("div");
        topRow.className = "http-row-top";

        const methodField = this._createField("Method", "select", "GET", ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"]);
        topRow.appendChild(methodField);

        const protoField = this._createField("Protocol", "select", "http", ["http", "https"]);
        topRow.appendChild(protoField);

        const hostField = this._createField("Host+Port", "input", "192.168.4.1:80", null, "text");
        const hostInput = hostField.querySelector("input");
        hostInput.placeholder = "localhost:3000 or example.com";
        topRow.appendChild(hostField);

        const pathField = this._createField("Path", "input", "", null, "text");
        const pathInput = pathField.querySelector("input");
        pathInput.placeholder = "/api/users";
        topRow.appendChild(pathField);

        this.element.appendChild(topRow);

        this.methodSelect = methodField.querySelector("select");
        this.protoSelect = protoField.querySelector("select");
        this.hostInput = hostField.querySelector("input");
        this.pathInput = pathField.querySelector("input");

        // Query Parameters
        const paramsLabel = document.createElement("div");
        paramsLabel.className = "section-label";
        paramsLabel.textContent = "Query Parameters";
        this.element.appendChild(paramsLabel);

        this.paramsContainer = document.createElement("div");
        this.paramsContainer.className = "params-container";
        this.element.appendChild(this.paramsContainer);

        const addParamBtn = document.createElement("button");
        addParamBtn.className = "btn btn-sm btn-add-param";
        addParamBtn.textContent = "+ Add Parameter";
        addParamBtn.type = "button";
        addParamBtn.addEventListener("click", () => this._addParamRow("", ""));
        this.element.appendChild(addParamBtn);

        const bodyLabel = document.createElement("div");
        bodyLabel.className = "section-label";
        bodyLabel.textContent = "Request Body (JSON)";
        this.element.appendChild(bodyLabel);

        this.bodyTextarea = document.createElement("textarea");
        this.bodyTextarea.placeholder = '{\n  "message": "Hello"\n}';
        this.bodyTextarea.rows = 5;
        this.element.appendChild(this.bodyTextarea);

        this.sendBtn = document.createElement("button");
        this.sendBtn.className = "btn btn-primary btn-block";
        this.sendBtn.textContent = "Send Request";
        this.sendBtn.type = "button";
        this.sendBtn.addEventListener("click", () => this.send());
        this.element.appendChild(this.sendBtn);

        // Response Area
        const responseArea = document.createElement("div");
        responseArea.className = "response-area";

        this.statusLine = document.createElement("div");
        this.statusLine.className = "response-status";
        this.statusLine.textContent = "Response";
        this.statusBadge = document.createElement("span");
        this.statusBadge.className = "badge";
        this.statusBadge.textContent = "—";
        this.statusLine.appendChild(this.statusBadge);
        responseArea.appendChild(this.statusLine);

        this.responseBody = document.createElement("div");
        this.responseBody.className = "response-body empty";
        this.responseBody.textContent = "Send a request to see the response.";
        responseArea.appendChild(this.responseBody);

        this.element.appendChild(responseArea);

        this.bodyTextarea.addEventListener("keydown", (e) => {
            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                this.send();
            }
        });
    }

    _createField(labelText, tag, defaultValue, options, type) {
        const wrapper = document.createElement("div");
        wrapper.className = "field";

        const label = document.createElement("label");
        label.textContent = labelText;
        wrapper.appendChild(label);

        let input;
        if (tag === "select") {
            input = document.createElement("select");
            options.forEach(opt => {
                const option = document.createElement("option");
                option.value = opt;
                option.textContent = opt;
                input.appendChild(option);
            });
            input.value = defaultValue;
        } else {
            input = document.createElement("input");
            input.type = type || "text";
            input.value = defaultValue;
        }
        wrapper.appendChild(input);
        return wrapper;
    }

    _addParamRow(keyVal, valueVal) {
        const row = document.createElement("div");
        row.className = "param-row";

        const keyInput = document.createElement("input");
        keyInput.type = "text";
        keyInput.placeholder = "Key";
        keyInput.value = keyVal || "";
        keyInput.spellcheck = false;

        const valInput = document.createElement("input");
        valInput.type = "text";
        valInput.placeholder = "Value";
        valInput.value = valueVal || "";
        valInput.spellcheck = false;

        const removeBtn = document.createElement("button");
        removeBtn.className = "btn-remove";
        removeBtn.textContent = "×";
        removeBtn.type = "button";
        removeBtn.title = "Remove parameter";
        removeBtn.addEventListener("click", () => {
            row.remove();
            const idx = this.paramRows.indexOf(row);
            if (idx > -1) this.paramRows.splice(idx, 1);
        });

        row.append(keyInput, valInput, removeBtn);

        row.keyInput = keyInput;
        row.valInput = valInput;

        this.paramsContainer.appendChild(row);
        this.paramRows.push(row);
        return row;
    }

    _getParams() {
        const params = {};
        for (const row of this.paramRows) {
            const key = row.keyInput.value.trim();
            const val = row.valInput.value.trim();
            if (key) {
                params[key] = val;
            }
        }
        return params;
    }

    async send() {
        const protocol = this.protoSelect.value;
        const method = this.methodSelect.value;
        let hostPort = this.hostInput.value.trim() || "192.168.4.1:80";
        const path = this.pathInput.value.trim() || "";

        let host, port;
        if (hostPort.includes(":")) {
            const parts = hostPort.split(":");
            host = parts[0];
            port = parts[1] || (protocol === "https" ? "443" : "80");
        } else {
            host = hostPort;
            port = protocol === "https" ? "443" : "80";
        }

        let url = `${protocol}://${host}:${port}`;
        if (path) {
            url += path.startsWith("/") ? path : "/" + path;
        }

        const query = this._getParams();

        let body = undefined;
        const bodyRaw = this.bodyTextarea.value.trim();
        if (bodyRaw) {
            try {
                body = JSON.parse(bodyRaw);
            } catch (_) {
                alert("Invalid JSON in request body.");
                return;
            }
        }

        this.sendBtn.disabled = true;
        this.sendBtn.textContent = "Sending…";
        this.statusBadge.style.color = "";
        this.statusBadge.style.backgroundColor = "";

        try {
            const response = await sendRequest({
                method,
                url,
                query,
                body
            });

            this.statusBadge.textContent = `${response.status}`;
            this.statusBadge.style.color = "";
            this.statusBadge.style.backgroundColor = "";
            this.responseBody.className = "response-body";
            const data = response.body;
            if (typeof data === "object") {
                this.responseBody.textContent = JSON.stringify(data, null, 2);
            } else if (typeof data === "string") {
                this.responseBody.textContent = data;
            } else {
                this.responseBody.textContent = String(data);
            }
        } catch (err) {
            this.statusBadge.textContent = "Error";
            this.statusBadge.style.color = "#b91c1c";
            this.statusBadge.style.backgroundColor = "#fee2e2";
            this.responseBody.className = "response-body";

            let errorMsg = "";
            if (err.response) {
                const status = err.response.status;
                const statusText = err.response.statusText || "Unknown error";
                errorMsg = `${status} ${statusText}`;
                if (err.response.data) {
                    let dataStr = "";
                    if (typeof err.response.data === "object") {
                        dataStr = JSON.stringify(err.response.data, null, 2);
                    } else {
                        dataStr = String(err.response.data);
                    }
                    errorMsg += `\n\nResponse body:\n${dataStr}`;
                }
            } else if (err.request) {
                errorMsg = "No response received. Check your network connection, or the server may be down.";
            } else {
                errorMsg = err.message || "An unexpected error occurred.";
            }
            this.responseBody.textContent = errorMsg;
        } finally {
            this.sendBtn.disabled = false;
            this.sendBtn.textContent = "Send Request";
        }
    }
}