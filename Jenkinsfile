pipeline {
    agent any

    environment {
        APP_NAME = 'nodejs-demo-app'
        IMAGE_NAME = 'nodejs-demo-app'
        IMAGE_TAG = "${env.BUILD_NUMBER}"
        HOST_PORT = '3000'
        CONTAINER_PORT = '3000'
        // Ensure Jenkins on Windows has access to Docker Desktop, Node.js, and Git in PATH
        PATH = "C:\\Users\\MYTHREYAN\\AppData\\Local\\Programs\\DockerDesktop\\resources\\bin;C:\\Program Files\\nodejs;C:\\Program Files\\Git\\cmd;${env.PATH}"
    }

    stages {
        stage('Install Dependencies') {
            steps {
                echo '=== Stage 1: Installing Node.js Dependencies ==='
                bat 'call npm ci'
            }
        }

        stage('Test Application') {
            steps {
                echo '=== Stage 2: Running Automated Tests ==='
                bat 'call npm test'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "=== Stage 3: Building Docker Image: ${IMAGE_NAME}:${IMAGE_TAG} ==="
                bat "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} -t ${IMAGE_NAME}:latest ."
            }
        }

        stage('Deploy Container') {
            steps {
                echo "=== Stage 4: Deploying Docker Container on Port ${HOST_PORT} ==="
                bat '''
                    @echo off
                    echo Stopping and removing previous container if running...
                    docker rm -f %APP_NAME% 2>nul || ver >nul
                    echo Running newly built container...
                    docker run -d --name %APP_NAME% -p %HOST_PORT%:%CONTAINER_PORT% --restart unless-stopped %IMAGE_NAME%:latest
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                echo '=== Stage 5: Verifying Application Health ==='
                bat '''
                    @echo off
                    echo Waiting for application to initialize inside container...
                    ping 127.0.0.1 -n 6 >nul
                    echo Pinging health check endpoint at http://localhost:%HOST_PORT%/health...
                    curl -s -f http://localhost:%HOST_PORT%/health || exit /b 1
                    echo.
                    echo Deployment verified successfully!
                '''
            }
        }
    }

    post {
        always {
            echo '=== Pipeline Execution Completed ==='
        }
        success {
            echo "SUCCESS: ${APP_NAME} build #${env.BUILD_NUMBER} deployed successfully and verified."
            echo "Access application at: http://localhost:${HOST_PORT}"
            echo "Health endpoint: http://localhost:${HOST_PORT}/health"
        }
        failure {
            echo "FAILURE: Build #${env.BUILD_NUMBER} failed. Review the logs above for details."
        }
    }
}
