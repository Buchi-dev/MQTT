# IoT Device Simulator

This project simulates an IoT device that generates random sensor data and publishes it to an MQTT broker via WebSocket.

## Architecture

The project consists of two parts:

1. **Server**: An Express.js application that generates random sensor data (temperature, humidity, pressure, light) and publishes it to an MQTT broker.

2. **Client**: A React application that provides a user interface for controlling the simulator and displaying the published data.

## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- MQTT Broker (Mosquitto) running locally with WebSocket support on port 9001

## Setup Mosquitto MQTT Broker

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

## Installation

### Server

```bash
cd server
npm install
npm start
```

### Client

```bash
cd client
npm install
npm run dev
```

## Usage

1. Start the Mosquitto MQTT broker with WebSocket support.
2. Start the server to begin generating and publishing data.
3. Start the client to control the simulator and see the data being published.

The server has APIs to start and stop the simulation:

- GET `/api/status` - Get the current status of the simulator
- POST `/api/simulation/start` - Start the simulation
- POST `/api/simulation/stop` - Stop the simulation

## MQTT Topics

- `iot/simulated/data` - Topic where the simulator publishes the sensor data 