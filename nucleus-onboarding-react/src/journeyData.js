export const journeyData = [
    {
        phase: "Fase 1: Contacto Inicial y Evaluación",
        details: "El Representante del Proyecto (RP) inicia el proceso para integrar un nuevo proyecto. El Representante de Nucleus (RN) recibe la solicitud, entrega documentación y evalúa el proyecto.",
        actors: ["Representante del Proyecto (RP)", "Representante de Nucleus (RN)"],
        tools: ["Email", "Reuniones", "Documentación"],
        clientActions: [
            "Iniciar el proceso solicitando integrar un nuevo proyecto a Nucleus.",
            "Conectar las cuentas de AWS (TransitGateway) con la cuenta de Nucleus.",
            "SolicitarPersonal Access Token (PAT) para github organization."
        ],
        documentationLink: {
            label: "Acceder a la Documentación de Nucleus",
            url: "https://drive.google.com/drive/folders/1i64-S8OXvAJ-DglfjSiw-6cBskWmBHGH" // Placeholder URL
        },
        nucleusActions: [
            "Compartir la documentación inicial con el RP.",
            "Evaluar el proyecto y comunicar la aprobación o feedback al RP."
        ],
        emotion: "Expectativa",
        emotionValue: 4,
        time: "2-4 días",
        tools: ["Conectar las cuentas a traves de un ticket a cloudOps (infra)","Ticket a gestion de accesos para solicitar el PAT"],
        risks: ["Expectativas no alineadas.", "Información incompleta del proyecto."]
    },
    {
        phase: "Fase 2: Configuración del Entorno",
        details: "El RN crea registra el proyecto en Nucleus. El RP completa el formulario de registro de proyecto.",
        actors: ["Representante del Proyecto (RP)", "Representante de Nucleus (RN)"],
        tools: ["Slack", "Nucleus", "Google Forms"],
        formLink: {
            label: "Acceder al Formulario de Registro de Proyecto",
            url: "https://docs.google.com/forms/d/e/1FAIpQLSczJSc5YlylS4tEnlN3I4HBr9uhhL_FIt-zXRQf6o8Sj9xbTg/viewform"
        },
        technicalDocLink: {
            label: "Acceder a la Documentación Técnica de Nucleus",
            url: "https://drive.google.com/drive/folders/12BylDITLd4GlyA3C8ZguaU2tg4QOF1ch"
        },
        clientActions: [
            "Unirse al canal de Slack.",
            "Enviar los datos necesarios para el registro a través del formulario."
        ],
        nucleusActions: [
            "Agregar en caso oportuno un canal de comunicación en Slack.",
            "Invitar al equipo del proyecto al canal de comunicación.",
            "Registrar el Proyecto/Tenant en Nucleus.",
            "Confirmar al RP que el proyecto ha sido creado."
        ],
        emotion: "Colaboración",
        emotionValue: 5,
        time: "1-2 días",
        delays: ["Datos de registro incorrectos o incompletos."],
        risks: ["Errores en la configuración inicial del Tenant."]
    },
    {
        phase: "Fase 3: Gestión de Accesos y Roles (Usuarios ITTI)",
        details: "El RN solicita la creación de grupos de seguridad en Okta. El Representante de Okta (RO) crea los grupos, asigna usuarios y confirma al RN, quien notifica al RP.",
        actors: ["Representante de Nucleus (RN)", "Representante de Okta (RO)", "Representante del Proyecto (RP)"],
        tools: ["Okta", "Sistema de Tickets/Email"],
        clientActions: [
            "Recibir notificación de accesos creados."
        ],
        nucleusActions: [
            "Solicitar al equipo de Okta la creación de los grupos de seguridad necesarios.",
            "Recibir la confirmación de Okta.",
            "Notificar al RP que los usuarios ya tienen acceso."
        ],
        emotion: "Dependencia",
        emotionValue: 3,
        time: "3-5 días",
        delays: ["Demora en la creación de grupos en Okta."],
        risks: ["Configuración incorrecta de roles y permisos."],
        oktaGroupsLink: {
            label: "Hoja de Cálculo de Solicitud de Grupos Okta",
            url: "https://docs.google.com/spreadsheets/d/1hbWh2bVAqYF4KWmwnuaxPR64UFPWo3JROA6ZOaZILtI/edit?gid=386655764#gid=386655764"
        }
    },
    {
        phase: "Fase 4: Alta de Usuarios Externos",
        details: "Para usuarios externos, el RN facilita una reunión entre el RP y Okta. El RO crea la cuenta tras recibir la justificación directamente del RP.",
        actors: ["Representante del Proyecto (RP)", "Representante de Nucleus (RN)", "Representante de Okta (RO)"],
        tools: ["Reuniones", "Okta"],
        clientActions: [
            "Solicitar el alta de un usuario externo.",
            "Proporcionar detalles y justificación del acceso en la reunión de coordinación."
        ],
        nucleusActions: [
            "Recibir la solicitud y organizar la reunión de coordinación.",
            "Una vez creada la cuenta por Okta, asignar los roles correspondientes.",
            "Notificar al RP que el usuario externo ha sido creado y tiene acceso."
        ],
        emotion: "Coordinación",
        emotionValue: 4,
        time: "4-6 días",
        delays: ["Dificultad para coordinar agendas para la reunión."],
        risks: ["Falta de justificación para el acceso del usuario externo."]
    }
];
