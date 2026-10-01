# 🚀 Node.js Demo Web App - CI/CD Pipeline with GitHub Actions & Docker Hub

> **DevOps Internship - Task 1** | **Elevate Labs**  
> **Author:** Mythreyan  
> **Repository:** `nodejs-demo-app`

---

## 📌 Project Overview

This repository demonstrates a fully automated end-to-end **Continuous Integration and Continuous Deployment (CI/CD)** pipeline for a Node.js web application using **GitHub Actions** and **Docker Hub**.

Whenever code is pushed to the `main` branch, the automated pipeline:
1. Clones the repository.
2. Installs required dependencies.
3. Executes automated unit/integration tests.
4. Containerizes the application into an optimized Docker image.
5. Pushes the Docker image to **Docker Hub** tagged with both `latest` and the commit SHA.

---

## 🏗️ Architecture & CI/CD Workflow

```mermaid
flowchart TD
    A["Developer pushes code to 'main'"] --> B["GitHub Actions Triggered"]
    
    subgraph CI["Job 1: Test (Continuous Integration)"]
        B --> C["Checkout Code"]
        C --> D["Setup Node.js 20"]
        D --> E["Install Dependencies (`npm ci`)"]
        E --> F["Run Tests (`npm test`)"]
    end
    
    subgraph CD["Job 2: Build & Deploy (Continuous Deployment)"]
        F -->|Tests Pass| G["Setup Docker Buildx"]
        G --> H["Login to Docker Hub (GitHub Secrets)"]
        H --> I["Build Docker Image"]
        I --> J["Tag with Commit SHA & Latest"]
        J --> K["Push Image to Docker Hub"]
    end

    F -->|Tests Fail| L["Workflow Fails & Halts Deployment"]
    K --> M["Ready to deploy on AWS / Kubernetes / Server"]
```

---

## 📂 Project Structure

```text
nodejs-demo-app/
├── .github/
│   └── workflows/
│       └── main.yml        # GitHub Actions CI/CD pipeline definition
├── src/
│   ├── app.js              # Express app definition & API endpoints
│   └── server.js           # Server bootstrap & port listener
├── test/
│   └── app.test.js         # Automated API tests using Node.js native test runner
├── .dockerignore           # Excluded files for clean Docker builds
├── .gitignore             # Git ignored files and directories
├── Dockerfile              # Multi-stage/lean production Docker image configuration
├── package.json            # Node.js project manifest & scripts
├── package-lock.json       # Deterministic dependency lockfile
└── README.md               # Project documentation & interview answers
```

---

## ⚙️ API Endpoints

| Method | Endpoint  | Description | Sample Response |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Root greeting and metadata | `{"status":"success","message":"...","version":"1.0.0"}` |
| `GET` | `/health` | Application healthcheck | `{"status":"healthy","uptime": 12.34}` |

---

## 🛠️ Local Development & Testing

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **Git**
- **Docker** (optional for local container testing)

### 2. Run Locally
```bash
# Clone the repository
git clone https://github.com/<YOUR_USERNAME>/nodejs-demo-app.git
cd nodejs-demo-app

# Install dependencies
npm install

# Start the application
npm start
```
The server will start on `http://localhost:3000`.

### 3. Run Automated Tests
```bash
npm test
```

### 4. Build & Run with Docker Locally
```bash
# Build the Docker image
docker build -t nodejs-demo-app .

# Run the container
docker run -d -p 3000:3000 --name demo-app nodejs-demo-app

# Check container health
curl http://localhost:3000/health
```

---

## 🔐 GitHub Secrets Configuration

To enable automated image pushes to Docker Hub, configure the following secrets in your GitHub repository:

1. Navigate to your GitHub Repository: **Settings** > **Secrets and variables** > **Actions**.
2. Click **New repository secret** and add:
   - **`DOCKERHUB_USERNAME`**: Your Docker Hub username.
   - **`DOCKERHUB_TOKEN`**: A Docker Hub Personal Access Token (PAT).
     *(Generate on Docker Hub: Account Settings > Security > New Access Token with Read/Write permissions)*.

---

## 🤖 CI/CD Pipeline Configuration (`.github/workflows/main.yml`)

The pipeline defines two automated sequential jobs:

1. **`test` (CI)**:
   - Runs on `ubuntu-latest`.
   - Checks out the repository via `actions/checkout@v4`.
   - Caches and sets up Node.js 20 using `actions/setup-node@v4`.
   - Runs `npm ci` followed by `npm test`.

2. **`build-and-push` (CD)**:
   - Requires `test` to pass (`needs: test`).
   - Authenticates with Docker Hub using repository secrets.
   - Generates dynamic tags (`latest` and short commit SHA `${{ github.sha }}`) via `docker/metadata-action@v5`.
   - Builds and publishes the image using Buildx via `docker/build-push-action@v6`.

---

## 💡 Interview Questions & In-Depth Answers

### 1. What is CI/CD?
- **Continuous Integration (CI):** A software engineering practice where developers regularly merge code changes into a central repository, followed by automated builds and test executions. The primary goal is to identify bugs early and reduce integration friction.
- **Continuous Delivery / Continuous Deployment (CD):** 
  - *Continuous Delivery:* Code changes are automatically built, tested, and staged for release into production with a manual approval step.
  - *Continuous Deployment:* Every validated change that passes all CI stages is automatically released to production environments without human intervention.

### 2. How do GitHub Actions work?
GitHub Actions is an event-driven automation platform built directly into GitHub.
- **Workflows:** YAML files stored in `.github/workflows/` that define automation pipelines.
- **Events:** Specific activities that trigger a workflow (e.g., `push`, `pull_request`, `schedule`, `workflow_dispatch`).
- **Jobs:** A set of steps executed on the same runner. Jobs run in parallel by default unless dependency constraints (`needs:`) are declared.
- **Steps:** Individual tasks executing shell scripts or reusable pre-built actions (`uses:`).

### 3. What are runners?
A **runner** is an application/server that executes the jobs defined in a GitHub Actions workflow.
- **GitHub-hosted runners:** Pre-configured virtual machines (Ubuntu Linux, Windows Server, macOS) managed and maintained by GitHub, loaded with common tools and utilities.
- **Self-hosted runners:** Custom machines or servers hosted, secured, and maintained by your own organization, offering dedicated hardware and specialized network access.

### 4. What is the difference between jobs and steps?
| Feature | Jobs | Steps |
| :--- | :--- | :--- |
| **Execution Environment** | Runs in its own separate VM / container runner. | Runs inside the runner allocated for the parent job. |
| **Concurrency** | Runs in parallel by default (unless ordered by `needs:`). | Runs sequentially one after another. |
| **Data Sharing** | Isolated; data must be shared via artifacts or cache. | Shares the same filesystem and environment variables. |

### 5. How to secure secrets in GitHub Actions?
- **Encrypted Secrets:** Store sensitive information (API keys, passwords, access tokens) under repository or organization *Settings > Secrets and variables > Actions*.
- **Masking:** GitHub automatically masks secret values in workflow console logs.
- **Least Privilege:** Always use fine-grained Personal Access Tokens (PATs) instead of root account passwords, and grant only the permissions necessary.
- **Environment Protection Rules:** Restrict secrets to specific environments with required reviewers or branch protection rules.

### 6. How to handle deployment errors?
- **Fail-Fast & Rollbacks:** Automatically halt deployments if pre-deployment tests or healthcheck checks fail, and trigger automatic rollback to the last known stable image/version.
- **Blue/Green or Canary Deployments:** Deploy new versions alongside the current version to direct a small percentage of traffic first and monitor error rates.
- **Pipeline Alerts:** Use status badges, Slack/Discord/Email notifications via GitHub Actions steps (`if: failure()`) to alert on-call engineers.
- **Audit Logs:** Inspect detailed step execution logs inside the GitHub Actions run summary for root cause debugging.

### 7. Explain the Docker build-push workflow.
1. **Dockerfile definition:** Define base images, dependencies, build artifacts, and container entry points.
2. **Context Packaging:** Docker client packages files in the project root (respecting `.dockerignore`) and passes them to the Docker daemon/Buildx engine.
3. **Layer Caching:** Buildx builds image layers incrementally; cached layers speed up repetitive builds.
4. **Authentication:** Authenticate with Docker registry (`docker login`).
5. **Tagging:** Apply target repository namespace and tags (e.g., `username/app:latest`, `username/app:sha-123456`).
6. **Push:** Transfer layers to the container registry (`docker push`).

### 8. How can you test a CI/CD pipeline locally?
- **Using `act` (Nephrolepis/act):** A tool that runs GitHub Actions locally inside Docker containers by parsing `.github/workflows/` files.
- **Local Testing Scripts:** Execute the exact same commands locally that run in CI (`npm ci`, `npm test`, `docker build`).
- **Feature/Test Branches:** Push to a dedicated test branch in a personal fork to observe GitHub Actions runner execution before merging to `main`.
