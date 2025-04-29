import mqtt from 'mqtt';

// MQTT broker URL (WebSocket)
const MQTT_BROKER_URL = 'ws://localhost:9001';

/**
 * Connect to MQTT broker
 * @returns {Promise<Object>} MQTT client
 */
export const connectMqttClient = () => {
  return new Promise((resolve, reject) => {
    console.log(`Connecting to MQTT broker at ${MQTT_BROKER_URL}...`);
    
    const client = mqtt.connect(MQTT_BROKER_URL, {
      clientId: `iot-simulator-${Date.now()}`
    });
    
    client.on('connect', () => {
      console.log('Connected to MQTT broker');
      resolve(client);
    });
    
    client.on('error', (err) => {
      console.error('MQTT connection error:', err);
      reject(err);
    });
    
    client.on('close', () => {
      console.log('MQTT connection closed');
    });
  });
};

/**
 * Publish data to MQTT topic
 * @param {Object} client - MQTT client
 * @param {string} topic - Topic to publish to
 * @param {Object} data - Data to publish
 */
export const publishData = (client, topic, data) => {
  if (!client || !client.connected) {
    console.error('MQTT client not connected');
    return;
  }
  
  try {
    client.publish(topic, JSON.stringify(data), { qos: 0, retain: false }, (err) => {
      if (err) {
        console.error('Error publishing to MQTT:', err);
      }
    });
  } catch (error) {
    console.error('Error publishing to MQTT:', error);
  }
}; 