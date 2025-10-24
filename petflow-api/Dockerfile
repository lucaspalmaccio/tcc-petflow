# Estágio 1: Build (Construção)
# Usamos uma imagem Maven com OpenJDK 17 para compilar o projeto
FROM maven:3.8.5-openjdk-21 AS build

# Define o diretório de trabalho
WORKDIR /app

# Copia o pom.xml primeiro para aproveitar o cache de dependências do Docker
COPY pom.xml .
RUN mvn dependency:go-offline

# Copia o restante do código-fonte
COPY src ./src

# Compila o projeto e gera o arquivo .jar
# -DskipTests pula a execução dos testes durante o build do Docker
RUN mvn clean package -DskipTests

# Estágio 2: Run (Execução)
# Usamos uma imagem JRE (Java Runtime Environment) enxuta para rodar a aplicação
FROM eclipse-temurin:21-jre-focal

WORKDIR /app

# Copia o .jar gerado no estágio de build
COPY --from=build /app/target/petflow-api-0.0.1-SNAPSHOT.jar app.jar

# Expõe a porta 8080 (definida no application.properties)
EXPOSE 8080

# Comando para iniciar a aplicação
ENTRYPOINT ["java", "-jar", "app.jar"]
