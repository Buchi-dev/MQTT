const { spawn } = require('child_process');
const path = require('path');
const os = require('os');

// Determine the command prefix based on OS
const isWindows = os.platform() === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

// Define the paths to our projects
const SIMULATOR_SERVER_PATH = path.join(__dirname, 'Simulator', 'server');
const SIMULATOR_CLIENT_PATH = path.join(__dirname, 'Simulator', 'client');
const DASHBOARD_PATH = path.join(__dirname, 'client');

// Log colors
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Function to create a process
function startProcess(name, cwd, command, args, color) {
  console.log(`${color}Starting ${name}...${colors.reset}`);

  const process = spawn(command, args, {
    cwd,
    stdio: 'pipe',
    shell: true
  });

  // Prefix the output with the process name
  process.stdout.on('data', (data) => {
    const lines = data.toString().trim().split('\n');
    lines.forEach(line => {
      if (line.trim()) {
        console.log(`${color}[${name}] ${line.trim()}${colors.reset}`);
      }
    });
  });

  process.stderr.on('data', (data) => {
    const lines = data.toString().trim().split('\n');
    lines.forEach(line => {
      if (line.trim()) {
        console.log(`${color}[${name}] ERROR: ${line.trim()}${colors.reset}`);
      }
    });
  });

  process.on('close', (code) => {
    console.log(`${color}[${name}] Process exited with code ${code}${colors.reset}`);
  });

  process.on('error', (err) => {
    console.error(`${color}[${name}] Failed to start process: ${err}${colors.reset}`);
  });

  return process;
}

// Start all services
function startAll() {
  console.log(`${colors.green}Starting IoT Simulation System${colors.reset}`);
  console.log(`${colors.yellow}Press Ctrl+C to stop all processes${colors.reset}\n`);

  // Start Simulator Server
  const serverProcess = startProcess(
    'IoT Simulator Server',
    SIMULATOR_SERVER_PATH,
    npmCmd,
    ['start'],
    colors.cyan
  );

  // Start Simulator Client after a short delay
  setTimeout(() => {
    const simulatorClientProcess = startProcess(
      'IoT Simulator Client',
      SIMULATOR_CLIENT_PATH,
      npmCmd,
      ['run', 'dev'],
      colors.yellow
    );
  }, 2000);

  // Start Dashboard Client after a short delay
  setTimeout(() => {
    const dashboardProcess = startProcess(
      'Dashboard Client',
      DASHBOARD_PATH,
      npmCmd,
      ['run', 'dev'],
      colors.magenta
    );
  }, 4000);

  // Handle Ctrl+C
  process.on('SIGINT', () => {
    console.log(`\n${colors.red}Shutting down all processes...${colors.reset}`);
    // The child processes will be terminated automatically
    process.exit(0);
  });
}

// Start everything
startAll(); 