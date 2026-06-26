import { FusesPlugin } from '@electron-forge/plugin-fuses';
import { FuseV1Options, FuseVersion } from '@electron/fuses';

export const packagerConfig = {
  asar: true,
  icon: "./assets/icon",
  ignore: [
    /\.git/,
    /node_modules\/\..+/,
    /\.vscode/,
    /\.idea/,
  ],
};
export const rebuildConfig = {};
export const makers = [
  {
    name: '@electron-forge/maker-squirrel',
    config: {
      setupIcon: './assets/icon.ico',
    },
  },
  {
    name: '@electron-forge/maker-deb',
    config: {
      icon: './assets/icon.png',
      depends: ['libgtk-3-0', 'libnss3', 'libxss1', 'libasound2', 'libatk-bridge2.0-0', 'libdrm2', 'libgbm1'],
    },
  },
];
export const plugins = [
  {
    name: '@electron-forge/plugin-auto-unpack-natives',
    config: {},
  },
  // Fuses are used to enable/disable various Electron functionality
  // at package time, before code signing the application
  new FusesPlugin({
    version: FuseVersion.V1,
    [FuseV1Options.RunAsNode]: false,
    [FuseV1Options.EnableCookieEncryption]: true,
    [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
    [FuseV1Options.EnableNodeCliInspectArguments]: false,
    [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
    [FuseV1Options.OnlyLoadAppFromAsar]: true,
  }),
];
