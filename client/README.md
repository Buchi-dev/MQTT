# IoT Dashboard

This project is a real-time dashboard that visualizes data from IoT devices using MQTT over WebSocket.

## Features

- Real-time sensor data visualization
- Historical data table with sorting functionality
- Line charts for tracking sensor trends over time
- Connection status monitoring

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

```bash
npm install
npm run dev
```

## Usage

1. Start the Mosquitto MQTT broker with WebSocket support.
2. Start the IoT Simulator (see the Simulator project) to begin generating and publishing data.
3. Start this dashboard application to visualize the data in real-time.

## MQTT Topics

- `iot/simulated/data` - Topic where the dashboard subscribes to receive sensor data

## Dashboard Sections

1. **Current Readings** - Displays the latest sensor readings
2. **Sensor Data Trends** - Line chart showing the change in sensor values over time
3. **Data History** - Table with historical sensor readings and sorting capability
4. **Status Bar** - Shows connection status and last data update time
