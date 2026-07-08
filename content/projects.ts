export type ProjectDomain =
  | "Edge AI"
  | "Computer Vision"
  | "Audio ML"
  | "Sensor Fusion"
  | "Embedded/IoT"
  | "Backend"
  | "Full Stack"
  | "Hardware"
  | "Software";

export type ProjectMetric = {
  label: string;
  value: string;
  detail?: string;
};

export type ProjectMedia = {
  type: "image" | "video";
  src: string;
  alt: string;
  fit?: "cover" | "contain";
  poster?: string;
};

export type Project = {
  slug: string;
  title: string;
  role: string;
  status: string;
  summary: string;
  domains: ProjectDomain[];
  stack: string[];
  metrics: ProjectMetric[];
  repoUrl?: string;
  linkedinUrl?: string;
  media?: ProjectMedia;
  limitations?: string;
  presentation?: "compact";
  priority: number;
  featured?: boolean;
};

const projectEntries: Project[] = [
  {
    slug: "vehicular-black-box",
    title: "Vehicular Black Box: Vehicle Violation Detector",
    role: "Integrated ML and embedded system",
    status: "FYP prototype",
    summary:
      "Final-year vehicular black-box prototype built around Raspberry Pi hardware. It combines camera, audio, IMU, GPS/GSM inputs, violation and driving-event modules, evidence upload, backend services, and a React dashboard.",
    domains: ["Computer Vision", "Audio ML", "Sensor Fusion", "Embedded/IoT", "Backend", "Full Stack", "Edge AI"],
    stack: ["Raspberry Pi 4B", "Python", "TFLite", "ONNX", "NCNN", "Go", "PostgreSQL", "React", "TypeScript"],
    metrics: [
      { label: "System scope", value: "ML, sensors, backend, dashboard" },
      { label: "Hardware", value: "Raspberry Pi 4B" },
      { label: "Repository", value: "Public GitHub" }
    ],
    repoUrl: "https://github.com/Dinuxd/vehicular-black-box-violation-detector",
    media: {
      type: "video",
      src: "/data/projects/FYP.mp4",
      alt: "Vehicular Black Box FYP demo video",
      poster: "/data/projects/FYP-poster.jpg"
    },
    limitations:
      "Prototype with validation notes and limitations documented.",
    priority: 1,
    featured: true
  },
  {
    slug: "road-sign-detection",
    title: "Road Sign Detection with YOLO and ONNX",
    role: "Computer vision and Raspberry Pi inference",
    status: "Computer vision prototype",
    summary:
      "Two-stage road-sign recognition pipeline for Raspberry Pi. YOLO localizes candidate signs, then an ONNX classifier separates speed limits, traffic lights, no-honking signs, and other signs.",
    domains: ["Computer Vision", "Edge AI"],
    stack: ["YOLO", "ONNX Runtime", "NCNN", "OpenCV", "Python", "Raspberry Pi"],
    metrics: [
      { label: "Pipeline", value: "YOLO detector + ONNX classifier" },
      { label: "Test set", value: "9,062 images" },
      { label: "Deployment", value: "Raspberry Pi / NCNN" }
    ],
    repoUrl: "https://github.com/Dinuxd/road-sign-detection-yolo-onnx",
    media: {
      type: "image",
      src: "/data/projects/road-sign-detection-yolo-onnx.png",
      alt: "Road sign detection pipeline showing YOLO detection, ONNX classification, evaluation metrics, and Raspberry Pi deployment",
      fit: "contain"
    },
    limitations:
      "Metrics and recall notes are documented in the GitHub repo.",
    priority: 2,
    featured: true
  },
  {
    slug: "vehicle-horn-detection",
    title: "Vehicle Horn Detection with Audio CNN",
    role: "Audio ML pipeline and Raspberry Pi inference",
    status: "Audio ML prototype",
    summary:
      "Audio classification model for detecting vehicle horn events from short microphone recordings. The pipeline converts audio into log-mel features, trains a CNN, and exports a lightweight TFLite model.",
    domains: ["Audio ML", "Edge AI"],
    stack: ["TensorFlow", "Keras", "TFLite", "librosa", "SpecAugment", "Python"],
    metrics: [
      { label: "Input", value: "1-second audio windows" },
      { label: "Model", value: "Log-mel CNN" },
      { label: "Export", value: "TensorFlow Lite" }
    ],
    repoUrl: "https://github.com/Dinuxd/vehicle-horn-detection-audio-cnn",
    media: {
      type: "image",
      src: "/data/projects/vehicle-horn-detection-audio-cnn.png",
      alt: "Vehicle horn detection pipeline from raw audio to log-mel features, CNN prediction, and Raspberry Pi deployment",
      fit: "contain"
    },
    limitations:
      "Internal metrics are strong; field validation is the next step.",
    priority: 3,
    featured: true
  },
  {
    slug: "crash-detection-fusion",
    title: "Crash Detection with Audio and IMU Sensor Fusion",
    role: "Audio and IMU fusion prototype",
    status: "FYP module",
    summary:
      "Crash-detection module that combines audio and IMU signals instead of relying on one sensor. The project packages separate model outputs into simple fusion labels for the vehicular black-box prototype.",
    domains: ["Audio ML", "Sensor Fusion", "Edge AI"],
    stack: ["PyTorch", "TensorFlow/Keras", "CNN-GRU", "log-mel", "Raspberry Pi", "Python"],
    metrics: [
      { label: "Signals", value: "Audio + IMU" },
      { label: "Models", value: "CNN + CNN-GRU" },
      { label: "Output", value: "Crash confidence labels" }
    ],
    repoUrl: "https://github.com/Dinuxd/crash-detection-audio-imu-fusion",
    media: {
      type: "image",
      src: "/data/projects/crash-detection-audio-imu-fusion.png",
      alt: "Crash detection pipeline combining audio detection, IMU detection, fusion logic, and Raspberry Pi deployment",
      fit: "contain"
    },
    limitations:
      "Prototype module with validation limits stated.",
    priority: 4,
    featured: true
  },
  {
    slug: "lane-change-detection-imu",
    title: "Lane Change Detection from IMU Data",
    role: "IMU feature engineering and XGBoost",
    status: "Published dataset and ML model",
    summary:
      "Recall-focused lane-change detector using BMI160 accelerometer and gyroscope data. It builds 3.5-second windows, extracts motion features, and uses XGBoost on the public BYD driving-events dataset.",
    domains: ["Sensor Fusion", "Edge AI"],
    stack: ["XGBoost", "scikit-learn", "Python", "BMI160 IMU", "Zenodo", "Kaggle"],
    metrics: [
      { label: "Input", value: "3.5-second IMU windows" },
      { label: "Recall", value: "0.9809" },
      { label: "ROC AUC", value: "0.9497" }
    ],
    repoUrl: "https://github.com/Dinuxd/lane-change-detection-imu",
    media: {
      type: "image",
      src: "/data/projects/lane-change-detection-imu.png",
      alt: "Lane change detection project thumbnail showing IMU inputs, ML workflow, public dataset links, and Raspberry Pi deployment",
      fit: "contain"
    },
    limitations:
      "Recall-focused prototype with false-positive tradeoffs documented in the repository.",
    priority: 5,
    featured: true
  },
  {
    slug: "aggressive-driving-detection-imu",
    title: "Aggressive Driving Detection from IMU Signals",
    role: "IMU time-window classification",
    status: "ML prototype",
    summary:
      "Sensor-based model for classifying normal versus aggressive driving behavior. It uses yaw-rate and acceleration windows, compares multiple models, and keeps the selected Optuna-tuned XGBoost artifact.",
    domains: ["Sensor Fusion", "Edge AI"],
    stack: ["XGBoost", "Optuna", "scikit-learn", "Python", "IMU windows", "Hugging Face dataset"],
    metrics: [
      { label: "Input", value: "2-second IMU windows" },
      { label: "Model", value: "Optuna XGBoost" },
      { label: "ROC AUC", value: "0.862" }
    ],
    repoUrl: "https://github.com/Dinuxd/aggressive-driving-detection-imu",
    media: {
      type: "image",
      src: "/data/projects/aggressive-driving-detection-imu.png",
      alt: "Aggressive driving detection project thumbnail showing IMU features, model comparison, Optuna XGBoost, and deployment artifact",
      fit: "contain"
    },
    limitations:
      "High precision prototype; recall still needs improvement before real safety use.",
    priority: 6,
    featured: true
  },
  {
    slug: "a7680c-gsm-4g-library",
    title: "A7680C 4G Modem Firmware for ESP32",
    role: "C/C++ IoT communication",
    status: "SLT R&D project",
    summary:
      "C/C++ firmware work for ESP32-based edge devices using the A7680C 4G modem. It covers AT-command handling, MQTT/MQTTS, HTTP, SMTP, SMS, and call support for cellular IoT prototypes.",
    domains: ["Embedded/IoT", "Software"],
    stack: ["C/C++", "ESP32", "A7680C", "MQTT/MQTTS", "HTTP", "SMTP", "SMS/call", "AT commands"],
    metrics: [
      { label: "Device", value: "ESP32 + A7680C" },
      { label: "Protocols", value: "MQTT/MQTTS, HTTP, SMTP" },
      { label: "Use case", value: "LTE IoT communication" }
    ],
    repoUrl: "https://github.com/Dinuxd/MQTTS_SLT",
    presentation: "compact",
    priority: 7
  },
  {
    slug: "industrial-machine-monitoring",
    title: "Industrial Machine Monitoring System",
    role: "IoT telemetry and dashboard prototype",
    status: "SLT R&D prototype",
    summary:
      "Telemetry prototype for monitoring industrial machine data over LTE. It collects sensor readings with ESP32 hardware, validates payloads, and publishes secure MQTTS JSON data to dashboards.",
    domains: ["Embedded/IoT"],
    stack: ["ESP32", "A7680C", "ThingsBoard", "MQTTS", "MAX6675", "ACS712", "WebSocket MQTT"],
    metrics: [
      { label: "Device", value: "ESP32 + LTE modem" },
      { label: "Data flow", value: "MQTTS JSON telemetry" },
      { label: "Dashboard", value: "ThingsBoard + browser" }
    ],
    media: {
      type: "image",
      src: "/data/projects/machine_monitoring.jpg",
      alt: "Industrial machine monitoring hardware prototype"
    },
    priority: 9
  },
  {
    slug: "atm-room-monitoring-ir-ac-control",
    title: "ATM Room Monitoring and IR AC Control",
    role: "Embedded IoT monitoring",
    status: "SLT R&D prototype",
    summary:
      "ATM room monitoring prototype for temperature and humidity tracking. It also tests IR-based AC control logic with remote status reporting and telemetry debugging.",
    domains: ["Embedded/IoT"],
    stack: ["ESP32", "IR control", "Telemetry", "MQTT/HTTP", "Dashboard monitoring"],
    metrics: [
      { label: "Sensors", value: "Temperature + humidity" },
      { label: "Control", value: "IR AC commands" },
      { label: "Reporting", value: "Remote telemetry" }
    ],
    media: {
      type: "image",
      src: "/data/projects/atm_control.jpg",
      alt: "ATM room monitoring and IR AC control prototype"
    },
    priority: 10
  },
  {
    slug: "servicelink",
    title: "ServiceLink: Local Hiring Platform",
    role: "Full-stack developer",
    status: "Marketplace prototype",
    summary:
      "Role-based service marketplace for local hiring workflows. It includes Spring Boot APIs, React pages, JWT authentication, service listings, bookings, categories, and messaging.",
    domains: ["Full Stack", "Backend"],
    stack: ["Spring Boot", "React", "MongoDB", "MySQL", "JWT"],
    metrics: [
      { label: "Backend", value: "Spring Boot APIs" },
      { label: "Frontend", value: "React marketplace" },
      { label: "Auth", value: "JWT login flow" }
    ],
    repoUrl: "https://github.com/Dinuxd/Servicelink",
    media: {
      type: "video",
      src: "/data/projects/servicelink.mp4",
      alt: "ServiceLink marketplace demo video",
      poster: "/data/projects/servicelink-poster.jpg"
    },
    priority: 11
  },
  {
    slug: "brms-boarding-room-management-api",
    title: "BRMS Boarding Room Management API",
    role: "Backend API developer",
    status: "Backend project",
    summary:
      "Java Spring Boot REST API for boarding-room management workflows. It uses Spring Data JPA, SQL Server configuration, environment-based settings, and H2-backed testing.",
    domains: ["Backend", "Software"],
    stack: ["Java", "Spring Boot", "REST APIs", "Spring Data JPA", "SQL Server", "H2"],
    metrics: [
      { label: "Backend", value: "Spring Boot REST" },
      { label: "Database", value: "SQL Server" },
      { label: "Tests", value: "H2 test setup" }
    ],
    repoUrl: "https://github.com/Dinuxd/brms-spring-boot-api",
    presentation: "compact",
    priority: 8
  },
  {
    slug: "edupress-store",
    title: "EduPress Store",
    role: "Full-stack web developer",
    status: "Web platform",
    summary:
      "PHP/MySQL web platform for a stationery store and print-on-demand workflow. It supports product browsing, PDF uploads, print-job pricing, and order collection.",
    domains: ["Full Stack"],
    stack: ["PHP", "MySQL", "JavaScript", "XAMPP"],
    metrics: [
      { label: "Stack", value: "PHP + MySQL" },
      { label: "Workflow", value: "Products + print jobs" },
      { label: "Users", value: "Customer orders" }
    ],
    repoUrl: "https://github.com/Dinuxd/EduPress-Store-Website",
    media: {
      type: "video",
      src: "/data/projects/edupress_demo.mp4",
      alt: "EduPress store demo video",
      poster: "/data/projects/edupress_demo-poster.jpg"
    },
    priority: 12
  },
  {
    slug: "smart-fish-habitat",
    title: "Smart Fish Habitat Management System",
    role: "Raspberry Pi automation and vision",
    status: "Smart aquarium project",
    summary:
      "Automated aquarium management system using Raspberry Pi 4 for water-quality monitoring, scheduled feeding, slow water changing, filtration, aeration, and heating. The project also tested YOLOv11 fish detection and TensorFlow Lite vision work for visual water-quality assessment.",
    domains: ["Embedded/IoT", "Computer Vision", "Software"],
    stack: ["Raspberry Pi 4", "Python", "DS18B20", "PH-4502C", "TensorFlow Lite", "YOLOv11", "Servo control", "Solenoid valves", "Relay control"],
    metrics: [
      { label: "Platform", value: "Raspberry Pi 4" },
      { label: "Subsystems", value: "Monitoring, feeding, water change" },
      { label: "Vision", value: "YOLOv11 + TFLite tests" }
    ],
    linkedinUrl: "https://www.linkedin.com/posts/dinupadevinda_im-happy-to-share-this-advanced-automated-ugcPost-7344258111374794753-unXK/",
    media: {
      type: "video",
      src: "/data/projects/smart_fish_habitat.mp4",
      alt: "Smart Fish Habitat Management System demo video",
      poster: "/data/projects/smart_fish_habitat-poster.jpg"
    },
    priority: 13
  },
  {
    slug: "agv",
    title: "Automated Guided Vehicle",
    role: "Mechatronics trainee project",
    status: "Factory automation",
    summary:
      "Factory line-following AGV prototype built during mechatronics training. It combines Arduino control, motor drivers, encoders, IR line sensing, and ultrasonic collision avoidance.",
    domains: ["Embedded/IoT", "Hardware"],
    stack: ["Arduino Mega", "Pololu drivers", "IR sensors", "Encoders", "Ultrasonic"],
    metrics: [
      { label: "Control", value: "Arduino Mega" },
      { label: "Navigation", value: "Line following" },
      { label: "Safety", value: "Ultrasonic stop" }
    ],
    media: {
      type: "video",
      src: "/data/projects/agv.mp4",
      alt: "Automated guided vehicle demo video",
      poster: "/data/projects/agv-poster.jpg"
    },
    linkedinUrl: "https://www.linkedin.com/posts/dinupadevinda_im-happy-to-share-this-automated-guided-activity-7239268930567950336-hoXd",
    priority: 14
  },
  {
    slug: "automated-pcb-conveyor",
    title: "Automated PCB Conveyor System",
    role: "Manufacturing automation project",
    status: "Variosystems trainee project",
    summary:
      "Automation project for PCB movement on a manufacturing floor. The work focused on embedded control logic, sensing, and practical process-flow constraints.",
    domains: ["Embedded/IoT", "Hardware"],
    stack: ["Embedded C/C++", "Sensors", "Automation", "Manufacturing"],
    metrics: [
      { label: "Context", value: "PCB line handling" },
      { label: "Work", value: "Embedded control" },
      { label: "Setting", value: "Factory automation" }
    ],
    media: {
      type: "image",
      src: "/data/projects/smt_conveyor.jpg",
      alt: "Automated PCB conveyor system prototype"
    },
    priority: 15
  },
  {
    slug: "flame-treatment-automation-upgrade",
    title: "FLG 201 Flame-Treatment Automation Upgrade",
    role: "Manufacturing automation project",
    status: "Variosystems trainee project",
    summary:
      "Automation upgrade work for a flame-treatment process in electronics manufacturing. It combines control logic, hardware constraints, and reliability needs from the production floor.",
    domains: ["Embedded/IoT", "Hardware"],
    stack: ["Automation", "Control logic", "Sensors", "Manufacturing"],
    metrics: [
      { label: "Context", value: "EMS manufacturing" },
      { label: "Work", value: "Automation upgrade" },
      { label: "Focus", value: "Control reliability" }
    ],
    media: {
      type: "video",
      src: "/data/projects/flame_treatment.mp4",
      alt: "FLG 201 flame-treatment automation upgrade demo video",
      poster: "/data/projects/flame_treatment-poster.jpg"
    },
    priority: 16
  },
  {
    slug: "music-streaming-management-system",
    title: "Music Streaming Management System",
    role: "Java application developer",
    status: "Academic software project",
    summary:
      "Java-based management system for music streaming workflows. The project applies object-oriented programming, data handling, and basic application logic.",
    domains: ["Software"],
    stack: ["Java", "OOP", "Data handling"],
    metrics: [
      { label: "Language", value: "Java" },
      { label: "Design", value: "OOP application" },
      { label: "Focus", value: "Data workflows" }
    ],
    presentation: "compact",
    priority: 17
  },
  {
    slug: "public-transport-file-database",
    title: "Public Transport File-Based Database System",
    role: "C programming project",
    status: "Academic software project",
    summary:
      "File-based database system in C for public transport records. It focuses on structured data, file operations, and command-line program logic.",
    domains: ["Software"],
    stack: ["C", "File handling", "Data structures"],
    metrics: [
      { label: "Language", value: "C" },
      { label: "Storage", value: "File-based records" },
      { label: "Focus", value: "CRUD logic" }
    ],
    repoUrl: "https://github.com/Dinuxd/public-transport-management-c",
    presentation: "compact",
    priority: 18
  },
  {
    slug: "music-player-app",
    title: "Music Player App",
    role: "C#/.NET app developer",
    status: "Desktop app project",
    summary:
      "C#/.NET desktop music player project. It focuses on interface logic, media handling, playback controls, and desktop application structure.",
    domains: ["Software"],
    stack: ["C#", ".NET", "Desktop app"],
    metrics: [
      { label: "Language", value: "C#" },
      { label: "Platform", value: ".NET desktop" },
      { label: "Media", value: "Playback controls" }
    ],
    repoUrl: "https://github.com/Dinuxd/MusicPlayerApp",
    media: {
      type: "video",
      src: "/data/projects/music_player_demo.mp4",
      alt: "Music Player App demo video",
      poster: "/data/projects/music_player_demo-poster.jpg"
    },
    priority: 20
  },
  {
    slug: "bandpass-filter-design",
    title: "Bandpass Filter Design",
    role: "Electronics design project",
    status: "Academic electronics project",
    summary:
      "Analog electronics project for designing a bandpass filter. It covers signal-conditioning concepts, frequency response, component selection, and practical circuit behavior.",
    domains: ["Hardware"],
    stack: ["Analog electronics", "Filters", "Frequency response", "Circuit design"],
    metrics: [
      { label: "Area", value: "Analog electronics" },
      { label: "Circuit", value: "Bandpass filter" },
      { label: "Focus", value: "Frequency response" }
    ],
    media: {
      type: "image",
      src: "/data/projects/bandpass_filter.jpg",
      alt: "Bandpass filter circuit project"
    },
    priority: 21
  },
  {
    slug: "ds1302-rtc-assembly",
    title: "DS1302 RTC Assembly Mini Project",
    role: "Assembly mini project",
    status: "Electronics project",
    summary:
      "Mini project using a DS1302 real-time clock module. It focuses on low-level programming, module communication, and basic electronics integration.",
    domains: ["Hardware", "Software"],
    stack: ["Assembly", "DS1302 RTC", "Embedded systems"],
    metrics: [
      { label: "Module", value: "DS1302" },
      { label: "Language", value: "Assembly" },
      { label: "Focus", value: "Low-level I/O" }
    ],
    presentation: "compact",
    priority: 19
  }
];

export const projects = [...projectEntries].sort((a, b) => a.priority - b.priority);

export const featuredProjects = projects.filter((project) => project.featured);
