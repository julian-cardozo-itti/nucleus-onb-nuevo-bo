import React, { useState, useRef } from 'react';
import {
  Box, Button, TextField, Paper, Typography, Grid, IconButton, Chip, Link as MuiLink,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Alert
} from "@mui/material";
import {
  Delete as DeleteIcon, Visibility as VisibilityIcon,
  Download as DownloadIcon, UploadFile as UploadFileIcon, Add as AddIcon
} from "@mui/icons-material";
import { DataGrid, esES } from '@mui/x-data-grid';
import { journeyData } from "../journeyData";

function ProjectDashboard({ projects, saveProjects, setCurrentProject }) {
  const [newProjectName, setNewProjectName] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState({ open: false, projectId: null });
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const importFileRef = useRef(null);

  const handleAddProject = () => {
    if (newProjectName.trim() === "") {
      setNotification({ open: true, message: 'El nombre del proyecto no puede estar vacío.', severity: 'error' });
      return;
    }
    const newProject = {
      id: Date.now(),
      name: newProjectName,
      currentPhase: 0,
      tasks: {},
      comments: {}
    };
    const updatedProjects = [...projects, newProject];
    saveProjects(updatedProjects);
    setNewProjectName("");
    setNotification({ open: true, message: `Proyecto "${newProjectName}" añadido con éxito.`, severity: 'success' });
  };

  const handleDeleteProject = (id) => {
    const updatedProjects = projects.filter(p => p.id !== id);
    saveProjects(updatedProjects);
    setDeleteConfirmation({ open: false, projectId: null });
    setNotification({ open: true, message: 'Proyecto eliminado con éxito.', severity: 'success' });
  };

  const handleExportProjects = async () => {
    if (projects.length === 0) {
        setNotification({ open: true, message: 'No hay proyectos para exportar.', severity: 'warning' });
        return;
    }
    try {
        const response = await fetch('http://localhost:3001/api/export', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(projects),
        });

        if (!response.ok) {
            throw new Error('Error en el servidor al exportar los proyectos.');
        }

        setNotification({ open: true, message: 'Proyectos guardados en el servidor. La descarga comenzará.', severity: 'success' });

        // Abrir una nueva pestaña para iniciar la descarga desde el backend
        window.open('http://localhost:3001/api/export', '_blank');

    } catch (error) {
        console.error("Error al exportar proyectos:", error);
        setNotification({ open: true, message: `Error al exportar: ${error.message}`, severity: 'error' });
    }
  };

  const handleImportClick = () => {
    importFileRef.current.click();
  };

  const handleImportProjects = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append('projectsFile', file);

    try {
        // 1. Subir el archivo al backend
        const uploadResponse = await fetch('http://localhost:3001/api/import', {
            method: 'POST',
            body: formData,
        });

        if (!uploadResponse.ok) {
            throw new Error('Error al subir el archivo al servidor.');
        }

        // 2. Obtener los datos del archivo subido desde el backend
        const dataResponse = await fetch('http://localhost:3001/api/import');
        if (!dataResponse.ok) {
            throw new Error('Error al obtener los datos del proyecto desde el servidor.');
        }
        const importedProjects = await dataResponse.json();

        // 3. Actualizar el estado y localStorage
        if (Array.isArray(importedProjects)) {
            saveProjects(importedProjects);
            setNotification({ open: true, message: 'Proyectos importados con éxito desde el servidor.', severity: 'success' });
        } else {
            throw new Error('El archivo importado no contiene un formato de proyectos válido.');
        }

    } catch (error) {
        console.error("Error al importar proyectos:", error);
        setNotification({ open: true, message: `Error al importar: ${error.message}`, severity: 'error' });
    } finally {
        // Limpiar el input para permitir subir el mismo archivo de nuevo
        event.target.value = null;
    }
  };

  const handleViewProject = (id) => {
    setCurrentProject(id);
  };

  const columns = [
    { field: 'name', headerName: 'Nombre del Proyecto', flex: 1 },
    {
      field: 'currentPhase',
      headerName: 'Fase Actual',
      flex: 1,
      renderCell: (params) => {
        const phaseName = journeyData[params.value]?.phase || 'Fase Desconocida';
        return <Chip label={phaseName} variant="outlined" />;
      },
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      sortable: false,
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleViewProject(params.row.id)} color="primary">
            <VisibilityIcon />
          </IconButton>
          <IconButton onClick={() => setDeleteConfirmation({ open: true, projectId: params.row.id })} color="error">
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Box sx={{ mt: 4 }}>
      {notification.open && (
        <Alert
          severity={notification.severity}
          onClose={() => setNotification({ ...notification, open: false })}
          sx={{ mb: 2 }}
        >
          {notification.message}
        </Alert>
      )}

      <Paper elevation={2} sx={{ p: 4, mb: 4, borderRadius: '12px' }}>
        <Typography variant="h6" component="h3" gutterBottom>
          Añadir Nuevo Proyecto
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm>
            <TextField
              fullWidth
              label="Nombre del Nuevo Proyecto"
              variant="outlined"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddProject()}
            />
          </Grid>
          <Grid item xs={12} sm="auto">
            <Button
              fullWidth
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddProject}
              size="large"
              sx={{ height: '56px' }}
            >
              Añadir Proyecto
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={2} sx={{ p: 4, borderRadius: '12px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="h3">
            Proyectos Existentes
          </Typography>
          <Box>
            <Button
              variant="outlined"
              startIcon={<UploadFileIcon />}
              onClick={handleImportClick}
              sx={{ mr: 1 }}
            >
              Importar
            </Button>
            <input
              type="file"
              ref={importFileRef}
              onChange={handleImportProjects}
              style={{ display: 'none' }}
              accept=".json"
            />
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleExportProjects}
            >
              Exportar
            </Button>
          </Box>
        </Box>
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={projects}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          />
        </div>
      </Paper>

      <Dialog
        open={deleteConfirmation.open}
        onClose={() => setDeleteConfirmation({ open: false, projectId: null })}
      >
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que quieres eliminar este proyecto? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmation({ open: false, projectId: null })}>Cancelar</Button>
          <Button onClick={() => handleDeleteProject(deleteConfirmation.projectId)} color="error" autoFocus>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ProjectDashboard;
