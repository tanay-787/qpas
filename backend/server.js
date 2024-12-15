import express from 'express';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createWriteStream } from 'fs';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import institutionRoutes from './routes/institutionRoutes.js';
import waitingLobbyRoutes from './routes/waitingLobbyRoutes.js';


const app = express();

const __dirname = dirname(fileURLToPath(import.meta.url));
const logFile = join(__dirname, 'server.log');

app.use(compression());

app.use(cors());

app.use(express.static(join(__dirname, '../frontend/dist'))); // Serve the built static files of the React app
app.use('/assets', express.static(join(__dirname, '../frontend/assets')));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

//API Routes
app.use('/api/institutions', institutionRoutes);
app.use('/api/waiting-lobby', waitingLobbyRoutes);

//keep alive mechanism
app.get('/health', (req, res) => {
  try {
      res.status(200).send('OK');
  } catch (error) {
      res.status(500).send('Service Unavailable');
  }
});


// Handle all other routes and return the React app
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../frontend/dist', 'index.html'));
});

//Implementing FIle Logger
app.use(morgan(':method - :url - :date - :response-time ms'));
app.use(
  morgan(':method - :url - :date - :response-time ms', {
    stream: createWriteStream(logFile, { flags: 'a' }),
  })
);



  app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
  });

