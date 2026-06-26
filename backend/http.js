import axios from "axios";

async function sendRequest(config) {
    const response = await axios({
        method: config.method,
        url: config.url,
        params: config.query,
        data: config.body,
        timeout: 10000
    });

    return {
        status: response.status,
        body: response.data
    };
}

export { sendRequest };