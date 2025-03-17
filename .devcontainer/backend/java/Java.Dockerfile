FROM gradle:8.13-jdk21 AS build

WORKDIR /workspace

COPY . /workspace/

FROM amazoncorretto:21

WORKDIR /workspace

COPY --from=build /workspace /workspace

EXPOSE 8080

ENTRYPOINT [ "tail", "-f", "/dev/null" ]
