plugins {
    java
    id("org.springframework.boot") version "3.5.6"
    id("io.spring.dependency-management") version "1.1.7"
}
apply("gradle/swagger.gradle.kts")

group = "com.example.ubo"
version = "0.0.1-SNAPSHOT"
description = "Auth API"

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(17)
    }
}

repositories {
    mavenCentral()
}

extra["springCloudVersion"] = "2023.0.3"
dependencyManagement {
    imports {
        mavenBom("org.springframework.cloud:spring-cloud-dependencies:${property("springCloudVersion")}")
    }
}

dependencies {
    // Spring Cloud OpenFeign
    implementation("org.springframework.cloud:spring-cloud-starter-openfeign")
    implementation("io.github.openfeign:feign-jackson")
    implementation("io.github.openfeign:feign-okhttp")
    implementation("com.squareup.okhttp3:okhttp:4.12.0")
    testImplementation("io.github.openfeign:feign-mock")
    
    // Spring Boot
    implementation("org.springframework.boot:spring-boot-starter")
    implementation("org.springframework.boot:spring-boot-starter-jersey")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    
    // Database
    implementation("org.mariadb.jdbc:mariadb-java-client:3.3.2")
    
    // Jackson
    implementation("com.fasterxml.jackson.core:jackson-annotations:2.20")
    implementation("com.fasterxml.jackson.core:jackson-databind:2.20.0")
    implementation("com.fasterxml.jackson.core:jackson-core")

    //JWT (JOUT)
    implementation("io.jsonwebtoken:jjwt-api:0.13.0")
    runtimeOnly("io.jsonwebtoken:jjwt-impl:0.13.0")
    runtimeOnly("io.jsonwebtoken:jjwt-jackson:0.13.0")
    
    // Testing
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")

    // Actuator
	implementation("org.springframework.boot:spring-boot-starter-actuator")
}

tasks.withType<Test> {
    useJUnitPlatform()
}