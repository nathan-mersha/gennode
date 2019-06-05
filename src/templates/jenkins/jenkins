pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                sh 'npm install pm2 -g || sudo npm install pm2 -g'
                sh 'npm install apidoc -g || sudo npm install apidoc -g'
                sh 'npm install'
                sh 'service mongod start || sudo service mongod start'
            }
        }

        stage('Test') {
            steps {
                sh 'npm run test'
            }
        }

        stage('Documentation') {
            steps {
                sh 'npm run apidoc'
            }
        }

        stage('Deploy') {
            steps {
                sh 'npm run start || sudo npm run start'
            }
        }
    }
}