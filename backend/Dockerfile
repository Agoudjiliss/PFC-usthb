FROM maven:3.9-eclipse-temurin-17 AS build

WORKDIR /app

# Copier les fichiers de configuration Maven
COPY pom.xml .

# Télécharger les dépendances
RUN mvn dependency:go-offline

# Copier le code source
COPY src ./src

# Compiler l'application
RUN mvn package -DskipTests

# Image de production
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copier le JAR depuis l'étape de build
COPY --from=build /app/target/*.jar app.jar

# Exposer le port
EXPOSE 8080

# Commande de démarrage
ENTRYPOINT ["java", "-jar", "app.jar"] 