pipeline {
    agent any
    environment {
        DOCKER_REGISTRY = 'jaydee47'
        KUBERNETES_CLUSTER = 'https://817F6CC0892FECB991BC947AF9E92871.gr7.eu-north-1.eks.amazonaws.com'
        KUBERNETES_NAMESPACE = 'metavite'
        CREDENTIALS_ID_DOCKER = 'docker-cred'
        CREDENTIALS_ID_GITHUB = 'git-cred'
        CREDENTIALS_ID_K8S = 'k8-token'
        IMAGE_TAG = '0.0.0.RELEASE'
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
                    def services = ['api-gateway', 'auth-service', 'carrier-service', 'load-service', 'notification-service', 'security-service', 'shipper-service','payments-service']
                    for (service in services) {
                        echo "Processing ${service}..."
                        dir(service) {
                            withCredentials([usernamePassword(credentialsId: CREDENTIALS_ID_DOCKER, usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                                sh """
                                docker build -t ${DOCKER_REGISTRY}/${service}:${IMAGE_TAG} .
                                docker login -u ${DOCKER_USERNAME} -p ${DOCKER_PASSWORD}
                                docker push ${DOCKER_REGISTRY}/${service}:${IMAGE_TAG}
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
                        
                        // Apply all YAML files from the metavite-K8-Deployment folder
                        sh """
                        kubectl apply -f metavite-K8-Deployment/ -n ${KUBERNETES_NAMESPACE}
                        """
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
