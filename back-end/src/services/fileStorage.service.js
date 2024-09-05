const axios = require('axios');
const API_URL = process.env.FILE_STORAGE_URL;

const uploadFile = async (fileData, token) => {
    try {
        const response = await axios.post(`${API_URL}/upload`, fileData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data', // Nếu bạn sử dụng FormData
            }
        });
        return response.data; // Trả về thông tin file đã upload
    } catch (error) {
        throw new Error(error.response.data.message || 'Error uploading file');
    }
};

module.exports = {
    uploadFile
}