const express = require('express');
const mongoose = require('mongoose');
const fileRoutes = require('./routes/file.routes');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use('/files', fileRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGOOSE_DATABASE, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`File storage service is running on port ${PORT}`);
        });
    })
    .catch(err => console.error(err));
