FROM gradle:8.5-jdk21 AS build

WORKDIR /workspace

COPY . /workspace/

FROM eclipse-temurin:21-jdk

WORKDIR /workspace

COPY --from=build /workspace /workspace

RUN ./gradlew wrapper --gradle-version 8.5 --distribution-type all || true

RUN apt-get update && apt-get install -y curl unzip zip git && rm -rf /var/lib/apt/lists/*

EXPOSE 8080

ENTRYPOINT [ "tail", "-f", "/dev/null" ]
