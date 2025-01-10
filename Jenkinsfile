pipeline {
    agent any

    environment {
        DOCKER_REGISTRY = 'jaydee47'  // DockerHub account (adjust as needed)
        KUBERNETES_CLUSTER = 'https://C104044B04F53C9D9BCA6D442E977AA5.gr7.eu-north-1.eks.amazonaws.com'  // EKS API endpoint
        KUBERNETES_NAMESPACE = 'webapps'  // Kubernetes namespace
        CREDENTIALS_ID_DOCKER = 'docker-cred'  // Jenkins Docker credentials ID
        CREDENTIALS_ID_GITHUB = 'git-cred'  // Jenkins GitHub credentials ID
        CREDENTIALS_ID_K8S = 'k8-token'  // Jenkins Kubernetes secret ID
    }

    stages {
        stage('Checkout Code') {
            steps {
                // Checkout the GitHub repository using Git credentials from Jenkins
                git credentialsId: CREDENTIALS_ID_GITHUB, url: 'https://github.com/raphael-devasia/metavite-final', branch: 'main'
            }
        }

        stage('Build and Push Docker Images') {
            steps {
                script {
                    // Define microservices
                    def services = ['api-gateway', 'auth-service', 'carrier-service', 'load-service', 'notification-service', 'security-service', 'shipper-service']

                    for (service in services) {
                        echo "Processing ${service}..."

                        dir(service) {
                            // Build and push Docker images using the Docker credentials from Jenkins
                            withCredentials([usernamePassword(credentialsId: CREDENTIALS_ID_DOCKER, usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                                sh """
                                docker build -t ${DOCKER_REGISTRY}/${service}:${BUILD_NUMBER} .
                                docker login -u ${DOCKER_USERNAME} -p ${DOCKER_PASSWORD}
                                docker push ${DOCKER_REGISTRY}/${service}:${BUILD_NUMBER}
                                """
                            }
                        }
                    }
                }
            }
        }

        stage('Update Kubernetes Deployment') {
            steps {
                script {
                    // Update each Kubernetes deployment with the new Docker image
                    def services = ['api-gateway', 'auth-service', 'carrier-service', 'load-service', 'notification-service', 'security-service', 'shipper-service']

                    withKubeCredentials(kubectlCredentials: [[caCertificate: '', clusterName: 'EKS-1', contextName: '', credentialsId: CREDENTIALS_ID_K8S, namespace: KUBERNETES_NAMESPACE, serverUrl: KUBERNETES_CLUSTER]]) {
                        for (service in services) {
                            sh """
                            kubectl set image deployment/${service} ${service}=${DOCKER_REGISTRY}/${service}:${BUILD_NUMBER} -n $KUBERNETES_NAMESPACE
                            """
                        }
                    }
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                withKubeCredentials(kubectlCredentials: [[caCertificate: '', clusterName: 'EKS-1', contextName: '', credentialsId: CREDENTIALS_ID_K8S, namespace: KUBERNETES_NAMESPACE, serverUrl: KUBERNETES_CLUSTER]]) {
                    sh 'kubectl get pods -n $KUBERNETES_NAMESPACE'
                }
            }
        }
    }

    post {
        always {
            echo 'Pipeline execution completed.'
        }
        success {
            echo 'Application successfully deployed!'
        }
        failure {
            echo 'Deployment failed. Check logs for details.'
        }
    }
}
