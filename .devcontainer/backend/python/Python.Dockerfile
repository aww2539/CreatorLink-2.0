FROM python:3.13

WORKDIR /workspace

COPY . /workspace/

EXPOSE 8000

ENTRYPOINT [ "tail", "-f", "/dev/null" ]
