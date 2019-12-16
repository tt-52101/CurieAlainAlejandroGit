pipeline {
  agent any
    
  stages {    
    stage('Cloning Git') {
      steps {
        git 'https://github.com/AlejandroITOP/CurieAlainAlejandroGit.git'
      }
    }
    stage('Install dependencies') {
      steps {
        sh 'npm install'
      }
    }
  }     
}
