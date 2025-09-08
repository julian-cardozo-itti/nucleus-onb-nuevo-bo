import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Typography, Paper, Grid, Button, Link as MuiLink,
  TextField, Checkbox, FormControlLabel, Stepper, Step, StepLabel,
  Card, CardContent, CardHeader, Accordion, AccordionSummary, AccordionDetails,
  List, ListItem, ListItemIcon, ListItemText // Importar componentes de lista
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon, Description as DescriptionIcon, Assignment as AssignmentIcon, Code as CodeIcon } from '@mui/icons-material'; // Importar iconos correctos
import { useTheme } from '@mui/material/styles'; // Importar useTheme
import Chart from 'chart.js/auto';
import { journeyData } from '../journeyData';
import { styled } from '@mui/system';

// Styled components for the timeline
const StyledStepper = styled(Stepper)(({ theme }) => ({
  mb: 4,
  '& .MuiStepConnector-root': {
    top: 15,
  },
  '& .MuiStepConnector-line': {
    borderColor: theme.palette.primary.light,
    borderWidth: 2,
    borderRadius: 1,
  },
  '& .MuiStepIcon-root.Mui-active': {
    color: theme.palette.primary.main,
  },
  '& .MuiStepIcon-root.Mui-completed': {
    color: theme.palette.success.main,
  },
}));

// Los styled components PhaseItem y PhaseNumber serán removidos
// const PhaseItem = styled(Box)(({ theme, active }) => (
//   display: 'flex',
//   flexDirection: 'column',
//   alignItems: 'center',
//   cursor: 'pointer',
//   padding: theme.spacing(2),
//   border: `2px solid ${active ? theme.palette.primary.main : 'transparent'}`,
//   borderRadius: theme.shape.borderRadius,
//   width: '100%',
//   textAlign: 'center',
//   '&:hover': {
//     backgroundColor: theme.palette.action.hover,
//   },
// }));

// const PhaseNumber = styled(Box)(({ theme, active }) => (
//   position: 'relative',
//   width: 40,
//   height: 40,
//   backgroundColor: active ? theme.palette.primary.main : theme.palette.grey[300],
//   borderRadius: '50%',
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'center',
//   fontWeight: 'bold',
//   color: active ? theme.palette.common.white : theme.palette.grey[700],
//   marginBottom: theme.spacing(1),
// }));

const IconSpan = styled('span')({
  marginRight: 8,
  fontSize: '1.25rem',
});

function createIcon(type) {
  const icons = {
    actors: '👥', tools: '🔧', client: '▶️', nucleus: '⚙️',
    time: '⏳', delays: '⚠️', risks: '❗'
  };
  return <IconSpan>{icons[type] || '🔹'}</IconSpan>;
}

function DetailCard({ title, content, iconType }) {
  return (
    <Card elevation={2} sx={{ borderRadius: '8px', height: '100%' }}>
      <CardHeader
        avatar={createIcon(iconType)}
        title={
          <Typography variant="subtitle1" component="h4" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
            {title}
          </Typography>
        }
        sx={{ pb: 0 }}
      />
      <CardContent sx={{ pt: 1 }}>
        {Array.isArray(content) ? (
          <Box component="ul" sx={{ pl: 2, mt: 0 }}>
            {content.map((item, idx) => (
              <Typography component="li" key={idx} variant="body2" color="text.primary" sx={{ mt: 0.5 }}>
                {item}
              </Typography>
            ))}
          </Box>
        ) : (
          <Typography variant="body2" color="text.primary">
            {content}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

function ChecklistCard({ title, actions, iconType, phaseIndex, taskCategory, project, saveProjects }) {
  const handleCheckboxChange = (actionIndex) => () => {
    const updatedProject = { ...project };
    if (!updatedProject.tasks[`phase${phaseIndex}`]) {
      updatedProject.tasks[`phase${phaseIndex}`] = {
        clientActions: journeyData[phaseIndex].clientActions.map(() => false),
        nucleusActions: journeyData[phaseIndex].nucleusActions.map(() => false)
      };
    }
    updatedProject.tasks[`phase${phaseIndex}`][taskCategory][actionIndex] = !updatedProject.tasks[`phase${phaseIndex}`][taskCategory][actionIndex]; // Toggle checkbox
    saveProjects(updatedProject);
  };

  const isChecked = (actionIndex) => {
    return project?.tasks?.[`phase${phaseIndex}`]?.[taskCategory]?.[actionIndex] || false;
  };

  return (
    <Card elevation={2} sx={{ borderRadius: '8px', height: '100%' }}>
      <CardHeader
        avatar={createIcon(iconType)}
        title={
          <Typography variant="subtitle1" component="h4" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
            {title}
          </Typography>
        }
        sx={{ pb: 0 }}
      />
      <CardContent sx={{ pt: 0 }}>
        <List dense sx={{ mt: 0, mb: 1 }}>
          {actions.map((actionText, actionIndex) => (
            <ListItem
              key={actionIndex}
              disablePadding
              onClick={handleCheckboxChange(actionIndex)}
              sx={{ cursor: 'pointer' }}
            >
              <ListItemIcon sx={{ minWidth: 'auto', mr: 1 }}>
                <Checkbox
                  edge="start"
                  checked={isChecked(actionIndex)}
                  tabIndex={-1}
                  disableRipple
                  size="small"
                />
              </ListItemIcon>
              <ListItemText primary={<Typography variant="body2">{actionText}</Typography>} />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}

function JourneyDetail({ project, saveProjects, setCurrentProject }) {
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(project.currentPhase || 0);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const theme = useTheme();

  useEffect(() => {
    setCurrentPhaseIndex(project.currentPhase || 0);
  }, [project.currentPhase]);

  useEffect(() => {
    if (chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
      const ctx = chartRef.current.getContext('2d');
      const labels = journeyData.map(d => d.phase.split(' '));
      const data = journeyData.map(d => d.emotionValue);

      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Nivel de Sentimiento del Cliente',
            data: data,
            borderColor: theme.palette.primary.main,
            backgroundColor: theme.palette.primary.light,
            fill: true,
            tension: 0.3,
            pointBackgroundColor: theme.palette.primary.main,
            pointBorderColor: theme.palette.common.white,
            pointHoverBackgroundColor: theme.palette.common.white,
            pointHoverBorderColor: theme.palette.primary.main,
            pointRadius: 5,
            pointHoverRadius: 7
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              max: 6,
              ticks: {
                stepSize: 1,
                callback: function(value) {
                  const labels = ['', 'Frustración', 'Dependencia', 'Expectativa', 'Colaboración', 'Confianza'];
                  return labels[value] || '';
                }
              }
            },
            x: {
              ticks: {
                maxRotation: 0,
                minRotation: 0,
                autoSkip: false,
                callback: function(value, index) {
                  return `Fase ${index + 1}`;
                }
              }
            }
          },
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              backgroundColor: theme.palette.background.paper,
              titleColor: theme.palette.text.primary,
              bodyColor: theme.palette.text.secondary,
              borderColor: theme.palette.divider,
              borderWidth: 1,
              cornerRadius: 4,
              callbacks: {
                title: function(context) {
                  return journeyData[context[0].dataIndex].phase;
                },
                label: function(context) {
                  return `Sentimiento: ${journeyData[context.dataIndex].emotion}`;
                }
              }
            }
          }
        }
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [project, theme]);

  const handlePhaseClick = (index) => {
    const updatedProject = { ...project, currentPhase: index };
    saveProjects(updatedProject);
    setCurrentPhaseIndex(index);
  };

  const handleNextPhase = () => {
    if (currentPhaseIndex < journeyData.length - 1) {
      const newPhaseIndex = currentPhaseIndex + 1;
      const updatedProject = { ...project, currentPhase: newPhaseIndex };
      saveProjects(updatedProject);
      setCurrentPhaseIndex(newPhaseIndex);
    }
  };

  const handleCommentChange = (event) => {
    const updatedProject = { ...project };
    if (!updatedProject.comments) {
      updatedProject.comments = {};
    }
    updatedProject.comments[`phase${currentPhaseIndex}`] = event.target.value;
    saveProjects(updatedProject);
  };

  const phaseData = journeyData[currentPhaseIndex];

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Fases del Onboarding: {project.name}
      </Typography>

      {/* Timeline de Fases */}
      <StyledStepper activeStep={currentPhaseIndex} alternativeLabel>
        {journeyData.map((phase, index) => (
          <Step key={index} onClick={() => handlePhaseClick(index)} sx={{ cursor: 'pointer' }}>
            <StepLabel StepIconProps={{ sx: { fontSize: '2rem' } }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{phase.phase}</Typography>
            </StepLabel>
          </Step>
        ))}
      </StyledStepper>

      {/* Detalles de la Fase Actual */}
      {phaseData && (
        <Paper elevation={2} sx={{ p: 4, mb: 4, borderRadius: '12px' }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h5" component="h3" color="primary" gutterBottom>
              {phaseData.phase}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              {phaseData.details}
            </Typography>
            <Box
              sx={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                bgcolor: 'primary.light', color: 'primary.dark', fontSize: '0.875rem',
                fontWeight: 'medium', px: 2, py: 0.5, borderRadius: '9999px'
              }}
            >
              Sentimiento: {phaseData.emotion}
            </Box>
          </Box>

          {/* Enlaces de Documentación/Formularios */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4, flexWrap: 'wrap' }}>
            {phaseData.documentationLink && (
              <Button
                variant="contained"
                color="success"
                startIcon={<DescriptionIcon />}
                component={MuiLink}
                href={phaseData.documentationLink.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {phaseData.documentationLink.label}
              </Button>
            )}
            {phaseData.formLink && (
              <Button
                variant="contained"
                startIcon={<AssignmentIcon />}
                component={MuiLink}
                href={phaseData.formLink.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {phaseData.formLink.label}
              </Button>
            )}
            {phaseData.technicalDocLink && (
              <Button
                variant="contained"
                color="secondary"
                startIcon={<CodeIcon />}
                component={MuiLink}
                href={phaseData.technicalDocLink.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {phaseData.technicalDocLink.label}
              </Button>
            )}
          </Box>

          {/* Sección de Comentarios */}
          <Paper elevation={1} sx={{ mb: 4, p: 3, bgcolor: 'background.default', borderRadius: '8px' }}>
            <Typography variant="h6" component="h4" gutterBottom>
              Comentarios y Observaciones
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Añade notas, bloqueantes o cualquier observación relevante para esta fase..."
              value={project.comments?.[`phase${currentPhaseIndex}`] || ''}
              onChange={handleCommentChange}
              variant="outlined"
              sx={{
                bgcolor: 'background.paper',
              }}
            />
          </Paper>

          <Accordion defaultExpanded sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Acciones y Tareas</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid xs={12} md={6}>
                  <ChecklistCard
                    title="Acciones del Equipo Nucleus"
                    actions={phaseData.nucleusActions}
                    iconType="nucleus"
                    phaseIndex={currentPhaseIndex}
                    taskCategory="nucleusActions"
                    project={project}
                    saveProjects={saveProjects}
                  />
                </Grid>
                <Grid xs={12} md={6}>
                  <ChecklistCard
                    title="Acciones del Cliente"
                    actions={phaseData.clientActions}
                    iconType="client"
                    phaseIndex={currentPhaseIndex}
                    taskCategory="clientActions"
                    project={project}
                    saveProjects={saveProjects}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          <Accordion defaultExpanded sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Detalles Clave</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid xs={12} sm={6} md={4}>
                  <DetailCard title="Tiempo Estimado" content={phaseData.time} iconType="time" />
                </Grid>
                <Grid xs={12} sm={6} md={4}>
                  <DetailCard title="Actores Involucrados" content={phaseData.actors} iconType="actors" />
                </Grid>
                <Grid xs={12} sm={6} md={4}>
                  <DetailCard title="Puntos de Contacto / Herramientas" content={phaseData.tools} iconType="tools" />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Riesgos y Demoras</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid xs={12} sm={6} md={6}>
                  <DetailCard title="Potenciales Demoras" content={phaseData.delays} iconType="delays" />
                </Grid>
                <Grid xs={12} sm={6} md={6}>
                  <DetailCard title="Riesgos Identificados" content={phaseData.risks} iconType="risks" />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Botón para avanzar a la siguiente fase */}
          {currentPhaseIndex < journeyData.length - 1 && (
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleNextPhase}
                sx={{ width: '100%', maxWidth: 400 }}
              >
                Completar y Avanzar a la Siguiente Fase
              </Button>
            </Box>
          )}
        </Paper>
      )}

      {/* Gráfico de Emociones */}
      <Paper elevation={2} sx={{ p: 4, mt: 4, borderRadius: '12px' }}>
        <Typography variant="h6" component="h4" gutterBottom>
          Nivel de Sentimiento del Cliente a lo largo de las Fases
        </Typography>
        <Box sx={{ height: 300 }}>
          <canvas ref={chartRef}></canvas>
        </Box>
      </Paper>
    </Box>
  );
}

export default JourneyDetail;
