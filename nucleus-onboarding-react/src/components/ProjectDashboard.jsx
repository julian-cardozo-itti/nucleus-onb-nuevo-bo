import React, { useState } from 'react';
import {
  Button, TextField, Box, Typography, IconButton, Input,
  Paper, Chip
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Delete as DeleteIcon, Visibility as VisibilityIcon, Download as DownloadIcon, UploadFile as UploadFileIcon, Add as AddIcon } from '@mui/icons-material'; // Importar los iconos correctos
import { journeyData } from '../journeyData';

function ProjectDashboard({ projects, saveProjects, setCurrentProject }) {
  const [newProjectName, setNewProjectName] = useState('');

  const handleAddProject = (e) => {
    e.preventDefault();
    if (newProjectName.trim()) {
      const newProject = {
        id: Date.now(),
        name: newProjectName.trim(),
        currentPhase: 0,
        tasks: {},
        comments: {}
      };

      journeyData.forEach((phase, index) => {
        newProject.tasks[`phase${index}`] = {
          clientActions: phase.clientActions.map(() => false),
          nucleusActions: phase.nucleusActions.map(() => false)
        };
        newProject.comments[`phase${index}`] = '';
      });

      const updatedProjects = [...projects, newProject];
      saveProjects(updatedProjects);
      setNewProjectName('');
      setCurrentProject(newProject);
    }
  };

  const handleDeleteProject = (idToDelete) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este proyecto?")) {
      const updatedProjects = projects.filter(project => project.id !== idToDelete);
      saveProjects(updatedProjects);
      if (currentProject && !updatedProjects.some(p => p.id === currentProject.id)) {
        setCurrentProject(null);
      }
    }
  };

  const exportProjects = () => {
    const dataStr = JSON.stringify(projects, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = 'nucleus_onboarding_projects.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importProjects = (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedProjects = JSON.parse(e.target.result);
        if (Array.isArray(importedProjects) && importedProjects.every(p => p.name && p.currentPhase !== undefined)) {
          importedProjects.forEach(project => {
            if (!project.id) project.id = Date.now() + Math.random();
            if (project.currentPhase < 0 || project.currentPhase >= journeyData.length) {
              project.currentPhase = 0;
            }
          });
          saveProjects(importedProjects);
          alert('Proyectos importados exitosamente!');
        } else {
          alert('El archivo JSON no contiene un formato de proyectos válido.');
        }
      } catch (error) {
        alert('Error al parsear el archivo JSON. Asegúrate de que es un JSON válido.');
        console.error('Error al importar proyectos:', error);
      }
    };
    reader.readAsText(file);
  };

  const columns = [
    { field: 'name', headerName: 'Nombre del Proyecto', flex: 1, minWidth: 200 },
    {
      field: 'currentPhase',
      headerName: 'Fase Actual',
      width: 200,
      renderCell: (params) => {
        const phase = journeyData[params.value];
        return phase ? (
          <Chip label={phase.phase} color="primary" size="small" variant="outlined" />
        ) : (
          <Chip label="Fase Desconocida" color="default" size="small" variant="outlined" />
        );
      },
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <IconButton aria-label="ver" onClick={() => setCurrentProject(params.row)} color="primary" size="small">
            <VisibilityIcon />
          </IconButton>
          <IconButton aria-label="eliminar" onClick={() => handleDeleteProject(params.row.id)} color="error" size="small">
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Gestión de Proyectos
      </Typography>

      <Box sx={{ mb: 4, p: 3, bgcolor: 'background.paper', borderRadius: '8px', boxShadow: 1 }}>
        <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
          Añadir Nuevo Proyecto
        </Typography>
        <Box component="form" onSubmit={handleAddProject} sx={{ display: 'flex', gap: 2 }}>
          <TextField
            label="Nombre del Proyecto"
            variant="outlined"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            fullWidth
            size="small"
          />
          <Button type="submit" variant="contained" color="primary" startIcon={<AddIcon />}>
            Añadir
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mb: 2 }}>
        <Button variant="outlined" onClick={exportProjects} startIcon={<DownloadIcon />}>
          Exportar Proyectos
        </Button>
        <Input
          type="file"
          id="import-projects-input"
          sx={{ display: 'none' }}
          onChange={importProjects}
        />
        <label htmlFor="import-projects-input">
          <Button variant="outlined" component="span" startIcon={<UploadFileIcon />}>
            Importar Proyectos
          </Button>
        </label>
      </Box>

      <Paper sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={projects}
          columns={columns}
          pageSizeOptions={[5, 10, 20]}
          initialState={{
            pagination: { paginationModel: { pageSize: 5 } },
          }}
          disableRowSelectionOnClick
          localeText={{
            noRowsLabel: "No hay proyectos activos. Añade uno para empezar.",
          }}
        />
      </Paper>
    </Box>
  );
}

export default ProjectDashboard;
