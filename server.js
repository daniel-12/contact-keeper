const express = require('express');
const connectDB = require('./config/db');

const app = express();

//Connect Database
connectDB();

// Init Middleware // Allows body data from req (req.body)
app.use(express.json({ extended: false }));


// app.get('/', async (req, res) => {
    
//         const name = {
//             "nombre": "julius",
//             "last" : "Caesar"
//         }
//         const job = {
//             "nombre": "Luis",
//             "last" : "Juarez"
//         }
//         const hispanic = job.last;
//         const Italian = name.nombre;
    
//     try {
//         res.json({Italian, hispanic});
//     } catch (err) {
//         console.log(err);
//     }
 
// });

//app.post('/', (req, res) => res.json({msg: 'post was made'}));

// Define Routes:
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/contacts', require('./routes/contacts'));

// If the environment is in production, serve the index.html in the build folder.
if (process.env.NODE_ENV === 'production') {
    // set static folder
    app.use(express.static('client/build'));
  
    app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html')));
  }

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));