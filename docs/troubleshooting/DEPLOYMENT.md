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
name: Build and Push MSA Backend Images

on:
  push:
    branches:
      - main

jobs:
  build-and-push:
    runs-on: ubuntu-latest

    strategy:  #git actions에 등록할 서비스 이름들
      matrix:
        service: [
          flight-service,
          flight-reservation-server,
          user-service,
          flight-reservation-gateway,
          reservation-service,
          flight-reservation-front-main
        ]

    steps:
      - name: Checkout source 
        uses: actions/checkout@v3

      - name: Set up JDK 17 #버전 설정
        uses: actions/setup-java@v3
        with:
          java-version: '17'
          distribution: 'temurin'

      - name: Set permission for Gradle wrapper #Wrapper 파일 생성관련
        if: ${{ !contains(matrix.service, 'front')}}
        run: chmod +x ${{ matrix.service }}/gradlew

      - name: Build JAR for ${{ matrix.service }} # Jar 파일 배포 관련
        if: ${{ !contains(matrix.service, 'front')}}
        run: |
          cd ${{ matrix.service }}
          ./gradlew clean bootJar -x test
          cd ..

      - name: Log in to DockerHub # DockerHub 관련설정파일
        run: echo "${{ secrets.DOCKER_PASSWORD }}" | docker login -u "${{ secrets.DOCKER_USERNAME }}" --password-stdin



      - name: Build and Push Docker Image for ${{ matrix.service }}
        run: |
          docker build -t ${{ secrets.DOCKER_USERNAME }}/${{ matrix.service }}:latest ./${{ matrix.service }}
          docker push ${{ secrets.DOCKER_USERNAME }}/${{ matrix.service }}:latest
```
