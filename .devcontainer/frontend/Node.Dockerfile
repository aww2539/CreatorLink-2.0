FROM node:20

WORKDIR /workspace

COPY . /workspace/

EXPOSE 3000

ENTRYPOINT [ "tail", "-f", "/dev/null" ]
