pipeline {
    agent any
    environment {
        DOCKER_REGISTRY = 'jaydee47'
        KUBERNETES_CLUSTER = 'https://C104044B04F53C9D9BCA6D442E977AA5.gr7.eu-north-1.eks.amazonaws.com'
        KUBERNETES_NAMESPACE = 'webapps'
        CREDENTIALS_ID_DOCKER = 'docker-cred'
        CREDENTIALS_ID_GITHUB = 'git-cred'
        CREDENTIALS_ID_K8S = 'k8-token'
    }
    stages {
        stage('Checkout Code') {
            steps {
                git credentialsId: CREDENTIALS_ID_GITHUB, url: 'https://github.com/raphael-devasia/metavite-final', branch: 'main'
            }
        }
        stage('Build and Push Docker Images') {
            steps {
                script {
                    def services = ['api-gateway', 'auth-service', 'carrier-service', 'load-service', 'notification-service', 'security-service', 'shipper-service']
                    for (service in services) {
                        echo "Processing ${service}..."
                        dir(service) {
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
        stage('Deploy to Kubernetes') {
            steps {
                script {
                    withKubeCredentials(kubectlCredentials: [[caCertificate: '', clusterName: 'EKS-1', contextName: '', credentialsId: CREDENTIALS_ID_K8S, namespace: KUBERNETES_NAMESPACE, serverUrl: KUBERNETES_CLUSTER]]) {
                        // Create namespace if it doesn't exist
                        sh "kubectl create namespace ${KUBERNETES_NAMESPACE} --dry-run=client -o yaml | kubectl apply -f -"
                        
                        // Apply RabbitMQ resources first
                        sh """
                        kubectl apply -f metavite-K8-Deployment/rabbitmq-config.yaml -n ${KUBERNETES_NAMESPACE}
                        kubectl apply -f metavite-K8-Deployment/rabbitmq-secret.yaml -n ${KUBERNETES_NAMESPACE}
                        kubectl apply -f metavite-K8-Deployment/rabbitmq-service.yaml -n ${KUBERNETES_NAMESPACE}
                        """
                        
                        // Apply MongoDB configs
                        sh """
                        kubectl apply -f metavite-K8-Deployment/mongo-config-auth.yaml -n ${KUBERNETES_NAMESPACE}
                        kubectl apply -f metavite-K8-Deployment/mongo-config-carrier.yaml -n ${KUBERNETES_NAMESPACE}
                        kubectl apply -f metavite-K8-Deployment/mongo-config-load.yaml -n ${KUBERNETES_NAMESPACE}
                        kubectl apply -f metavite-K8-Deployment/mongo-config-security.yaml -n ${KUBERNETES_NAMESPACE}
                        kubectl apply -f metavite-K8-Deployment/mongo-config-shipper.yaml -n ${KUBERNETES_NAMESPACE}
                        """
                        
                        // Apply service deployments with updated image tags
                        def services = ['api-gateway', 'auth-service', 'carrier-service', 'load-service', 'notification-service', 'security-service', 'shipper-service']
                        for (service in services) {
                            // Read the deployment file and update the image
                            sh """
                            sed -i 's|image: ${DOCKER_REGISTRY}/${service}:[0-9.]*RELEASE|image: ${DOCKER_REGISTRY}/${service}:${BUILD_NUMBER}|g' metavite-K8-Deployment/${service}-deployment.yaml
                            kubectl apply -f metavite-K8-Deployment/${service}-deployment.yaml -n ${KUBERNETES_NAMESPACE}
                            """
                        }
                    }
                }
            }
        }
        stage('Verify Deployment') {
            steps {
                withKubeCredentials(kubectlCredentials: [[caCertificate: '', clusterName: 'EKS-1', contextName: '', credentialsId: CREDENTIALS_ID_K8S, namespace: KUBERNETES_NAMESPACE, serverUrl: KUBERNETES_CLUSTER]]) {
                    sh """
                    kubectl get pods -n ${KUBERNETES_NAMESPACE}
                    kubectl get services -n ${KUBERNETES_NAMESPACE}
                    """
                }
            }
        }
    }
    post {
        always {
            echo 'Pipeline execution completed.'
            // Clean up local Docker images to free up space
            sh """
            docker system prune -f
            """
        }
        success {
            echo 'Application successfully deployed!'
        }
        failure {
            echo 'Deployment failed. Check logs for details.'
        }
    }
}