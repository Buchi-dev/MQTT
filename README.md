# MQTT IoT Simulation System

This project is a full-stack IoT simulation built to simulate real-time data from IoT devices and visualize that data in a frontend dashboard. It consists of two separate systems, each designed using React and Express.js, communicating through MQTT over WebSocket.

## Project Structure

The project is organized into two main systems:

1. **Simulated IoT Device (Publisher)** - Located in the `Simulator` directory
   - Client: React frontend for controlling the device simulator
   - Server: Express.js backend that generates random sensor data and publishes it via MQTT

2. **Frontend Dashboard (Subscriber)** - Located in the `client` directory
   - React application that subscribes to the MQTT topic and visualizes the sensor data

## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- MQTT Broker (Mosquitto) running locally with WebSocket support on port 9001

## MQTT Broker Setup

1. Download and install Mosquitto from [https://mosquitto.org/download/](https://mosquitto.org/download/)

2. Create a configuration file `mosquitto.conf` with the following content:

```
listener 1883
listener 9001
protocol websockets
allow_anonymous true
```

3. Start Mosquitto with the configuration file:

```
mosquitto -c mosquitto.conf
```

## Quick Start (All Systems)

You can start all systems with a single command using the provided script:

```bash
# Install all dependencies for all components
npm run install-all

# Start all systems (server and both clients)
npm start
```

This will start:
- The IoT Simulator Server (Express)
- The IoT Simulator Client (React)
- The Dashboard Client (React)

Each system's console output will be color-coded for easy identification.

## Manual Installation and Setup

If you prefer to start each component individually:

### 1. IoT Device Simulator

```bash
# Install and start the server
cd Simulator/server
npm install
npm start

# In a new terminal, install and start the client
cd Simulator/client
npm install
npm run dev
```

### 2. Dashboard

```bash
cd client
npm install
npm run dev
```

## How It Works

1. The IoT Simulator generates random sensor data (temperature, humidity, pressure, light)
2. The simulator publishes this data to the MQTT topic `iot/simulated/data` via WebSocket
3. The Dashboard subscribes to the same topic and receives the data in real-time
4. The Dashboard visualizes the data using charts, tables, and other UI components

## Communication Flow

```
IoT Simulator (Express) --publishes--> MQTT Broker <--subscribes-- Dashboard (React)
                          [iot/simulated/data]
```

## User Interface

Both applications are built using the ChanCC UI library, which provides modern and clean UI components for a consistent look and feel across the systems.

## Available Scripts

- `npm start` - Start all systems concurrently
- `npm run install-all` - Install dependencies for all components
- `npm run start-simulator-server` - Start only the simulator server
- `npm run start-simulator-client` - Start only the simulator client
- `npm run start-dashboard` - Start only the dashboard

## Technologies Used

- **Frontend**:
  - React
  - Chart.js (for data visualization)
  - MQTT.js (for MQTT over WebSocket)
  - ChanCC UI components

- **Backend**:
  - Express.js
  - MQTT.js (for MQTT over WebSocket)

- **Communication**:
  - MQTT over WebSocket (Mosquitto broker)

See the individual README files in each directory for more detailed information about each system. 