require('dotenv').config();
const express = require('express');
const sequelize = require('./db');
const models = require('./models/models');
const PORT = process.env.PORT || 3000;
const cors = require('cors');
const router = require('./routers/index');
const errorHandler = require('./middleware/ErrorHandlerMiddleware');
const fileUpload = require('express-fileupload');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'static')));
app.use(express.urlencoded({ extended: true })); // ДОБАВЬТЕ ЭТУ СТРОКУ!
app.use(fileUpload({})); // ПЕРЕД маршрутами

app.use('/api', router);

app.use(errorHandler);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (error) {
    console.log(error);
  }
}

start();