# Use Amazon Corretto 17 as the base image for building the application
FROM amazoncorretto:17-alpine-jdk AS builder
WORKDIR /app

# Copy Gradle wrapper files
COPY gradlew .
COPY gradle gradle

# Make gradlew executable and build
COPY . .
RUN chmod +x ./gradlew && ./gradlew build -x test --no-daemon

# Use a lightweight runtime image to run the application
FROM amazoncorretto:17-alpine AS runtime
WORKDIR /app

# Copy the built JAR file from the builder stage
COPY --from=builder /app/build/libs/*.jar app.jar

# Expose port 8080 and set the entry point to run the application
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]