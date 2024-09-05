const axios = require('axios');
const API_URL = process.env.FILE_STORAGE_URL;

const uploadFile = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/upload`, formData, {
            headers: {
                'Accept': 'application/json',
            }
        });
        return response.data;
    } catch (error) {
        console.log(error.response.data)
        throw new Error(error.response.data.message || 'Error uploading file');
    }
};

module.exports = {
    uploadFile
}