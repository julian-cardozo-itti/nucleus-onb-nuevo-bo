# 🚀 Nucleus Onboarding Journey Tracker

Una aplicación web interactiva y **puramente frontend** para visualizar y gestionar el proceso de onboarding de proyectos en la plataforma Nucleus. Permite a los equipos seguir el progreso a través de diferentes fases, gestionar tareas y entender el "sentimiento" del cliente en cada etapa.

La aplicación se ejecuta completamente en el navegador y utiliza `localStorage` para la persistencia de los datos, lo que la hace ligera y fácil de desplegar.

## ✨ Características Principales

- **Dashboard de Proyectos**: Visualiza todos los proyectos en una tabla interactiva (`DataGrid` de MUI).
- **Gestión de Proyectos**: Añade, elimina, importa y exporta proyectos directamente desde el navegador.
- **Persistencia Local**: Todos los proyectos se guardan en el `localStorage` de tu navegador, por lo que tu trabajo se mantiene entre sesiones.
- **Vista Detallada del Journey**: Navega por las fases de un proyecto a través de un `Stepper` interactivo.
- **Checklists Dinámicas**: Completa las tareas tanto para el equipo de Nucleus como para el cliente.
- **Gráfico de Sentimiento**: Un gráfico de líneas (`Chart.js`) que muestra la evolución del sentimiento del cliente.

## 🛠️ Stack Tecnológico

- **[React](https://reactjs.org/)**: Librería principal para la construcción de la interfaz de usuario.
- **[Vite](https://vitejs.dev/)**: Herramienta de desarrollo frontend rápida y moderna.
- **[Material-UI (MUI)](https://mui.com/)**: Biblioteca de componentes de React para una UI pulida y consistente.
- **[Chart.js](https://www.chartjs.org/)**: Para la visualización de datos en el gráfico de sentimiento.

## 🚀 Cómo Empezar

Para ejecutar este proyecto en tu máquina local, necesitarás tener [Node.js](https://nodejs.org/) (versión 18 o superior) instalado.

**Paso 1: Navega al directorio del proyecto**
Desde tu terminal, entra en la carpeta que contiene el código de la aplicación.
```bash
cd nucleus-onboarding-react
```

**Paso 2: Instala las dependencias**
Este comando leerá el `package.json` e instalará todas las librerías necesarias (React, MUI, etc.).
```bash
npm install
```

**Paso 3: Ejecuta la aplicación**
Este comando iniciará el servidor de desarrollo de Vite.
```bash
npm run dev
```

La terminal te indicará que la aplicación se está ejecutando, normalmente en una URL como **[http://localhost:5173](http://localhost:5173)**. ¡Abre esa dirección en tu navegador para usar la aplicación!
