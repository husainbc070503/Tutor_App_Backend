require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const connectToDB = require('./conn');
const errorMiddleware = require('./middlewares/ErrorValidator');
const port = process.env.PORT

connectToDB();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => res.send('Hello World'));

app.use('/api/user', require('./routes/Users'));
app.use('/api/teacher', require('./routes/Teacher'));
app.use('/api/student', require('./routes/Students'));
app.use('/api/lesson', require('./routes/Lesson'));
app.use('/api/grading', require('./routes/Grades'));

app.use(errorMiddleware);
app.listen(port, () => console.log(`Server running on port ${port}`));