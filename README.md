# Network Tool

A lightweight Electron‑based network diagnostic utility with a clean dual‑panel UI.  
Send HTTP requests (all methods) with custom query parameters and monitor UDP packets – all in one place.

## Features

- **HTTP Client** – full method support: GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS  
- **Separate fields** for protocol, host, port, path, and query parameters  
- **UDP Monitor** – listen on any port and display incoming messages  
- **Split‑panel layout** – HTTP and UDP side by side  
- **JSON‑aware** – response bodies and UDP payloads are formatted automatically  
- **Minimal design** – no gradients, no purple, no AI‑generated look  

## Installation

```bash
git clone <repository-url>
cd network-tool
npm install
```

## Usage

### Development

```bash
npm start
```

### Building

Install a packager of your choice (Electron Forge or electron‑builder recommended), then build for your platform.

Example using Electron Forge:

```bash
npm install --save-dev @electron-forge/cli
npx electron-forge import
npm run make
```

The output will be in the `out/` directory.

### Installing the packaged app (Debian/Ubuntu)

After building the `.deb` package:

```bash
sudo dpkg -i out/make/deb/x64/network-tool_*.deb
```

## Uninstallation

If you installed the app via the `.deb` package, remove it with:

```bash
sudo dpkg -r network-tool
```

To delete leftover user configuration files (optional):

```bash
rm -rf ~/.config/network-tool
rm -rf ~/.local/share/network-tool
```