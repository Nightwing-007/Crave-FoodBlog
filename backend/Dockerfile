# Use an official Maven image with Java 17 to build and run the app
FROM maven:3.9-eclipse-temurin-17
WORKDIR /app

# Copy your backend code into the container
COPY . .

# Build the Spring Boot application
RUN mvn clean package -DskipTests

# Run the generated .jar file using a wildcard
CMD ["sh", "-c", "java -jar target/*.jar"]