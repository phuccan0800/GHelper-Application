import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiCall from '../Api/api';

class WebSocketService {
    static instance;

    constructor() {
        if (WebSocketService.instance) {
            return WebSocketService.instance;
        }
        this.url = 'ws://192.168.1.36:3000'; // Cập nhật địa chỉ WebSocket nếu cần
        this.socket = null;
        this.workerToken = null;
        this.isOnline = false;
        WebSocketService.instance = this;
    }

    async connect(onOpen, onMessage, onError, onClose) {
        this.workerToken = await AsyncStorage.getItem('userToken');
        this.wrokerStatus = (await ApiCall.getWorkerStatus()).data;
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            console.log('WebSocket is already connected');
            return;
        }

        if (!this.workerToken) {
            console.error('Missing worker token');
            return;
        }

        this.socket = new WebSocket(this.url);

        this.socket.onopen = () => {
            console.log('WebSocket connection established');

            const message = JSON.stringify({ type: 'TOGGLE_ONLINE_STATUS', token: this.workerToken, online: true, status: this.wrokerStatus.status });
            this.send(message);
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

    send(message) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(message);
        }
    }

    async sendLocation(lat, long) {
        if (!this.workerToken) {
            console.error('Missing worker token');
            return;
        }

        const message = JSON.stringify({ type: 'UPDATE_LOCATION', token: this.workerToken, lat, long });
        this.send(message);
    }

    async acceptJob(bookingId) {
        if (!this.workerToken) {
            console.error('Missing worker token');
            return;
        }

        const message = JSON.stringify({ type: 'JOB_ACCEPT', token: this.workerToken, bookingId });
        console.log('Accepting job with message:', message);
        this.send(message);
    }

    async completeJob(bookingId) {
        this.workerToken = await AsyncStorage.getItem('userToken');
        if (!this.workerToken) {
            console.error('Missing worker token');
            return;
        }

        const message = JSON.stringify({ type: 'JOB_COMPLETE', token: this.workerToken, bookingId });
        this.send(message);
    }

    async declineJob(bookingId) {
        if (!this.workerToken) {
            console.error('Missing worker token');
            return;
        }

        const message = JSON.stringify({ type: 'JOB_DECLINE', token: this.workerToken, bookingId });
        console.log('Declining job with message:', message);
        this.send(message);
    }

    toggleOnlineStatus() {
        this.isOnline = !this.isOnline;
        if (this.isOnline) {
            console.log('Worker is now online');
        } else {
            console.log('Worker is now offline');
            this.close();
        }
    }

    close() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
    }
}

export default new WebSocketService();
