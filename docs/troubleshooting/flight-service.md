# 🧩 트러블슈팅: Elasticsearch + Redis 검색 성능 최적화

## ✅ 문제 1: RDBMS 기반 검색의 한계 (Full Scan)

기존 시스템은 항공편 정보를 RDBMS에서 조회할 때 `LIKE`, `CONTAINS` 등 문자열 조건 쿼리를 사용했습니다. 하지만 다음과 같은 문제를 야기했습니다:

* 인덱스를 타지 못하고 Full Scan 발생 → 검색 속도 저하
* 초성/유사어/오타 등 비정형 검색 불가
* 쿼리 복잡도 증가 → 유지보수성 저하
* 사용자 경험 하락 (느린 응답, "검색 결과 없음")

### 🔍 트러블슈팅 요약: RDBMS Full Scan

| 항목    | 내용                                        |
| ----- | ----------------------------------------- |
| 문제 상황 | 항공편 데이터를 LIKE 쿼리로 조회 시 Full Scan 발생       |
| 원인 분석 | `%xxx%` 패턴은 인덱스 사용 불가                     |
| 해결 방법 | Elasticsearch 전환 → match 기반 검색, 역색인 구조 활용 |
| 개선 결과 | 수 초 단위 → **밀리초 단위 응답**, UX 대폭 개선          |

---

## ✅ 해결 1: Elasticsearch 전환 + 형태소 분석기 적용

### 📌 도입 배경

* Apache Lucene 기반의 분산 검색 엔진
* JSON 문서 기반 저장, 역색인 구조로 고속 검색
* `nori` 분석기 활용 → 한글 형태소 분해 가능

### 🔎 기존 SQL vs Elasticsearch DSL 쿼리 비교

**기존 SQL (RDBMS)**

```sql
SELECT * FROM flight
WHERE departure_airport LIKE '%인천%'
  AND arrival_airport LIKE '%프라하%';
```

**Elasticsearch DSL**

```json
{
  "query": {
    "bool": {
      "must": [
        { "match": { "departure_airport": "인천" }},
        { "match": { "arrival_airport": "프라하" }}
      ]
    }
  }
}
```

### 🚀 개선 효과 요약

| 항목     | 개선 전             | 개선 후                |
| ------ | ---------------- | ------------------- |
| 검색 속도  | 수 초 (Full Scan)  | **밀리초(ms) 응답**      |
| 검색 유연성 | 일치 단어만 검색 가능     | **초성/유사어/오타 대응** 가능 |
| 성능 부하  | 복잡 쿼리 시 DB 부하 증가 | **분산 검색 + 인덱스 활용**  |
| 유지보수   | 복잡한 SQL 조합       | 직관적인 DSL 쿼리 구조      |

---

## ✅ 문제 2: Elasticsearch 반복 탐색으로 인한 부하 증가

Elasticsearch 도입 후, 성능은 향상되었으나 동일 키워드로 반복 검색되는 상황에서 **불필요한 인덱스 재탐색**이 발생했습니다.

### 🔍 트러블슈팅 요약: 반복 쿼리 부하

| 항목    | 내용                            |
| ----- | ----------------------------- |
| 문제 상황 | 동일 키워드 반복 검색 → ES 부하 집중       |
| 원인 분석 | 모든 요청이 Elasticsearch 직접 탐색    |
| 해결 방법 | Redis 도입 → TTL 5분 기준 캐싱 전략 적용 |
| 개선 결과 | **응답 속도 90% 이상 개선**, ES 부하 감소 |

---

## ✅ 해결 2: Redis 캐시 전략 도입

### 📌 Redis 도입 구조

* **Key**: 검색 조건 조합 → `search:flight:인천:프라하`
* **Value**: Elasticsearch 반환 JSON 결과
* **TTL**: 5분 → 일정 시간 이후 자동 만료로 최신성 유지

### 🔁 동작 흐름 요약

1. 클라이언트 검색 요청
2. Redis에 해당 키 존재 여부 확인
3. 있다면 → **Redis에서 즉시 응답**
4. 없다면 → Elasticsearch 검색 후 Redis 저장

### 🚀 개선 효과 요약

| 항목        | 적용 전         | 적용 후                  |
| --------- | ------------ | --------------------- |
| 인기 검색어 응답 | 수십\~수백 ms    | **1\~5ms 수준**         |
| ES 부하     | 요청 수만큼 증가    | **Redis 분산 캐싱으로 안정화** |
| 반복 검색 처리  | 항상 재탐색       | **최초 1회 후 캐시 응답**     |
| 시스템 안정성   | 트래픽 급증 시 불안정 | 고정 응답 속도 유지           |

---

## 💡 추가 개선 아이디어

* 검색어 빈도 기반으로 Redis TTL 동적 조절 (ex. 인기 지역은 30분 유지)
* 검색 히스토리 캐싱 → **개인화 추천 기능에 활용 가능**
* 캐시 적중률 로그 분석 → 불필요한 ES 호출 최적화
