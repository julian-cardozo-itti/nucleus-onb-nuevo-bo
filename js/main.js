let currentPhaseIndex = 0;
let projects = []; // Declaración global
window.currentProject = null; // Declaración global

const phasesContainer = document.getElementById('phases-container');
const detailsSection = document.getElementById('phase-details-section');

// Funciones de manejo de proyectos movidas al ámbito global
function saveProjects() {
    localStorage.setItem('onboardingProjects', JSON.stringify(projects));
}

function loadProjects() {
    const savedData = localStorage.getItem('onboardingProjects');
    if (savedData) {
        projects = JSON.parse(savedData);
        projects.forEach(project => {
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
    }
}

function deleteProject(index) {
    if (confirm("¿Estás seguro de que quieres eliminar este proyecto?")) {
        projects.splice(index, 1);
        saveProjects();
        renderProjects();
        // Si el proyecto eliminado era el que estaba en vista, volver al dashboard
        if (window.currentProject === null || !projects.find(p => p === window.currentProject)) {
            showDashboardView();
        }
    }
}

function createIcon(type) {
    const icons = {
        actors: '👥', tools: '🔧', client: '▶️', nucleus: '⚙️',
        time: '⏳', delays: '⚠️', risks: '❗'
    };
    const iconSpan = document.createElement('span');
    iconSpan.className = 'mr-2 text-xl';
    iconSpan.textContent = icons[type] || '🔹';
    return iconSpan;
}

function createDetailCard(title, content, iconType) {
    const card = document.createElement('div');
    card.className = 'bg-gray-50 rounded-lg p-4';

    const titleDiv = document.createElement('div');
    titleDiv.className = 'flex items-center text-md font-semibold text-gray-700 mb-2';
    titleDiv.appendChild(createIcon(iconType));
    titleDiv.appendChild(document.createTextNode(title));
    card.appendChild(titleDiv);

    if (Array.isArray(content)) {
        const list = document.createElement('ul');
        list.className = 'list-disc list-inside text-gray-600 space-y-1';
        content.forEach(itemText => {
            const item = document.createElement('li');
            item.textContent = itemText;
            list.appendChild(item);
        });
        card.appendChild(list);
    } else {
        const p = document.createElement('p');
        p.className = 'text-gray-600';
        p.textContent = content;
        card.appendChild(p);
    }
    return card;
}

function createChecklistCard(title, actions, iconType, phaseIndex, taskCategory) {
    const card = document.createElement('div');
    card.className = 'bg-gray-50 rounded-lg p-4';

    const titleDiv = document.createElement('div');
    titleDiv.className = 'flex items-center text-md font-semibold text-gray-700 mb-2';
    titleDiv.appendChild(createIcon(iconType));
    titleDiv.appendChild(document.createTextNode(title));
    card.appendChild(titleDiv);

    if (Array.isArray(actions)) {
        const list = document.createElement('div');
        list.className = 'space-y-2';
        
        actions.forEach((actionText, actionIndex) => {
            const item = document.createElement('label');
            item.className = 'flex items-center text-gray-600 cursor-pointer';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500';
            
            if (window.currentProject && window.currentProject.tasks[`phase${phaseIndex}`]) {
                checkbox.checked = window.currentProject.tasks[`phase${phaseIndex}`][taskCategory][actionIndex];
            }

            checkbox.addEventListener('change', () => {
                if (window.currentProject) {
                    window.currentProject.tasks[`phase${phaseIndex}`][taskCategory][actionIndex] = checkbox.checked;
                    saveProjects();
                }
            });

            const span = document.createElement('span');
            span.className = 'ml-3';
            span.textContent = actionText;
            
            item.appendChild(checkbox);
            item.appendChild(span);
            list.appendChild(item);
        });
        card.appendChild(list);
    } else {
        const p = document.createElement('p');
        p.className = 'text-gray-600';
        p.textContent = actions;
        card.appendChild(p);
    }
    return card;
}

function renderPhaseDetails(index) {
    const phaseData = journeyData[index];
    detailsSection.innerHTML = '';

    const header = document.createElement('div');
    header.className = 'mb-6 text-center';
    header.innerHTML = `
        <h3 class="text-2xl font-bold text-blue-600">${phaseData.phase}</h3>
        <p class="mt-2 text-gray-600">${phaseData.details}</p>
        <div class="mt-4 inline-flex items-center justify-center bg-blue-100 text-blue-800 text-sm font-medium px-4 py-1 rounded-full">
            Sentimiento: ${phaseData.emotion}
        </div>
    `;
    detailsSection.appendChild(header);

    // Enlace a la documentación si existe
    if (phaseData.documentationLink) {
        const docLinkDiv = document.createElement('div');
        docLinkDiv.className = 'mt-4 mb-6 text-center';
        docLinkDiv.innerHTML = `
            <a href="${phaseData.documentationLink.url}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5 8a2 2 0 012-2h4a2 2 0 012 2v2a2 2 0 01-2 2H7a2 2 0 01-2-2V8zm1-3a1 1 0 00-1 1v5a1 1 0 001 1h8a1 1 0 001-1V6a1 1 0 00-1-1H6z" clip-rule="evenodd" />
                </svg>
                ${phaseData.documentationLink.label}
            </a>
        `;
        detailsSection.appendChild(docLinkDiv);
    }

    // Enlace al formulario si existe
    if (phaseData.formLink) {
        const formLinkDiv = document.createElement('div');
        formLinkDiv.className = 'mt-4 mb-6 text-center';
        formLinkDiv.innerHTML = `
            <a href="${phaseData.formLink.url}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM5 9a1 1 0 000 2h10a1 1 0 100-2H5z" />
                </svg>
                ${phaseData.formLink.label}
            </a>
        `;
        detailsSection.appendChild(formLinkDiv);
    }

    // Enlace a la documentación técnica si existe
    if (phaseData.technicalDocLink) {
        const techDocLinkDiv = document.createElement('div');
        techDocLinkDiv.className = 'mt-4 mb-6 text-center';
        techDocLinkDiv.innerHTML = `
            <a href="${phaseData.technicalDocLink.url}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1-3a1 1 0 000 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
                </svg>
                ${phaseData.technicalDocLink.label}
            </a>
        `;
        detailsSection.appendChild(techDocLinkDiv);
    }

    // Sección de Comentarios
    const commentsSection = document.createElement('div');
    commentsSection.className = 'mb-6';
    const commentsTitle = document.createElement('h4');
    commentsTitle.className = 'text-lg font-medium text-gray-800 mb-2';
    commentsTitle.textContent = 'Comentarios y Observaciones';
    const commentsTextarea = document.createElement('textarea');
    commentsTextarea.className = 'mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm';
    commentsTextarea.rows = 4;
    commentsTextarea.placeholder = 'Añade notas, bloqueantes o cualquier observación relevante para esta fase...';
    commentsTextarea.value = ''; // Limpiar antes de cargar
    
    if (window.currentProject && window.currentProject.comments && window.currentProject.comments[`phase${index}`]) {
        commentsTextarea.value = window.currentProject.comments[`phase${index}`];
    }

    commentsTextarea.addEventListener('input', () => {
        if (window.currentProject) {
            if (!window.currentProject.comments) {
                window.currentProject.comments = {};
            }
            window.currentProject.comments[`phase${index}`] = commentsTextarea.value;
            saveProjects();
        }
    });

    commentsSection.appendChild(commentsTitle);
    commentsSection.appendChild(commentsTextarea);
    detailsSection.appendChild(commentsSection);


    const grid = document.createElement('div');
    grid.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4';

    // Priorizar acciones del cliente y del equipo
    grid.appendChild(createChecklistCard('Acciones del Equipo Nucleus', phaseData.nucleusActions, 'nucleus', index, 'nucleusActions'));
    grid.appendChild(createChecklistCard('Acciones del Cliente', phaseData.clientActions, 'client', index, 'clientActions'));
    
    grid.appendChild(createDetailCard('Tiempo Estimado', phaseData.time, 'time'));
    grid.appendChild(createDetailCard('Actores Involucrados', phaseData.actors, 'actors'));
    grid.appendChild(createDetailCard('Puntos de Contacto / Herramientas', phaseData.tools, 'tools'));
    
    const riskDelayContainer = document.createElement('div');
    riskDelayContainer.className = 'md:col-span-2 lg:col-span-1 space-y-4';
    riskDelayContainer.appendChild(createDetailCard('Potenciales Demoras', phaseData.delays, 'delays'));
    riskDelayContainer.appendChild(createDetailCard('Riesgos Identificados', phaseData.risks, 'risks'));
    grid.appendChild(riskDelayContainer);

    detailsSection.appendChild(grid);

    // Botón para avanzar a la siguiente fase
    if (index < journeyData.length - 1) {
        const nextPhaseButton = document.createElement('button');
        nextPhaseButton.textContent = 'Completar y Avanzar a la Siguiente Fase';
        nextPhaseButton.className = 'mt-8 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500';
        nextPhaseButton.onclick = () => {
            if (window.currentProject) {
                // Solo avanzar si no es la última fase
                if (window.currentProject.currentPhase < journeyData.length - 1) {
                    window.currentProject.currentPhase++;
                    saveProjects();
                    updateActivePhase(window.currentProject);
                }
            }
        };
        detailsSection.appendChild(nextPhaseButton);
    }
}

function updateActivePhase(project) {
    document.querySelectorAll('.phase-item').forEach((item, i) => {
        item.classList.toggle('active', i === project.currentPhase);
    });
    renderPhaseDetails(project.currentPhase);
}

function initializeTimeline(project) {
    phasesContainer.innerHTML = '';
    journeyData.forEach((phase, index) => {
        const phaseItem = document.createElement('div');
        phaseItem.className = 'phase-item flex-1 flex flex-col items-center cursor-pointer p-4 border-2 border-transparent rounded-lg w-full md:w-auto';
        phaseItem.innerHTML = `
            <div class="phase-number relative w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center font-bold text-gray-700 mb-2">${index + 1}</div>
            <p class="text-center font-semibold text-sm md:text-base">${phase.phase}</p>
        `;
        phaseItem.addEventListener('click', () => {
            project.currentPhase = index;
            updateActivePhase(project);
            // Asegurarse de que los detalles de la fase se rendericen cuando se hace clic en una fase de la línea de tiempo
            renderPhaseDetails(project.currentPhase);
        });
        phasesContainer.appendChild(phaseItem);
    });
}

function createEmotionChart() {
    const ctx = document.getElementById('emotionChart').getContext('2d');
    const labels = journeyData.map(d => d.phase.split(' '));
    const data = journeyData.map(d => d.emotionValue);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Nivel de Sentimiento del Cliente',
                data: data,
                borderColor: 'rgba(59, 130, 246, 1)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true,
                tension: 0.3,
                pointBackgroundColor: 'rgba(59, 130, 246, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(59, 130, 246, 1)',
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
                        callback: function(value, index, values) {
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
                        callback: function(value, index, values) {
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

document.addEventListener('DOMContentLoaded', () => {
    const projectManagementSection = document.getElementById('project-management');
    const mainContent = document.querySelector('main');
    const addProjectForm = document.getElementById('add-project-form');
    const projectsTableBody = document.getElementById('projects-table-body');
    const backToDashboardButton = document.getElementById('back-to-dashboard');
    const timelineTitle = document.getElementById('timeline-title');
    const exportProjectsButton = document.getElementById('export-projects-button');
    const importProjectsInput = document.getElementById('import-projects-input');

    // Función para exportar proyectos
    function exportProjects() {
        const dataStr = JSON.stringify(projects, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const exportFileDefaultName = 'nucleus_onboarding_projects.json';
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }

    // Función para importar proyectos
    function importProjects(event) {
        const file = event.target.files[0];
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedProjects = JSON.parse(e.target.result);
                if (Array.isArray(importedProjects) && importedProjects.every(p => p.name && p.currentPhase !== undefined)) {
                    // Validar y ajustar currentPhase para cada proyecto importado
                    importedProjects.forEach(project => {
                        if (project.currentPhase < 0 || project.currentPhase >= journeyData.length) {
                            project.currentPhase = 0; // Establecer a la primera fase si es inválido
                        }
                    });
                    projects = importedProjects; // Reemplazar proyectos existentes
                    saveProjects(); // Guardar los proyectos importados
                    renderProjects(); // Actualizar la UI
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
    }

    // Event Listeners para los nuevos botones
    exportProjectsButton.addEventListener('click', exportProjects);
    importProjectsInput.addEventListener('change', importProjects);

    function showJourneyView(project) {
        window.currentProject = project;
        projectManagementSection.classList.add('hidden');
        mainContent.classList.remove('hidden');
        timelineTitle.textContent = `Fases del Onboarding: ${project.name}`;
        initializeTimeline(project);
        updateActivePhase(project);
    }

    function showDashboardView() {
        window.currentProject = null;
        mainContent.classList.add('hidden');
        projectManagementSection.classList.remove('hidden');
        renderProjects();
    }

    function renderProjects() {
        projectsTableBody.innerHTML = '';
        if (projects.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="3" class="px-6 py-4 text-center text-gray-500">No hay proyectos activos. Añade uno para empezar.</td>`;
            projectsTableBody.appendChild(row);
            return;
        }
        projects.forEach((project, index) => {
            const row = document.createElement('tr');
            row.className = 'cursor-pointer hover:bg-gray-50';
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">${project.name}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        ${project.currentPhase !== undefined && project.currentPhase >= 0 && project.currentPhase < journeyData.length
                            ? journeyData[project.currentPhase].phase
                            : 'Fase Desconocida'}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a href="#" class="text-blue-600 hover:text-blue-900 mr-4">Ver Journey</a>
                    <button data-project-index="${index}" class="delete-project-button text-red-600 hover:text-red-900">Eliminar</button>
                </td>
            `;
            row.addEventListener('click', (event) => {
                // Prevenir que el click en el botón de eliminar active la vista del journey
                if (event.target.classList.contains('delete-project-button')) {
                    const projectIndex = parseInt(event.target.dataset.projectIndex);
                    deleteProject(projectIndex);
                    return;
                }
                showJourneyView(project);
                // Asegurarse de que la fase activa se actualice y los detalles se rendericen correctamente
                updateActivePhase(project);
            });
            projectsTableBody.appendChild(row);
        });
    }

    addProjectForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const projectNameInput = document.getElementById('project-name');
        const projectName = projectNameInput.value.trim();
        if (projectName) {
            const newProject = { 
                name: projectName, 
                currentPhase: 0,
                tasks: {},
                comments: {}
            };
            // Inicializar el estado de las tareas y comentarios para el nuevo proyecto
            journeyData.forEach((phase, index) => {
                newProject.tasks[`phase${index}`] = {
                    clientActions: phase.clientActions.map(() => false),
                    nucleusActions: phase.nucleusActions.map(() => false)
                };
                newProject.comments[`phase${index}`] = '';
            });
            projects.push(newProject);
            saveProjects();
            projectNameInput.value = '';
            renderProjects();
            showJourneyView(newProject);
        }
    });

    backToDashboardButton.addEventListener('click', showDashboardView);

    loadProjects();
    createEmotionChart();
    renderProjects();
});
