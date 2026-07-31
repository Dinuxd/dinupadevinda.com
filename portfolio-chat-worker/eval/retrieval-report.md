# Worker Retrieval Evaluation

Generated: 2026-07-31T10:48:46.776Z
Score: 20/20

This offline check evaluates the lexical half of the live hybrid retriever. Vectorize and Gemini are tested after deployment.

| Test | Pass | Expected hit | Top retrieved chunks |
| --- | --- | --- | --- |
| ml-projects | yes | vehicular-black-box, vehicle-horn-detection | project-aggressive-driving-detection-from-imu-signals, project-vehicle-horn-detection-with-audio-cnn, project-lane-change-detection-from-imu-data, project-vehicular-black-box-vehicle-violation-detector |
| computer-vision | yes | road-sign-detection, smart-fish-habitat | project-road-sign-detection-with-yolo-and-onnx, project-smart-fish-habitat-management-system, experience-research-and-development-inplant-trainee-at-variosystems, education-bsc-eng-hons-electrical-and-electronics-engineering |
| chatbot-architecture | yes | portfolio-assistant | answering-rules, experience-research-and-development-inplant-trainee-at-variosystems, portfolio-assistant, experience-research-and-development-engineering-intern-at-sri-lanka-telecom-digital-lab |
| unsupported-google | yes | experience | experience-research-and-development-inplant-trainee-at-variosystems, experience-research-and-development-engineering-intern-at-sri-lanka-telecom-digital-lab, education-bsc-eng-hons-electrical-and-electronics-engineering, project-a7680c-4g-modem-firmware-for-esp32 |
| education | yes | education, bsc-eng-hons-electrical-and-electronics-engineering | education-bsc-eng-hons-electrical-and-electronics-engineering, education-bsc-physical-sciences, education-gce-advanced-level-physical-stream, education-cima-chartered-global-management-accountancy |
| contact | yes | profile | profile, answering-rules |
| audio-ml | yes | vehicle-horn-detection, crash-detection | project-vehicle-horn-detection-with-audio-cnn, project-crash-detection-with-audio-and-imu-sensor-fusion, project-ai-portfolio-assistant-with-rag-and-vector-search, strengths |
| imu-work | yes | lane-change-detection, aggressive-driving, crash-detection | project-lane-change-detection-from-imu-data, project-crash-detection-with-audio-and-imu-sensor-fusion, project-aggressive-driving-detection-from-imu-signals, project-vehicular-black-box-vehicle-violation-detector |
| edge-deployment | yes | road-sign-detection, vehicle-horn-detection | experience-research-and-development-engineering-intern-at-sri-lanka-telecom-digital-lab, project-road-sign-detection-with-yolo-and-onnx, experience-research-and-development-inplant-trainee-at-variosystems, project-vehicle-horn-detection-with-audio-cnn |
| slt-experience | yes | research-and-development-engineering-intern | experience-research-and-development-engineering-intern-at-sri-lanka-telecom-digital-lab, honor-2nd-place-sri-lanka-youth-rapid-championship-colombo-district-u14, honor-3-star-level-performance-sri-lanka-inter-school-chess-team-festival-b-division, honor-1st-runner-up-colombo-district-youth-chess-championship-u15 |
| variosystems-experience | yes | research-and-development-inplant-trainee | experience-research-and-development-inplant-trainee-at-variosystems, project-ai-portfolio-assistant-with-rag-and-vector-search, project-vehicular-black-box-vehicle-violation-detector, project-road-sign-detection-with-yolo-and-onnx |
| certifications | yes | ai-ml-engineer-stage-2 | certification-artificial-intelligence-foundations-machine-learning, certification-machine-learning-with-python-foundations, certification-machine-learning-with-python-professional-certificate, certification-hands-on-ai-introduction-to-retrieval-augmented-generation-rag |
| backend | yes | brms-boarding-room-management-api, servicelink-local-hiring-platform | project-brms-boarding-room-management-api, project-servicelink-local-hiring-platform, project-vehicular-black-box-vehicle-violation-detector, project-ai-portfolio-assistant-with-rag-and-vector-search |
| fyp-production-claim | yes | vehicular-black-box | project-vehicular-black-box-vehicle-violation-detector, project-smart-fish-habitat-management-system, project-crash-detection-with-audio-and-imu-sensor-fusion, project-ai-portfolio-assistant-with-rag-and-vector-search |
| python-skills | yes | vehicle-horn-detection, lane-change-detection | project-ai-portfolio-assistant-with-rag-and-vector-search, project-crash-detection-with-audio-and-imu-sensor-fusion, project-aggressive-driving-detection-from-imu-signals, project-vehicle-horn-detection-with-audio-cnn |
| rag-skill-map | yes | portfolio-assistant | project-ai-portfolio-assistant-with-rag-and-vector-search, portfolio-assistant, certification-artificial-intelligence-foundations-machine-learning, strengths |
| fish-vision | yes | smart-fish-habitat | project-smart-fish-habitat-management-system, project-ai-portfolio-assistant-with-rag-and-vector-search, project-vehicular-black-box-vehicle-violation-detector, project-road-sign-detection-with-yolo-and-onnx |
| road-sign-stack | yes | road-sign-detection | project-road-sign-detection-with-yolo-and-onnx, project-crash-detection-with-audio-and-imu-sensor-fusion, project-aggressive-driving-detection-from-imu-signals, project-vehicle-horn-detection-with-audio-cnn |
| business-background | yes | cima-certificate-in-business-accounting | education-cima-chartered-global-management-accountancy, project-brms-boarding-room-management-api, project-smart-fish-habitat-management-system, certification-certificate-in-business-accounting |
| unsupported-salary | yes | answering-rules | answering-rules |

A failed row indicates that chunk wording, query expansion, or ranking should be reviewed.
