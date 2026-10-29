# Multi-stage build for Spring Boot backend
FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /app

# Copy Maven wrapper and pom.xml first for layer caching
COPY pom.xml .
COPY .mvn/ .mvn/ 2>/dev/null || true
COPY mvnw 2>/dev/null || true

# Install Maven if wrapper is not present
RUN if ! [ -f mvnw ]; then \
      wget -q https://archive.apache.org/dist/maven/maven-3/3.9.6/binaries/apache-maven-3.9.6-bin.tar.gz && \
      tar xzf apache-maven-3.9.6-bin.tar.gz -C /opt && \
      ln -s /opt/apache-maven-3.9.6/bin/mvn /usr/local/bin/mvn; \
    fi

# Download dependencies (cached layer)
RUN mvn dependency:go-offline -B 2>/dev/null || true

# Copy source and build
COPY src/ ./src/
RUN mvn package -DskipTests -B -q

# Production runtime image
FROM eclipse-temurin:21-jre-alpine

RUN addgroup -S coderoyale && adduser -S coderoyale -G coderoyale

WORKDIR /app

COPY --from=builder /app/target/*.jar app.jar

RUN chown coderoyale:coderoyale app.jar

USER coderoyale

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "-Dspring.profiles.active=prod", "app.jar"]
