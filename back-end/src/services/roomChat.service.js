const Room = require('../models/room.model');
const Message = require('../models/message.model');

class RoomChatService {
    async createRoom(userId, workerId) {
        // Check if room already exists
        let room = await Room.findOne({
            userId: userId,
            workerId: workerId,
            isActive: true
        });

        if (!room) {
            room = await Room.create({
                userId: userId,
                workerId: workerId
            });
        }

        return room;
    }

    async getRoomById(roomId) {
        return await Room.findById(roomId);
    }

    async getUserRooms(userId) {
        return await Room.find({ userId: userId, isActive: true })
            .populate('workerId', 'user_id')
            .populate({
                path: 'workerId',
                populate: {
                    path: 'user_id',
                    select: 'name avtImg'
                }
            });
    }

    async getWorkerRooms(workerId) {
        return await Room.find({ workerId: workerId, isActive: true })
            .populate('userId', 'name avtImg');
    }

    async addMessage(roomId, senderId, content, role) {
        const room = await Room.findById(roomId);
        if (!room) throw new Error('Room not found');

        const message = await Message.create({
            roomId,
            role,
            content,
            timestamp: new Date()
        });

        room.lastMessage = new Date();
        await room.save();

        return message;
    }
}

module.exports = new RoomChatService();
