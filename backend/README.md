# SleepGeneMap – Java Spring Boot Backend

Enterprise REST API backend for the **Sleep Disorder Gene & Biomarker Explorer**, built with **Java 17**, **Spring Boot 3.2**, **Spring Data JPA**, **Hibernate**, and **MySQL 8.0**.

---

## 1. Directory Structure

```text
backend/
├── pom.xml                                <-- Maven Project Configuration
├── README.md
└── src/
    └── main/
        ├── java/com/sleepgenemap/
        │   ├── SleepGeneMapApplication.java   <-- Application Main Class
        │   ├── controller/                    <-- Spring REST Controllers
        │   │   ├── DisorderController.java
        │   │   ├── GeneController.java
        │   │   ├── BiomarkerController.java
        │   │   ├── AnalysisController.java
        │   │   ├── SearchController.java
        │   │   └── StatisticsController.java
        │   ├── service/                       <-- Business Logic & Match Engine
        │   │   ├── DisorderService.java
        │   │   ├── GeneService.java
        │   │   ├── BiomarkerService.java
        │   │   └── AnalysisService.java
        │   ├── repository/                    <-- Spring Data JPA Repositories
        │   │   ├── DisorderRepository.java
        │   │   ├── GeneRepository.java
        │   │   ├── BiomarkerRepository.java
        │   │   ├── GeneDisorderRepository.java
        │   │   ├── GeneBiomarkerRepository.java
        │   │   └── DisorderBiomarkerRepository.java
        │   ├── model/                         <-- JPA Relational Entities
        │   │   ├── Disorder.java
        │   │   ├── Gene.java
        │   │   ├── Biomarker.java
        │   │   ├── GeneDisorder.java
        │   │   ├── GeneBiomarker.java
        │   │   ├── DisorderBiomarker.java
        │   │   └── ScientificReference.java
        │   └── dto/                           <-- Data Transfer Objects
        │       ├── AnalysisRequest.java
        │       ├── AnalysisResponse.java
        │       ├── SearchResponse.java
        │       └── StatisticsResponse.java
        └── resources/
            ├── application.properties         <-- Server & DB configuration
            ├── schema.sql                     <-- MySQL table creation script
            └── data.sql                       <-- Verified seed data script
```

---

## 2. Prerequisites
* **Java Development Kit (JDK)**: 17 or higher
* **Apache Maven**: 3.8+
* **MySQL Server**: 8.0+

---

## 3. Database Setup (MySQL)

Create the database and load the schema:
```bash
mysql -u root -p < src/main/resources/schema.sql
mysql -u root -p < src/main/resources/data.sql
```

---

## 4. Building and Running the Backend

```bash
# In the backend/ folder:
mvn clean install
mvn spring-boot:run
```

The Spring Boot REST API will be available at:
```text
http://localhost:8080/api
```

---

## 5. REST API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/statistics` | Returns database record counts |
| `GET` | `/api/disorders` | List all sleep disorders |
| `GET` | `/api/disorders/{id}` | Get specific disorder detail |
| `GET` | `/api/genes` | List all human genes |
| `GET` | `/api/genes/{id}` | Get specific gene detail |
| `GET` | `/api/genes/search?query=PER2` | Search genes |
| `GET` | `/api/biomarkers` | List all biomarkers |
| `GET` | `/api/biomarkers/{id}` | Get specific biomarker detail |
| `GET` | `/api/search?query=insomnia` | Multi-table global search |
| `POST` | `/api/analyze` | Run sample analysis and return non-diagnostic report |
