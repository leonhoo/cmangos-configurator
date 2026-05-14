# Cmangos Configurator

### To facilitate modifying the configuration of the Cmangos service, a lightweight configuration management tool built with Tauri 2 + React

**English** | [中文](./README_CN.md)

## Features

- 🖥️ **Native macOS\-style UI**, clean and elegant

- 📝 **New Config**: Generate default config from YAML template

- 📂 **Import Config**: Import `key=value` config files and auto\-override

- ✏️ **Edit Config**: Modal editor with multi\-line description \&amp; highlighted values

- 💾 **Save As**: Export to standard `key=value` config files

- 🔍 **Search**: Filter by group, key, value, or description

- 🌐 **I18n**: Switch between Chinese / English

- 📝 **Logs**: Logs for import, edit, save; errors in red

- 📦 **Lightweight**: Built with Tauri 2, fast \&amp; small

## Tech Stack

- **Frontend**: React \+ JavaScript

- **Desktop**: Tauri 2 \(Rust\)

- **Files**: YAML, Tauri FS / Dialog Plugins

- **I18n**: i18next

## Install \&amp; Run

### Requirements

- Node\.js 18\+

- Rust environment \(for Tauri 2\)

### Dev Mode

```bash
npm install
npm run tauri dev
```

### Build

```bash
npm run tauri build
```

## Usage

1. **New Config**: Generate default config from YAML

2. **Import Config**: Select `\.conf` file to merge

3. **Edit Config**: Click any item to open editor

4. **Search**: Real\-time filter in top bar

5. **Save As**: Export to `key=value` format

6. **Logs**: Toggle log panel to view operations

## License

MIT