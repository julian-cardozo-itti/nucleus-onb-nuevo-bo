const journeyData = [
    {
        phase: "Inicio y Presentación",
        details: "El representante del proyecto contacta a Nucleus. Se realiza una reunión introductoria y se comparte la documentación inicial sobre la plataforma y sus requerimientos.",
        actors: ["Representante del Proyecto", "Designado de Nucleus"],
        tools: ["Reuniones", "Documentación Oficial"],
        clientActions: ["Realizar contacto inicial", "Asistir a la reunión", "Revisar documentación"],
        nucleusActions: ["Presentar visión general de Nucleus", "Compartir documentación relevante"],
        emotion: "Expectativa e Incertidumbre",
        emotionValue: 3,
        time: "1-3 días",
        delays: ["Dificultad para coordinar agendas", "Documentación inicial poco clara"],
        risks: ["Malentendido inicial de la arquitectura (iFrames)", "Expectativas no alineadas"]
    },
    {
        phase: "Definición y Preparación",
        details: "Se recolectan los requisitos detallados del proyecto y se establece un canal de Slack para la comunicación y el soporte durante el proceso.",
        actors: ["Representante del Proyecto", "Designado de Nucleus"],
        tools: ["Reuniones de seguimiento", "Slack"],
        clientActions: ["Proporcionar requisitos detallados", "Confirmar compatibilidad con iFrame", "Asegurar configuración de CORS/CSP"],
        nucleusActions: ["Realizar seguimiento de requerimientos", "Evaluar compatibilidad técnica", "Crear canal de Slack"],
        emotion: "Colaboración y Comprensión",
        emotionValue: 4,
        time: "1-2 semanas",
        delays: ["Requisitos incompletos o cambiantes", "Dificultad para alinear requisitos de seguridad"],
        risks: ["Incompatibilidad técnica con la arquitectura de Nucleus", "Retrasos por validación de requisitos"]
    },
    {
        phase: "Configuración de Acceso",
        details: "El equipo de Nucleus configura el proyecto en Nucleus Manager y gestiona la creación de roles en Okta. El cliente solicita la asignación de usuarios a dichos roles.",
        actors: ["Equipo Nucleus", "Representante del Proyecto", "Equipo de Okta"],
        tools: ["Nucleus Manager", "Okta", "Sistema de Tickets"],
        clientActions: ["Solicitar formalmente la asignación de usuarios a los roles definidos"],
        nucleusActions: ["Configurar proyecto en Nucleus Manager", "Gestionar creación de roles en Okta"],
        emotion: "Dependencia y Espera",
        emotionValue: 2,
        time: "1 semana",
        delays: ["Errores en la carga de datos", "Demoras en la gestión de roles o tickets por parte de Okta"],
        risks: ["Usuarios sin los accesos correctos o a tiempo", "Fallos de seguridad por configuración incorrecta de roles"]
    },
    {
        phase: "Implementación y Testing",
        details: "El equipo del proyecto implementa la integración usando el SDK de Nucleus y realiza pruebas exhaustivas para asegurar el correcto funcionamiento y la comunicación segura.",
        actors: ["Equipo de la Aplicación (Cliente)", "Equipo Nucleus (Soporte)"],
        tools: ["SDK de Nucleus (NPM)", "Documentación del SDK", "Slack"],
        clientActions: ["Desarrollar la integración", "Configurar CORS y sesiones", "Alinear diseño con guías de Nucleus", "Realizar pruebas unitarias y de integración"],
        nucleusActions: ["Proporcionar SDK y documentación", "Dar soporte técnico activo", "Alinear diseños con Producto"],
        emotion: "Desafío y Aprendizaje",
        emotionValue: 3,
        time: "2-4 semanas",
        delays: ["Problemas de compatibilidad del SDK", "Curva de aprendizaje del SDK y postMessage", "Dificultades con iFrames y políticas CSP"],
        risks: ["Bloqueo técnico por problemas con el SDK", "Experiencia de usuario inconsistente", "Vulnerabilidades de seguridad"]
    },
    {
        phase: "Soporte y Continuidad",
        details: "Nucleus proporciona soporte técnico continuo. Se utiliza el feedback del proyecto para identificar puntos de dolor y mejorar la plataforma para futuras integraciones.",
        actors: ["Equipo de la Aplicación", "Equipo Nucleus"],
        tools: ["Canal de Slack", "Documentación", "Jira Service Management (futuro)"],
        clientActions: ["Reportar incidencias", "Solicitar soporte", "Proporcionar feedback sobre la experiencia"],
        nucleusActions: ["Resolver incidencias", "Actualizar documentación", "Considerar feedback para mejoras"],
        emotion: "Confianza y Colaboración",
        emotionValue: 5,
        time: "Continuo",
        delays: ["Tiempos de respuesta lentos del soporte", "Falta de claridad en procesos o documentación"],
        risks: ["Problemas no resueltos que afectan la operación", "Insatisfacción del cliente por soporte ineficaz"]
    }
];
