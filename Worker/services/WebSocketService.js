import AsyncStorage from '@react-native-async-storage/async-storage';
// WebSocketService.js
class WebSocketService {
    constructor() {
        this.url = 'ws://192.168.1.36:3000';
        this.socket = null;
    }

    async connect(onOpen, onMessage, onError, onClose) {
        this.socket = new WebSocket(this.url);
        this.workerToken = await AsyncStorage.getItem('userToken');
        this.socket.onopen = () => {
            console.log('WebSocket connection established');
            if (this.workerToken) {
                const message = JSON.stringify({ token: this.workerToken, online: true });
                this.send(message);
            }
            if (onOpen) onOpen();
        };

        this.socket.onmessage = (message) => {
            console.log('Received:', message.data);
            if (onMessage) onMessage(message);
        };

        this.socket.onerror = (error) => {
            console.log('WebSocket error:', error);
            if (onError) onError(error);
        };

        this.socket.onclose = () => {
            console.log('WebSocket connection closed');
            if (onClose) onClose();
            this.socket = null;
        };
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
            this.socket.close();
        }
    }
}

export default WebSocketService;
