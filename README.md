# 🚀 Nucleus Onboarding Journey Tracker

Una aplicación web interactiva para visualizar y gestionar el proceso de onboarding de proyectos en la plataforma Nucleus. Permite a los equipos seguir el progreso a través de diferentes fases, gestionar tareas y entender el "sentimiento" del cliente en cada etapa.

Esta aplicación ha sido completamente dockerizada con una arquitectura de dos servicios (frontend y backend) para facilitar el despliegue y la persistencia de datos.

## ✨ Características Principales

- **Dashboard de Proyectos**: Visualiza todos los proyectos en una tabla interactiva (`DataGrid` de MUI) con información sobre su fase actual.
- **Gestión de Proyectos**: Añade nuevos proyectos y elimina los existentes.
- **Vista Detallada del Journey**: Navega por las fases de un proyecto a través de un `Stepper` interactivo.
- **Checklists Dinámicas**: Completa las tareas tanto para el equipo de Nucleus como para el cliente.
- **Gráfico de Sentimiento**: Un gráfico de líneas (`Chart.js`) que muestra la evolución del sentimiento del cliente a lo largo del onboarding.
- **Comentarios por Fase**: Añade notas y observaciones específicas para cada etapa del proceso.
- **Importación y Exportación Persistente**: Importa y exporta la lista de proyectos en formato JSON. Los archivos se almacenan en el servidor a través de un volumen de Docker, garantizando la persistencia de los datos.
- **Contenerizado con Docker**: La aplicación completa (frontend y backend) se ejecuta en contenedores Docker, orquestados con `docker-compose`.

## 🛠️ Stack Tecnológico

- **Frontend**:
  - [React](https://reactjs.org/)
  - [Vite](https://vitejs.dev/)
  - [Material-UI (MUI)](https://mui.com/) para componentes de UI.
  - [Chart.js](https://www.chartjs.org/) para la visualización de datos.

- **Backend**:
  - [Node.js](https://nodejs.org/)
  - [Express](https://expressjs.com/) para el servidor API.
  - [Multer](https://github.com/expressjs/multer) para la gestión de subida de archivos.
  - [CORS](https://github.com/expressjs/cors) para la comunicación entre servicios.

- **Despliegue y Arquitectura**:
  - [Docker](https://www.docker.com/) y [Docker Compose](https://docs.docker.com/compose/)
  - [Nginx](https://www.nginx.com/) para servir la aplicación de React en producción.

## 🚀 Cómo Empezar

Para ejecutar este proyecto, necesitarás tener [Docker](https://www.docker.com/products/docker-desktop/) instalado en tu máquina.

1.  **Clona el repositorio:**
    ```bash
    git clone <URL_DEL_REPOSITORIO>
    ```

2.  **Navega al directorio del proyecto:**
    ```bash
    cd nucleus-onboarding-react
    ```

3.  **Construye y levanta los contenedores:**
    Utiliza `docker-compose` para construir las imágenes del frontend y del backend y para iniciar los servicios.
    ```bash
    docker-compose up --build
    ```
    - Si encuentras un error relacionado con `bake`, puedes intentar deshabilitando BuildKit para esta ejecución:
      ```bash
      DOCKER_BUILDKIT=0 docker-compose up --build
      ```

## 💻 Uso de la Aplicación

- Una vez que los contenedores estén en ejecución, accede a la aplicación en tu navegador en la siguiente URL:
  **[http://localhost:8080](http://localhost:8080)**

- **Importación/Exportación de Proyectos**:
  - Al hacer clic en **"Exportar"**, los datos de tus proyectos actuales se enviarán al backend y se guardarán en una carpeta `project-data` en la raíz de tu proyecto. Tu navegador también iniciará la descarga del archivo.
  - Al hacer clic en **"Importar"**, puedes seleccionar un archivo JSON de proyectos. Este se subirá al backend y la aplicación se actualizará con los datos importados.

## 📁 Estructura del Proyecto

```
nucleus-onboarding-react/
├── backend/                # Contiene el servidor Node.js/Express
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
├── project-data/           # (Auto-generada) Almacenamiento persistente para archivos .json
├── public/                 # Assets públicos del frontend
├── src/                    # Código fuente de la aplicación React
│   ├── components/         # Componentes de React
│   ├── App.jsx
│   ├── main.jsx
│   └── journeyData.js      # Datos estáticos del journey de onboarding
├── .dockerignore
├── docker-compose.yml      # Orquestación de los servicios frontend y backend
├── Dockerfile              # Definición del contenedor del frontend (React + Nginx)
└── README.md
```
