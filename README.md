# Server Panel

A modern web-based control panel for managing game servers, built with Vue 3, TypeScript, and Vite.

## Features

- 🎮 Server Management
  - Real-time server status monitoring
  - Player count tracking
  - Server configuration management
  - Start/Stop/Restart controls

- 🔧 Mod Management
  - Install and manage server mods
  - Configure mod settings
  - Real-time mod status updates
  - Dependency management

- ⚙️ Configuration Editor
  - Built-in config file editor
  - Syntax highlighting
  - Auto-save support
  - Version history

- 📝 Console Access
  - Real-time console output
  - Command execution
  - Log filtering and search
  - Log export functionality

## Tech Stack

- **Frontend Framework**: Vue 3 with TypeScript
- **Build Tool**: Vite
- **State Management**: Pinia
- **Routing**: Vue Router
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Mock API**: Mirage.js
- **Testing**: Vitest

## Getting Started

### Prerequisites

- Node.js 16.x or later
- npm 7.x or later

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/server-panel.git
cd server-panel
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Project Structure

```
server-panel/
├── src/
│   ├── components/     # Reusable Vue components
│   │   ├── svrmgr/    # Server management components
│   │   └── users/     # User management components
│   ├── layouts/       # Layout components
│   ├── stores/        # Pinia stores
│   ├── types/         # TypeScript type definitions
│   ├── utils/         # Utility functions
│   └── views/         # Page components
├── mockServer/        # Mock API server
├── docs/             # Documentation
└── public/           # Static assets
```

## Development

### Key Components

1. **Server Management**
   - ServerList: Main server overview
   - ServerCard: Individual server display
   - ServerStatus: Real-time status monitoring

2. **Mod Management**
   - ModList: Installed mods overview
   - ModCard: Individual mod display
   - ModConfig: Mod configuration editor

3. **Console**
   - ConsolePanel: Live console output
   - CommandInput: Command execution
   - LogViewer: Log display and filtering

### State Management

The application uses Pinia stores for state management:

- `serverStore`: Server status and configuration
- `modStore`: Mod management and settings
- `consoleStore`: Console logs and commands

### API Integration

All API calls are centralized in the `utils/api.ts` file, organized by feature:

- `serverApi`: Server management endpoints
- `modApi`: Mod management endpoints
- `consoleApi`: Console and logging endpoints

## Testing

Run tests with:
```bash
npm run test
```

Generate coverage report:
```bash
npm run coverage
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.