// WebSocketService.js
import AsyncStorage from '@react-native-async-storage/async-storage';

class WebSocketService {
    constructor() {
        this.url = 'ws://192.168.1.36:3000';
        this.socket = null;
        this.workerToken = null;
        this.reconnectInterval = 5000; // Interval để thử kết nối lại khi mất kết nối
    }

    async connect(onOpen, onMessage, onError, onClose) {
        this.workerToken = await AsyncStorage.getItem('userToken');
        this.socket = new WebSocket(this.url);

        this.socket.onopen = () => {
            console.log('WebSocket connection established');
            if (this.workerToken) {
                const message = JSON.stringify({ token: this.workerToken, online: true });
                this.send(message);
            }
            if (onOpen) onOpen();
        };

        this.socket.onmessage = (message) => {
            try {
                const data = JSON.parse(message.data);
                console.log('Received:', data);

                if (onMessage) onMessage(data);
            } catch (error) {
                console.error('Failed to parse WebSocket message:', error);
            }
        };

        this.socket.onerror = (error) => {
            console.error('WebSocket error:', error);
            if (onError) onError(error);
        };

        this.socket.onclose = () => {
            console.log('WebSocket connection closed');
            if (onClose) onClose();
            this.socket = null;
        };
    }

    async sendLocation(lat, long) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN && this.workerToken) {
            const message = JSON.stringify({ token: this.workerToken, lat, long });
            this.send(message);
        }
    }

    async sendOffline() {
        if (this.socket && this.socket.readyState === WebSocket.OPEN && this.workerToken) {
            const message = JSON.stringify({ token: this.workerToken, online: false });
            this.send(message);
        }
    }

    send(message) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(message);
        } else {
            console.error('WebSocket is not open');
        }
    }

    close() {
        if (this.socket) {
            this.sendOffline();
            this.socket.close();
        }
    }
}

export default WebSocketService;
