import HttpPanel from "./components/HttpPanel.js";
import UdpPanel from "./components/UdpPanel.js";

const app = document.getElementById("app");

const httpPanel = new HttpPanel();
const udpPanel = new UdpPanel();

app.appendChild(httpPanel.element);
app.appendChild(udpPanel.element);