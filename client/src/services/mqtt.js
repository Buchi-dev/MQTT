import mqtt from 'mqtt';

// MQTT broker WebSocket URL
const MQTT_BROKER_URL = 'ws://localhost:9001';

// Topic for simulated IoT data
export const IOT_DATA_TOPIC = 'iot/simulated/data';

let client = null;
let isConnected = false;
let messageCallbacks = [];

/**
 * Connect to MQTT broker
 * @returns {Promise} Promise that resolves when connected
 */
export const connectMqtt = () => {
  return new Promise((resolve, reject) => {
    if (client && isConnected) {
      resolve(client);
      return;
    }

    try {
      client = mqtt.connect(MQTT_BROKER_URL, {
        clientId: `iot-dashboard-${Date.now()}`,
        clean: true
      });

      client.on('connect', () => {
        console.log('Connected to MQTT broker');
        isConnected = true;
        resolve(client);
      });

      client.on('message', (topic, message) => {
        try {
          const parsedMessage = JSON.parse(message.toString());
          messageCallbacks.forEach(callback => {
            callback(topic, parsedMessage);
          });
        } catch (error) {
          console.error('Error parsing MQTT message:', error);
        }
      });

      client.on('error', (err) => {
        console.error('MQTT error:', err);
        isConnected = false;
        reject(err);
      });

      client.on('close', () => {
        console.log('MQTT connection closed');
        isConnected = false;
      });

    } catch (error) {
      console.error('Failed to connect to MQTT:', error);
      reject(error);
    }
  });
};

/**
 * Subscribe to a topic
 * @param {string} topic - Topic to subscribe to
 */
export const subscribeTopic = (topic) => {
  if (!client || !isConnected) {
    console.error('MQTT client not connected');
    return;
  }

  client.subscribe(topic, (err) => {
    if (err) {
      console.error(`Error subscribing to ${topic}:`, err);
      return;
    }
    console.log(`Subscribed to ${topic}`);
  });
};

/**
 * Register a callback for MQTT messages
 * @param {Function} callback - Callback function that receives topic and message
 */
export const onMessage = (callback) => {
  if (typeof callback === 'function') {
    messageCallbacks.push(callback);
  }
};

/**
 * Unregister a message callback
 * @param {Function} callback - Callback function to remove
 */
export const offMessage = (callback) => {
  messageCallbacks = messageCallbacks.filter(cb => cb !== callback);
};

/**
 * Disconnect from MQTT broker
 */
export const disconnectMqtt = () => {
  if (client && isConnected) {
    client.end();
    isConnected = false;
    client = null;
    console.log('Disconnected from MQTT broker');
  }
}; 