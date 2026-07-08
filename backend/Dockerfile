# ===================== STAGE 1: build =====================
# Compila o projeto com Maven + JDK 21. Usar uma imagem com Maven já
# instalado evita downloads repetidos do wrapper em cada build.
FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /app

# Copiar primeiro só o pom.xml e baixar as dependências — isso
# aproveita o cache de camadas do Docker: se só o código mudar (não
# as dependências), essa camada não precisa ser refeita.
COPY pom.xml .
RUN mvn -B dependency:go-offline

COPY src ./src
RUN mvn -B clean package -DskipTests

# ===================== STAGE 2: runtime =====================
# Imagem final é só o JRE (não o JDK completo) — bem mais leve, sem
# nenhuma ferramenta de build sobrando na imagem de produção.
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Usuário não-root por segurança — a aplicação não precisa de
# privilégios de root para rodar.
RUN addgroup -S studyleia && adduser -S studyleia -G studyleia

# wget é usado pelo HEALTHCHECK abaixo; instalado explicitamente porque
# nem toda variante do Alpine garante tê-lo por padrão.
RUN apk add --no-cache wget

COPY --from=build /app/target/*.jar app.jar

RUN chown studyleia:studyleia app.jar
USER studyleia

EXPOSE 8080

# Healthcheck simples via TCP — não depende do Actuator estar
# habilitado, então funciona mesmo sem essa dependência extra.
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
    CMD wget -q --spider http://localhost:8080/login || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]
