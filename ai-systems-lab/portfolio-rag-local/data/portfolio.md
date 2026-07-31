# Dinupa Devinda Portfolio Knowledge

## Profile

Dinupa Devinda is a Machine Learning Focused Engineer based in Colombo, Sri Lanka. His headline is Machine Learning | AI/ML Developer | R&D Engineer.

His background combines engineering, computer science, mathematics, applied machine learning, embedded systems, and software projects. He is interested in intelligent, data-driven solutions for engineering and technology problems.

Main contact links:

- Email: dwmddevinda@gmail.com
- LinkedIn: https://www.linkedin.com/in/dinupadevinda/
- GitHub: https://github.com/Dinuxd
- Kaggle: https://www.kaggle.com/dinupadevinda
- CV: https://www.dinupadevinda.com/data/CV-%20Dinupa%20Devinda.pdf

## Education

### BSc Eng (Hons), Electrical and Electronics Engineering

Institution: SLIIT

Period: Oct 2022 to Oct 2026

Engineering background with work across automation, embedded systems, electronics, machine learning, computer vision, and sensor-based projects.

### BSc Physical Sciences

Institution: University of Kelaniya Sri Lanka

Period: 2022-2026

Subject combination: Computer Science, Pure Mathematics, and Applied Mathematics.

This background supports programming, algorithms, modelling, and machine learning foundations.

### CIMA Certificate in Business Accounting

Institution: CIMA

Period: Mar 2022 to Apr 2024

Certificate in Business Accounting completed; reading for Dip MA (Operational Level). This adds business, economics, management accounting, and finance exposure.

## Experience

### Research and Development Engineering Intern

Organization: Sri Lanka Telecom - Digital Lab

Period: Jun 2025 to Sep 2025

Dinupa developed C/C++ firmware for ESP32 edge devices with A7680C 4G modem AT-command handling, MQTT/MQTTS, HTTP, SMTP, SMS, and call support. He built telemetry pipelines using MQTT/HTTP and JSON payloads, and worked with ThingsBoard dashboards, web portals, MQTT Explorer, HiveMQ, Grafana exposure, and basic GitHub Actions/CI practice.

### Research and Development Inplant Trainee

Organization: Variosystems

Period: Jun 2024 to Sep 2024

Dinupa built C/C++ automation and embedded-control projects in an electronics manufacturing environment, including an Automated Guided Vehicle, flame-treatment automation upgrade, and automated PCB conveyor system. He gained exposure to SMT/THT manufacturing, ICT and functional testing, SPEA 3030/4050 test systems, FactoryLogix workflows, production data flow, and NPI processes.

## Projects

### AI Portfolio Assistant with RAG and Vector Search

Type: Portfolio AI assistant and retrieval system

Summary: Portfolio chatbot using a Cloudflare Worker, Gemini embeddings, Cloudflare Vectorize, keyword retrieval, reciprocal-rank fusion, structured grounded answers, and validated source links. This folder provides a separate Dockerized Python and Chroma implementation for learning, retrieval testing, and offline comparison.

Areas: LLM integration, RAG, embeddings, vector search, evaluation, serverless backend, AI systems.

Stack: Gemini API, Cloudflare Workers, Cloudflare Vectorize, Python, Chroma, sentence-transformers, Docker, Next.js, TypeScript, evaluation harness.

What it demonstrates: Prompting, hybrid retrieval, embeddings, vector search, rank fusion, structured outputs, source validation, evaluation, CORS, rate limiting, prompt-injection checks, and secure secret handling.

Local RAG flow: portfolio text -> chunks -> embeddings -> Chroma vector search -> retrieved chunks -> grounded prompt -> Gemini answer.

Evaluation: The lab includes 20 test questions covering correct project answers, unsupported-claim refusal, education, contact, chatbot architecture, and hallucination traps.

Limitation: Portfolio-scale AI assistant. It should not be described as an enterprise RAG platform or production agent framework.

GitHub: https://github.com/Dinuxd/dinupadevinda.com/tree/main/ai-systems-lab/portfolio-rag-local

### Vehicular Black Box: Vehicle Violation Detector

Type: Final-year integrated ML and embedded system

Summary: Raspberry Pi based vehicle black-box prototype combining camera, audio, IMU, GPS/GSM inputs, violation and driving-event modules, evidence upload, backend services, and a React dashboard.

Areas: Computer vision, audio ML, sensor fusion, embedded systems, backend, full stack.

Stack: Raspberry Pi 4B, Python, TFLite, ONNX, NCNN, Go, PostgreSQL, React, TypeScript.

GitHub: https://github.com/Dinuxd/vehicular-black-box-violation-detector

Limitation: Prototype with validation notes and limitations. It should not be described as a production-ready safety system.

### Road Sign Detection with YOLO and ONNX

Type: Computer vision prototype

Summary: Two-stage road-sign recognition pipeline. YOLO localizes candidate signs and an ONNX classifier separates speed limits, traffic lights, no-honking signs, and other signs for Raspberry Pi style deployment.

Areas: Computer vision, edge deployment.

Stack: YOLO, ONNX Runtime, NCNN, OpenCV, Python, Raspberry Pi.

Metrics and evidence: 9,062 image test set and NCNN/Raspberry Pi deployment work.

GitHub: https://github.com/Dinuxd/road-sign-detection-yolo-onnx

### Vehicle Horn Detection with Audio CNN

Type: Audio ML prototype

Summary: Vehicle horn detector using 1-second microphone windows, log-mel features, CNN training, and TensorFlow Lite export for lightweight inference.

Areas: Audio ML, signal processing, edge deployment.

Stack: TensorFlow, Keras, TFLite, librosa, SpecAugment, Python.

GitHub: https://github.com/Dinuxd/vehicle-horn-detection-audio-cnn

Limitation: Internal metrics are strong; field validation is the next step.

### Crash Detection with Audio and IMU Sensor Fusion

Type: FYP module

Summary: Crash detection module combining audio and IMU signals. It packages separate model outputs into fusion labels for the vehicular black-box prototype.

Areas: Audio ML, IMU data, sensor fusion.

Stack: PyTorch, TensorFlow/Keras, CNN-GRU, log-mel, Raspberry Pi, Python.

GitHub: https://github.com/Dinuxd/crash-detection-audio-imu-fusion

### Lane Change Detection from IMU Data

Type: Published dataset and ML model

Summary: Recall-focused lane-change detector using BMI160 accelerometer and gyroscope windows, motion features, and XGBoost on a public BYD driving-events dataset.

Areas: Sensor data, applied ML, dataset work.

Stack: XGBoost, scikit-learn, Python, BMI160 IMU, Zenodo, Kaggle.

Metrics: 3.5-second IMU windows, recall 0.9809, ROC AUC 0.9497.

GitHub: https://github.com/Dinuxd/lane-change-detection-imu

### Aggressive Driving Detection from IMU Signals

Type: ML prototype

Summary: Sensor-based model for classifying normal versus aggressive driving behavior using yaw-rate and acceleration windows, model comparison, and Optuna-tuned XGBoost.

Areas: Sensor data, applied ML.

Stack: XGBoost, Optuna, scikit-learn, Python, IMU windows.

Metrics: 2-second IMU windows, ROC AUC 0.862.

GitHub: https://github.com/Dinuxd/aggressive-driving-detection-imu

### A7680C 4G Modem Firmware for ESP32

Type: SLT R&D embedded/IoT work

Summary: C/C++ firmware for ESP32 edge devices using the A7680C LTE modem, with AT-command handling, MQTT/MQTTS, HTTP, SMTP, SMS, and call support.

Areas: Embedded systems, IoT, cellular telemetry.

Stack: C/C++, ESP32, A7680C, MQTT/MQTTS, HTTP, SMTP.

GitHub: https://github.com/Dinuxd/MQTTS_SLT

### BRMS Boarding Room Management API

Type: Backend project

Summary: Java Spring Boot REST API for boarding-room management workflows with Spring Data JPA, SQL Server configuration, environment-based settings, and H2-backed testing.

Areas: Backend, REST APIs.

Stack: Java, Spring Boot, REST APIs, Spring Data JPA, SQL Server, H2.

GitHub: https://github.com/Dinuxd/brms-spring-boot-api

### ServiceLink: Local Hiring Platform

Type: Full-stack marketplace prototype

Summary: Role-based service marketplace with Spring Boot APIs, React pages, JWT authentication, service listings, bookings, categories, and messaging.

Areas: Full stack, backend.

Stack: Spring Boot, React, MongoDB, MySQL, JWT.

GitHub: https://github.com/Dinuxd/Servicelink

### Smart Fish Habitat Management System

Type: Raspberry Pi automation and vision project

Summary: Automated aquarium system for water-quality monitoring, scheduled feeding, water changing, filtration, aeration, and heating. The project also tested YOLOv11 fish detection and TensorFlow Lite vision work for water-quality assessment.

Areas: Embedded systems, computer vision, automation.

Stack: Raspberry Pi 4, Python, DS18B20, PH-4502C, TensorFlow Lite, YOLOv11.

LinkedIn: https://www.linkedin.com/posts/dinupadevinda_im-happy-to-share-this-advanced-automated-ugcPost-7344258111374794753-unXK/

## Certifications

### AI/ML Engineer - Stage 2

Issuer: SLIIT

Issued: Jul 2025

Credential: https://code.sliit.org/certificates/b8egsjtckg

Skills: Supervised learning, regression models, AI/ML fundamentals.

### AI/ML Engineer - Stage 1

Issuer: SLIIT

Issued: May 2023

Credential: https://drive.google.com/file/d/1gPbBV0GXgW7Kq5dNdOuhEG08eenRgZNq/view

### PyTorch Bootcamp

Issuer: OpenCV University

Issued: Aug 2025

Credential: https://courses.opencv.org/certificates/87518a7fb87d470c8264c21bd2739b3d

Skills: Multi-layer perceptrons, convolutional neural networks, feature extraction, transfer learning, YOLO.

### Python for Beginners

Issuer: University of Moratuwa

Issued: Mar 2023

Credential: https://drive.google.com/file/d/1bfgMeKeO37fvejzvHCRKnUOJcolf73d6/view

### Microcontroller Programming Embedded C and Assembly Language

Issuer: MindLuster

Issued: Jun 2024

Credential: https://drive.google.com/file/d/1Qi4NgwflOHmfGKGxMxaOhH7HKHSVmi-F/view

### IT Essentials

Issuer: Cisco

Issued: Aug 2025

Credential: https://www.credly.com/badges/b639445f-3c22-4a27-b29a-1527403adfc2/linked_in_profile

### Certificate in Business Accounting

Issuer: CIMA

Issued: Mar 2023

## Portfolio Assistant

The portfolio assistant is a portfolio-scale hybrid RAG chatbot. Its Worker combines Gemini question embeddings and Cloudflare Vectorize with keyword retrieval, then fuses both rankings before asking Gemini to answer from the selected evidence. This folder contains the Dockerized local Python and Chroma version used for learning, reproducible setup, and comparison.

Architecture:

- The portfolio remains a static Next.js export suitable for GitHub Pages.
- A floating React chat widget sends visitor questions to a Cloudflare Worker /chat endpoint.
- The Cloudflare Worker loads the public knowledge file public/portfolio-chat.json from the portfolio site.
- The Worker builds typed chunks from public/portfolio-chat.json.
- Gemini Embedding 2 creates task-formatted document and question embeddings.
- Cloudflare Vectorize semantic results and keyword results are combined with reciprocal-rank fusion.
- Gemini receives only the selected evidence and returns structured JSON with cited source IDs.
- The Worker validates source IDs before returning the answer and clickable sources.
- The Gemini API key is stored only as a Cloudflare Worker secret, not in browser code.
- The Worker applies request limits, CORS, rate limiting, prompt-injection checks, secure reindex authentication, and structured logs.

The local AI Systems Lab upgrades this learning path by adding Docker, chunking, local embeddings, Chroma vector search, retrieved sources, and an evaluation harness.

Skills shown through the assistant:

- Prompting and system instructions.
- Hybrid vector and keyword retrieval with reciprocal-rank fusion.
- Structured grounding and source-ID validation.
- Gemini API integration.
- Cloudflare Worker backend, CORS, and secret handling.
- Python RAG learning code.
- Embeddings with sentence-transformers.
- Chroma vector database retrieval.
- Docker setup for reproducible local runs.
- Evaluation harness for reliability.
- Cloudflare Vectorize as the public vector database.

Future extension labs can cover agent loops, tool calling, MCP, LangChain, LangGraph, MLOps, local Kubernetes, fine-tuning, LoRA, and distillation. These should be built as separate small demos instead of being claimed as current chatbot features.

## Answering Rules

Answer only from the portfolio context. If a fact is not included, say the portfolio does not include that information. Do not invent employment, production claims, awards, certifications, or metrics. Do not claim Dinupa worked at Google unless the portfolio explicitly says so. Do not describe prototypes as production-ready safety systems.
