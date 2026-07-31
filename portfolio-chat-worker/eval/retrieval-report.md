# Worker Retrieval Evaluation

Generated: 2026-07-31T11:29:01.839Z
Score: 20/20

This offline check evaluates the lexical half of the live hybrid retriever. Vectorize and Gemini are tested after deployment.

| Test | Pass | Expected hit | Top retrieved chunks |
| --- | --- | --- | --- |
| ml-projects | yes | vehicular-black-box, road-sign-detection, vehicle-horn-detection | project-aggressive-driving-detection-from-imu-sign-f8fkx1, project-vehicle-horn-detection-with-audio-cnn-vjs8u6, project-lane-change-detection-from-imu-data-9eg0wt, project-vehicular-black-box-vehicle-violation-dete-1nqyoo |
| computer-vision | yes | road-sign-detection, smart-fish-habitat | project-road-sign-detection-with-yolo-and-onnx-1wj6cy, project-smart-fish-habitat-management-system-5telb1, experience-research-and-development-inplant-trainee-a-10kubs, education-bsc-eng-hons-electrical-and-electronics-en-1q8fta |
| chatbot-architecture | yes | portfolio-assistant | answering-rules, experience-research-and-development-inplant-trainee-a-10kubs, portfolio-assistant, experience-research-and-development-engineering-inter-lbyk6a |
| unsupported-google | yes | experience | experience-research-and-development-inplant-trainee-a-10kubs, experience-research-and-development-engineering-inter-lbyk6a, education-bsc-eng-hons-electrical-and-electronics-en-1q8fta, project-a7680c-4g-modem-firmware-for-esp32-hd2py6 |
| education | yes | education, bsc-eng-hons-electrical-and-electronics-engineering | education-bsc-eng-hons-electrical-and-electronics-en-1q8fta, education-bsc-physical-sciences-4hvbet, education-gce-advanced-level-physical-stream-109z13, education-cima-chartered-global-management-accountan-18fbf7 |
| contact | yes | profile | profile, answering-rules |
| audio-ml | yes | vehicle-horn-detection, crash-detection | project-vehicle-horn-detection-with-audio-cnn-vjs8u6, project-crash-detection-with-audio-and-imu-sensor--1nm1tq, project-ai-portfolio-assistant-with-rag-and-vector-y4ei1, strengths |
| imu-work | yes | lane-change-detection, aggressive-driving, crash-detection | project-lane-change-detection-from-imu-data-9eg0wt, project-crash-detection-with-audio-and-imu-sensor--1nm1tq, project-aggressive-driving-detection-from-imu-sign-f8fkx1, project-vehicular-black-box-vehicle-violation-dete-1nqyoo |
| edge-deployment | yes | road-sign-detection, vehicle-horn-detection | experience-research-and-development-engineering-inter-lbyk6a, project-road-sign-detection-with-yolo-and-onnx-1wj6cy, experience-research-and-development-inplant-trainee-a-10kubs, project-vehicle-horn-detection-with-audio-cnn-vjs8u6 |
| slt-experience | yes | research-and-development-engineering-intern | experience-research-and-development-engineering-inter-lbyk6a, honor-2nd-place-sri-lanka-youth-rapid-championsh-1i8tw7, honor-3-star-level-performance-sri-lanka-inter-s-thvpt5, honor-1st-runner-up-colombo-district-youth-chess-1exat7 |
| variosystems-experience | yes | research-and-development-inplant-trainee | experience-research-and-development-inplant-trainee-a-10kubs, project-ai-portfolio-assistant-with-rag-and-vector-y4ei1, project-vehicular-black-box-vehicle-violation-dete-1nqyoo, project-road-sign-detection-with-yolo-and-onnx-1wj6cy |
| certifications | yes | ai-ml-engineer-stage-2 | certification-artificial-intelligence-foundations-machin-trqhtx, certification-machine-learning-with-python-foundations-634yqo, certification-machine-learning-with-python-professional--1b2aot, certification-hands-on-ai-introduction-to-retrieval-augm-1exqw7 |
| backend | yes | brms-boarding-room-management-api, servicelink-local-hiring-platform | project-brms-boarding-room-management-api-14s7sh, project-servicelink-local-hiring-platform-1udqm4, project-vehicular-black-box-vehicle-violation-dete-1nqyoo, project-ai-portfolio-assistant-with-rag-and-vector-y4ei1 |
| fyp-production-claim | yes | vehicular-black-box | project-vehicular-black-box-vehicle-violation-dete-1nqyoo, project-smart-fish-habitat-management-system-5telb1, project-crash-detection-with-audio-and-imu-sensor--1nm1tq, project-ai-portfolio-assistant-with-rag-and-vector-y4ei1 |
| python-skills | yes | road-sign-detection, vehicle-horn-detection, lane-change-detection | project-ai-portfolio-assistant-with-rag-and-vector-y4ei1, project-crash-detection-with-audio-and-imu-sensor--1nm1tq, project-aggressive-driving-detection-from-imu-sign-f8fkx1, project-vehicle-horn-detection-with-audio-cnn-vjs8u6 |
| rag-skill-map | yes | portfolio-assistant | project-ai-portfolio-assistant-with-rag-and-vector-y4ei1, portfolio-assistant, certification-artificial-intelligence-foundations-machin-trqhtx, strengths |
| fish-vision | yes | smart-fish-habitat | project-smart-fish-habitat-management-system-5telb1, project-ai-portfolio-assistant-with-rag-and-vector-y4ei1, project-vehicular-black-box-vehicle-violation-dete-1nqyoo, project-road-sign-detection-with-yolo-and-onnx-1wj6cy |
| road-sign-stack | yes | road-sign-detection | project-road-sign-detection-with-yolo-and-onnx-1wj6cy, project-crash-detection-with-audio-and-imu-sensor--1nm1tq, project-aggressive-driving-detection-from-imu-sign-f8fkx1, project-vehicle-horn-detection-with-audio-cnn-vjs8u6 |
| business-background | yes | cima-certificate-in-business-accounting | education-cima-chartered-global-management-accountan-18fbf7, project-brms-boarding-room-management-api-14s7sh, project-smart-fish-habitat-management-system-5telb1, certification-certificate-in-business-accounting-13bsdg |
| unsupported-salary | yes | answering-rules | answering-rules |

A failed row indicates that chunk wording, query expansion, or ranking should be reviewed.
