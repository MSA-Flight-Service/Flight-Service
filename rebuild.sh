#!/bin/bash

# 빌드할 서비스들 (너 폴더 기준으로)
SERVICES=("flight-service" "flight-reservation-server" "user-service" "flight-reservation-gateway" "reservation-service")

echo "🔁 전체 서비스 JAR 빌드 시작"

for service in "${SERVICES[@]}"; do
  echo "📦 $service 빌드 중..."
  cd $service || exit
  chmod +x ./gradlew
  ./gradlew clean bootJar -x test || { echo "❌ $service 빌드 실패"; exit 1; }
  cd ..
done

echo "✅ 모든 서비스 빌드 완료!"
echo ""
echo "🚀 Docker Compose 실행 중..."

docker-compose up --build -d