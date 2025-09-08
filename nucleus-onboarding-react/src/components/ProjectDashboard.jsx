import React, { useState, useRef } from 'react';
import {
  Box, Button, TextField, Paper, Typography, Grid, IconButton, Chip,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Alert
} from "@mui/material";
import {
  Delete as DeleteIcon, Visibility as VisibilityIcon,
  Download as DownloadIcon, UploadFile as UploadFileIcon, Add as AddIcon
} from "@mui/icons-material";
import { DataGrid } from '@mui/x-data-grid';
import * as locales from '@mui/x-data-grid/locales';
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

  const handleExportProjects = () => {
    if (projects.length === 0) {
      setNotification({ open: true, message: 'No hay proyectos para exportar.', severity: 'warning' });
      return;
    }
    const dataStr = JSON.stringify(projects, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = 'onboarding_projects.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    setNotification({ open: true, message: 'La exportación ha comenzado.', severity: 'success' });
  };

  const handleImportClick = () => {
    importFileRef.current.click();
  };

  const handleImportProjects = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedProjects = JSON.parse(e.target.result);
        if (Array.isArray(importedProjects)) {
          saveProjects(importedProjects);
          setNotification({ open: true, message: 'Proyectos importados con éxito.', severity: 'success' });
        } else {
          setNotification({ open: true, message: 'El archivo no tiene un formato válido.', severity: 'error' });
        }
      } catch (error) {
        console.error("Error al importar:", error);
        setNotification({ open: true, message: 'Error al leer el archivo JSON.', severity: 'error' });
      }
    };
    reader.readAsText(file);
    event.target.value = null; // Limpiar el input
  };

  const handleViewProject = (project) => {
    setCurrentProject(project);
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
          <IconButton onClick={() => handleViewProject(params.row)} color="primary">
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
        <Typography variant="h6" component="h3" gutterBottom>Añadir Nuevo Proyecto</Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm>
            <TextField
              fullWidth
              label="Nombre del Nuevo Proyecto"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddProject()}
            />
          </Grid>
          <Grid item xs={12} sm="auto">
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddProject}
              size="large"
            >
              Añadir
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={2} sx={{ p: 4, borderRadius: '12px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="h3">Proyectos Existentes</Typography>
          <Box>
            <Button variant="outlined" startIcon={<UploadFileIcon />} onClick={handleImportClick} sx={{ mr: 1 }}>
              Importar
            </Button>
            <input type="file" ref={importFileRef} onChange={handleImportProjects} style={{ display: 'none' }} accept=".json" />
            <Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleExportProjects}>
              Exportar
            </Button>
          </Box>
        </Box>
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={projects}
            columns={columns}
            localeText={locales.esES.components.MuiDataGrid.defaultProps.localeText}
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
          <Button onClick={() => handleDeleteProject(deleteConfirmation.projectId)} color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ProjectDashboard;
