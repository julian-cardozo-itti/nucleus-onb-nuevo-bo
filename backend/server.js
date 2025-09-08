const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3001;
const DATA_DIR = '/app/data';
const LATEST_EXPORT_FILENAME = 'latest_onboarding_projects.json';

// Middleware
app.use(cors());
app.use(express.json()); // Para parsear el body de las peticiones POST

// Configuración de Multer para la subida de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DATA_DIR);
  },
  filename: (req, file, cb) => {
    // Siempre sobrescribimos el mismo archivo para simplificar la importación
    cb(null, 'imported_onboarding_projects.json');
  },
});

const upload = multer({ storage });

// Rutas de la API

// GET /api/import - Leer los datos del último archivo importado
app.get('/api/import', async (req, res) => {
    const filePath = path.join(DATA_DIR, 'imported_onboarding_projects.json');
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        res.status(200).json(JSON.parse(data));
    } catch (error) {
        console.error('Error al leer el archivo importado:', error);
        res.status(500).json({ message: 'Error al leer el archivo importado o no existe.' });
    }
});

// POST /api/import - Subir un archivo de proyectos
app.post('/api/import', upload.single('projectsFile'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No se ha subido ningún archivo.' });
  }
  res.status(200).json({
    message: 'Archivo importado con éxito.',
    filename: req.file.filename,
  });
});

// GET /api/export - Descargar el último archivo exportado
app.get('/api/export', async (req, res) => {
  const filePath = path.join(DATA_DIR, LATEST_EXPORT_FILENAME);
  try {
    await fs.access(filePath); // Verificar si el archivo existe
    res.download(filePath, LATEST_EXPORT_FILENAME, (err) => {
      if (err) {
        console.error('Error al descargar el archivo:', err);
        res.status(500).json({ message: 'Error interno al descargar el archivo.' });
      }
    });
  } catch (error) {
    res.status(404).json({ message: 'No se ha encontrado ningún archivo exportado.' });
  }
});

// POST /api/export - Guardar los datos de los proyectos en el servidor
app.post('/api/export', async (req, res) => {
    const projectsData = req.body;
  
    if (!projectsData) {
      return res.status(400).json({ message: 'No se han proporcionado datos para exportar.' });
    }
  
    const filePath = path.join(DATA_DIR, LATEST_EXPORT_FILENAME);
  
    try {
      await fs.writeFile(filePath, JSON.stringify(projectsData, null, 2), 'utf-8');
      res.status(200).json({ message: 'Datos exportados y guardados en el servidor con éxito.' });
    } catch (error) {
      console.error('Error al guardar el archivo exportado:', error);
      res.status(500).json({ message: 'Error interno al guardar el archivo en el servidor.' });
    }
  });

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en el puerto ${PORT}`);
});
