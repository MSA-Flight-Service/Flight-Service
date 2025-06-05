## ✈️ **MSA 기반 항공편 예약 시스템**

> **Spring Boot 기반 MSA 구조에서 항공편 검색, 예약, 실시간 이벤트 처리까지 구현한 실전형 백엔드 시스템입니다.**  
> Elasticsearch 기반 고속 검색, Redis 캐싱, Kafka 비동기 메시징, Docker + CI/CD 배포까지 포함합니다.

---

## Screenshots
아래는 실제 가동화면 메인페이지의 예시 스크린샷입니다.
![Main Page Screenshot](./images/mainpage.png)

## 🛠 기술 스택 요약

### ✅Backend 

![Java](https://img.shields.io/badge/Java-17+-orange?logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-green?logo=springboot)
![Gradle](https://img.shields.io/badge/Gradle-8.x-02303A?logo=gradle)
![JWT](https://img.shields.io/badge/JWT-Auth-blueviolet?logo=jsonwebtokens)
### ✅FrontEnd
![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-Bundler-646CFF?logo=vite)


### ✅DataBase
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-DB-4169E1?logo=postgresql)
### ✅DevOps
![Docker](https://img.shields.io/badge/Docker-Container-2496ED?logo=docker)
![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-CI%2FCD-2088FF?logo=githubactions)

### ✅Infra
![Kafka](https://img.shields.io/badge/Kafka-Event%20Streaming-black?logo=apachekafka)
![Redis](https://img.shields.io/badge/Redis-Cache-red?logo=redis)
![Elasticsearch](https://img.shields.io/badge/Elasticsearch-Search-blue?logo=elasticsearch)
---

## 📚 목차

- [개요](#개요)
- [아키텍처 개요](#아키텍처-개요)
- [주요 기능](#주요-기능)
- [기술 스택](#기술-스택)
- [시스템 아키텍처](#시스템-아키텍처)
- [API 문서화](#api-문서화-swagger)
- [스크린샷](#screenshots)
- [설치 및 실행 방법](#설치-및-실행-방법)
- [사용 방법](#사용-방법)
- [Roadmap](#roadmap--future-plans)
- [기여 방법](#기여-방법)
## 기능 시연 예시 

### 항공편 검색 및 예약 흐름
![flight-reservation-demo](./images/Test.mp4)

## 아키텍처 개요
프로젝트는 아래와 같은 주요 컴포넌트로 구성됩니다:

- **Eureka (서비스 레지스트리)**
  - 포트: **8761**
  - 모든 마이크로서비스는 Eureka에 등록되어 서로의 위치를 자동으로 검색합니다.
  
- **Gateway (API 게이트웨이)**
  - 포트: **8443**
  - 클라이언트의 요청을 해당 서비스로 라우팅하며, 인증, 로깅 등 부가 기능을 처리합니다.
  
- **유저 서비스**
  - 포트: **8081**
  - 회원가입, 로그인, 프로필 관리 등 유저 관련 기능을 담당합니다.
  
- **항공 서비스**
  - 포트: **8082**
  - 항공편 정보 관리, 항공편 검색 및 상세 정보 제공 기능을 제공합니다.
  
- **예매 서비스**
  - 포트: **8083**
  - 항공편 예약 및 결제 처리, 예약 내역 관리 기능을 제공합니다.

## 주요 기능
- **항공편 검색**: 사용자가 입력한 출발지, 도착지, 날짜 정보를 기반으로 항공편 목록을 조회할 수 있습니다.
- **예약 처리**: 선택한 항공편에 대한 예약 및 결제 과정을 진행합니다.
- **예약 관리**: 예약 내역 조회, 수정, 취소 기능을 제공합니다.
- **유저 관리**: 회원가입, 로그인, 비밀번호 복구, 프로필 관리 등 사용자 관련 작업을 수행합니다.
- **위치 기반 서비스**: **카카오맵 오픈 API**를 활용하여 항공편 출발지 및 도착지 주변 위치를 시각화합니다.
- **날씨 정보 제공**: **날씨 오픈 API**를 통해 항공편 운항 및 예약에 참고할 수 있는 실시간 날씨 정보를 제공합니다.
- **RESTful API**: 각 서비스는 독립적인 REST API 엔드포인트를 제공하며, Gateway를 통해 통합된 API 사용이 가능합니다.

---

## 기능 상세 설명
- **백엔드**:
  - **언어/프레임워크**: Java 17 이상, Spring Boot  
  - **빌드 도구**: Gradle  
  - **보조 기술**:
    - **Redis**: 세션 관리 및 캐시 처리  
    - **JWT**: 사용자 인증 및 토큰 기반 보안 처리  
    - **Elasticsearch**: 항공편 검색의 고속화 및 색인 최적화  
    - **Kafka**: 비동기 메시징 및 이벤트 스트리밍  
- **마이크로서비스 인프라**:
  - **Eureka**: 서비스 디스커버리 (포트 8761)  
  - **Gateway**: API 라우팅 및 부가 기능 (포트 8443)  
  - **유저 서비스**: (포트 8081)  
  - **항공 서비스**: (포트 8082)  
  - **예매 서비스**: (포트 8083)  
- **외부 API 통합**:
  - **카카오맵 오픈 API**: 지도 기반 위치 서비스 제공  
  - **날씨 오픈 API**: 실시간 날씨 정보 제공  
- **프론트엔드**: React + Vite  
  - **폴더명**: `flight-reservation-front-main`  
  - **개발 서버 포트**: 5173  
- **데이터베이스**: MySQL 또는 PostgreSQL

---

## 시스템 아키텍처
> 아래는 본 프로젝트의 전체 시스템 및 흐름 아키텍처 구성도입니다.

![Architecture Diagram](./images/BackEnd.png)
  
## API 문서화 (Swagger)
각 마이크로서비스의 API는 Swagger를 통해 문서화되어 있습니다.  
개발 및 테스트 과정에서 Swagger UI를 사용하여 API 명세를 확인하고, 인터랙티브하게 테스트할 수 있습니다.  
예를 들어, Gateway 서비스의 Swagger 문서는 다음 URL에서 확인할 수 있습니다:  
[https://localhost:8443/swagger-ui.html](https://localhost:8443/swagger-ui.html)  
각 서비스마다 별도의 Swagger 문서 페이지가 제공될 수 있으니, 필요 시 해당 URL을 참고하세요.

---

## 프로젝트 팀 및 담당 분야

- **박순일**: 유저 서비스 담당 및 통합 담당
- **이용수**: 항공 서비스 담당 및 카카오맵 API 연동 담당
- **최민석**: 예매 서비스 담당, 결제 서비스 및 Kafka 통신 설계
- **박세호**: 프론트 엔드 총괄 및 디자인 담당, 날씨 API 연동 담당

---

## 설치 및 실행 방법

### 전제 조건
- **Java 17 이상** 설치  
- **Gradle** (프로젝트 내 `gradlew` 스크립트 포함)  
- **Node.js 및 npm** (프론트엔드 실행용)  
- **데이터베이스 서버** (MySQL, PostgreSQL 등) 구동  

### 설치 단계

1. **레포지토리 클론**
   ```bash
   git clone https://github.com/Parksoonil/flight-reservation.git
   cd flight-reservation

# Flight Reservation 프로젝트

이 프로젝트는 백엔드(마이크로서비스)와 프론트엔드(React + Vite)로 구성되어 있으며, 각 마이크로서비스는 독립된 Gradle 모듈 또는 애플리케이션으로 구성되어 있습니다.


## 백엔드 (MSA) 및 프런트엔드(React) 통합 서비스 실행

### Docker Compose 기반 전체 서비스 실행

```bash 
 ./rebuild.sh
```
- 위 스크립트는 모든 백엔드 서비스(Eureka, Gateway, 각 서비스) 및 프론트엔드를 Docker로 빌드 및 실행합니다.
- docker-compose.yml을 기준으로 실행되며, 내부적으로 docker-compose up -d --build 명령이 수행됩니다.

각 서비스 실행 후, [Eureka 대시보드](http://localhost:8761)에 접속하여 등록된 서비스 목록을 확인할 수 있습니다.

---


## 사용 방법

- **웹 인터페이스**: 브라우저에서 Gateway 주소([https://localhost:8443](https://localhost:8443))를 통해 각 서비스 기능에 접근합니다.
- **API 사용**: 각 마이크로서비스는 독립적인 RESTful API를 제공하며, Swagger 또는 Postman을 통해 개별 API 엔드포인트를 테스트할 수 있습니다.
- **서비스 디스커버리**: Eureka 대시보드를 통해 현재 등록된 서비스 목록 및 상태를 확인할 수 있습니다.

---
## 🔧 주요 트러블슈팅 사례 요약

| 구분 | 문제 | 해결 방법 | 결과 |
|------|------|------------|------|
| 🔁 검색 속도 저하 | RDBMS LIKE 검색 Full Scan 발생 | Elasticsearch 도입 + nori analyzer 적용 | 평균 응답 2.8초 → 0.3초 |
| 🔄 반복 쿼리 부하 | 인기 검색어 반복 요청 → ES 부하 집중 | Redis 캐싱 도입 + TTL 5분 적용 | 캐시 적중률 82%, ES 부하 70% 감소 |
| 🧾 예약 동시성 충돌 | 좌석 중복 예약 문제 | Optimistic Lock + Redis 분산 Lock 적용 | 중복률 0%, 데이터 정합성 확보 |

📄 상세한 트러블슈팅 내용은 [여기서 확인](./docs/troubleshooting/flight-service.md)할 수 있습니다.

---

## 📈 프로젝트 결과 및 성과

> 💡 **총 3개의 마이크로서비스 + 비동기 이벤트 기반 구조에서 실제 성능을 측정한 결과입니다.**

- ✅ **Kafka 기반 비동기 통신 도입 → 예약 처리 속도 약 1.7배 향상**
- ✅ **Elasticsearch 적용 → 1,000건 이상의 항공편 검색 평균 응답 3초 이내**
- ✅ **CI/CD 자동화 → GitHub Actions + Docker 기반 자동 배포 파이프라인 구축 완료**

## Roadmap & Future Plans

### 현재 진행 사항
- **서비스 안정화**: 각 마이크로서비스(유저, 항공, 예매 서비스)의 기본 기능 구현 완료 및 통합 테스트 진행 중.
- **API 문서화**: Swagger를 활용한 API 문서화 작업 완료 및 주기적인 업데이트.
- **인프라 구축**: Eureka, Gateway, Redis, Elasticsearch, Kafka 등 주요 인프라 구성 완료.
---
## 📈 프로젝트 결과 및 성과
(3개의 마이크로서비스 동시 실행 기준 , 1000건 + 검색 쿼리)

- ✅ Kafka 기반 비동기 통신 도입 → 예약 처리 속도 **약 1.7배 향상**
- ✅ Elasticsearch 적용 → **1000건 이상의 항공편 검색을 평균 3초 이내 응답**
- ✅ CI/CD 구축 완료 → GitHub Actions + Docker 기반의 **자동 배포 파이프라인 구성 완료**

### 향후 추가할 기능
- **자동화 배포**: CI/CD 파이프라인 구축 및 Docker 기반 컨테이너 배포 도입.
- **실시간 모니터링**: Prometheus, Grafana 등 모니터링 도구를 활용한 시스템 상태 실시간 확인.
- **추천 시스템**: 사용자 선호도 분석을 통한 항공편 추천 기능 추가.
- **다국어 지원**: 글로벌 사용자 확대를 위한 다국어 인터페이스 지원.

### 개선할 부분
- **성능 최적화**: Elasticsearch와 Kafka를 활용한 데이터 처리 및 메시징 성능 개선.
- **보안 강화**: JWT 외 추가 인증/인가 방식을 도입하여 보안 체계 강화.
- **UI/UX 개선**: 프론트엔드 사용자 경험 개선 및 디자인 피드백 반영.

---

## 🚀 배포 관련 문서

해당 프로젝트의 배포 인프라, 도메인 설정, CI/CD 자동화 관련 내용은 아래 문서를 참고해주세요.

📄 [배포 문서 보기](./docs/troubleshooting/DEPLOYMENT.md)

## 기여 방법

1. 레포지토리를 fork합니다.
2. 새로운 브랜치를 생성합니다.
   ```bash
   git checkout -b feature/새로운기능
   ```
3. 변경 사항을 commit합니다.
4. 변경 사항을 push한 후, pull request를 생성합니다.
5. 문제 제보나 기능 요청은 Issue를 등록해 주시면 감사하겠습니다.

---

