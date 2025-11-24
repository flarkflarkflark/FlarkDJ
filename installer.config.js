module.exports = {
  appId: 'com.flarkdj.app',
  productName: 'FlarkDJ',
  directories: {
    output: 'release',
    buildResources: 'build'
  },
  files: [
    'dist/**/*',
    'node_modules/**/*',
    'package.json'
  ],
  mac: {
    target: ['dmg', 'zip'],
    category: 'public.app-category.music',
    icon: 'build/icon.icns'
  },
  win: {
    target: ['nsis', 'portable'],
    icon: 'build/icon.ico'
  },
  linux: {
    target: ['AppImage', 'deb', 'rpm'],
    category: 'Audio',
    icon: 'build/icon.png'
  },
  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: true,
    createDesktopShortcut: true,
    createStartMenuShortcut: true
  }
};
