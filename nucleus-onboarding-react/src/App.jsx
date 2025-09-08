import { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Container, Box, CssBaseline, Button } from '@mui/material';
import { journeyData } from './journeyData';
import ProjectDashboard from './components/ProjectDashboard';
import JourneyDetail from './components/JourneyDetail'; // Importa el nuevo componente JourneyDetail

function App() {
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);

  useEffect(() => {
    const savedData = localStorage.getItem('onboardingProjects');
    if (savedData) {
      const loadedProjects = JSON.parse(savedData);
      if (Array.isArray(loadedProjects)) {
        loadedProjects.forEach(project => {
          if (!project.tasks) project.tasks = {};
          if (!project.comments) project.comments = {};
          journeyData.forEach((phase, index) => {
            const phaseKey = `phase${index}`;
            if (!project.tasks[phaseKey]) {
              project.tasks[phaseKey] = {
                clientActions: phase.clientActions.map(() => false),
                nucleusActions: phase.nucleusActions.map(() => false)
              };
            }
            if (!project.tasks[phaseKey].clientActions || project.tasks[phaseKey].clientActions.length !== phase.clientActions.length) {
              project.tasks[phaseKey].clientActions = phase.clientActions.map((_, i) => project.tasks[phaseKey].clientActions ? (project.tasks[phaseKey].clientActions[i] || false) : false);
            }
            if (!project.tasks[phaseKey].nucleusActions || project.tasks[phaseKey].nucleusActions.length !== phase.nucleusActions.length) {
              project.tasks[phaseKey].nucleusActions = phase.nucleusActions.map((_, i) => project.tasks[phaseKey].nucleusActions ? (project.tasks[phaseKey].nucleusActions[i] || false) : false);
            }
            if (project.comments[phaseKey] === undefined) {
              project.comments[phaseKey] = '';
            }
          });
        });
        setProjects(loadedProjects);
      }
    }
  }, []);

  const saveProjects = (updatedProjects) => {
    localStorage.setItem('onboardingProjects', JSON.stringify(updatedProjects));
    setProjects(updatedProjects);
  };

  const updateProjectInList = (updatedProject) => {
    const projectIndex = projects.findIndex(p => p.id === updatedProject.id);
    if (projectIndex > -1) {
      const newProjects = [...projects];
      newProjects[projectIndex] = updatedProject;
      saveProjects(newProjects);
    } else {
      // Si el proyecto no se encuentra (ej. es un nuevo proyecto), añadirlo.
      // Aunque para este flujo actual, project debería existir.
      saveProjects([...projects, updatedProject]);
    }
  };

  const handleBackToDashboard = () => {
    setCurrentProject(null);
  };

  return (
    <CssBaseline>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Nucleus Onboarding Journey
          </Typography>
          {currentProject && (
            <Button color="inherit" onClick={handleBackToDashboard}>
              Volver al Dashboard
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 64px)' }}>
        <Container maxWidth={false} sx={{ flexGrow: 1, py: 3, px: { xs: 2, md: 3 } }}>
          {currentProject ? (
            <JourneyDetail
              project={currentProject}
              saveProjects={updateProjectInList} // Pasar la nueva función de actualización
              setCurrentProject={setCurrentProject}
            />
          ) : (
            <ProjectDashboard projects={projects} saveProjects={saveProjects} setCurrentProject={setCurrentProject} />
          )}
        </Container>
      </Box>
    </CssBaseline>
  );
}

export default App;
