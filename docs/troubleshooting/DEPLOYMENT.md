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
# .github/workflows/deploy.yml 예시