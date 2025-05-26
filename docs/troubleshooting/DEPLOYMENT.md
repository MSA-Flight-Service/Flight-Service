# 🚀 배포 문서 (Deployment Guide)

## 1. 배포 인프라 개요

- AWS EC2 Ubuntu 20.04
- Docker Compose 기반 멀티 컨테이너 구성
- Nginx Reverse Proxy
- 도메인: goodnight123.site (가비아)
- CI/CD: GitHub Actions + SSH 배포

## 2. 도메인 연결

- 가비아에서 A 레코드 → EC2 IP (`13.239.x.x`)
- CNAME: www → 루트 도메인

## 3. Nginx 설정

- `./nginx/default.conf` 내용
- Proxy 대상: `http://gateway:8443`

## 4. Docker Compose 구조

- gateway
- user-service / flight-service / reservation-service
- front
- nginx

## 5. GitHub Actions 배포 흐름

```yaml

name: Build and Push MSA Images

on:
  push:
    branches:
      - main

jobs:
  build-and-push:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        service: [
          flight-service,
          flight-reservation-server,
          user-service,
          flight-reservation-gateway,
          reservation-service,
          flight-reservation-front-main  # ✅ 프론트 추가
        ]

    steps:
      - name: Checkout source
        uses: actions/checkout@v3

      - name: Set up JDK 17 (only for backend)
        if: ${{ matrix.service != 'flight-reservation-front-main' }}
        uses: actions/setup-java@v3.13.0
        with:
          java-version: '17'
          distribution: 'temurin'

      - name: Set permission for Gradle wrapper (only for backend)
        if: ${{ matrix.service != 'flight-reservation-front-main' }}
        run: chmod +x ${{ matrix.service }}/gradlew

      - name: Build JAR for ${{ matrix.service }} (only for backend)
        if: ${{ matrix.service != 'flight-reservation-front-main' }}
        run: |
          cd ${{ matrix.service }}
          ./gradlew clean bootJar -x test
          cd ..

      - name: Install Node.js (only for frontend)
        if: ${{ matrix.service == 'flight-reservation-front-main' }}
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      # 🔹 1. 프론트 빌드 전에 .env 생성 (Vite용)
      - name: Create .env for frontend before build
        if: ${{ matrix.service == 'flight-reservation-front-main' }}
        run: echo "${{ secrets.ENV_FILE }}" > ${{ matrix.service }}/.env

      - name: Build React frontend (only for frontend)
        if: ${{ matrix.service == 'flight-reservation-front-main' }}
        run: |
          cd ${{ matrix.service }}
          npm install
          npm run build
          cd ..

      - name: Log in to DockerHub
        run: echo "${{ secrets.DOCKER_PASSWORD }}" | docker login -u "${{ secrets.DOCKER_USERNAME }}" --password-stdin

      - name: Build and Push Docker Image for ${{ matrix.service }}
        run: |
          docker build -t ${{ secrets.DOCKER_USERNAME }}/${{ matrix.service }}:latest ./${{ matrix.service }}
          docker push ${{ secrets.DOCKER_USERNAME }}/${{ matrix.service }}:latest

  deploy-to-ec2:
    needs: build-and-push
    runs-on: ubuntu-latest

    steps:
      - name: Checkout source
        uses: actions/checkout@v3

      # 1. 디렉토리 .env 파일 생성
      - name: Prepare ~/msa-deploy and create .env
        uses: appleboy/ssh-action@334f9259f2f8eb3376d33fa4c684fff373f2c2a6
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ${{ secrets.EC2_USER }}
          key: ${{ secrets.EC2_KEY }}
          script: |
            echo "📁 Step 1: Ensure directory exists"
            mkdir -p ~/msa-deploy

            echo "📄 Step 2: Create .env inside it"
            echo "${{ secrets.ENV_FILE }}" > ~/msa-deploy/.env

      # 2. docker-compose.yml 복사
      - name: Copy docker-compose.yml to EC2
        uses: appleboy/scp-action@master
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ${{ secrets.EC2_USER }}
          key: ${{ secrets.EC2_KEY }}
          source: "docker-compose.yml"
          target: "~/msa-deploy"

      - name: Deploy to EC2 via SSH
        uses: appleboy/ssh-action@334f9259f2f8eb3376d33fa4c684fff373f2c2a6
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ${{ secrets.EC2_USER }}
          key: ${{ secrets.EC2_KEY }}
          timeout: 1200s
          command_timeout: 1200s
          script: |
            echo "🟢 Step 1: Starting Docker"
            sudo systemctl start docker

            echo "🟢 Step 2: Moving to msa-deploy"
            cd ~/msa-deploy

            echo "🟢 Step 3: Docker Compose Pull"
            sudo docker-compose pull

            echo "🟢 Step 4: Docker Compose Up"
            sudo docker-compose up -d

            echo "✅ Step 5: Containers are up and running"

```
