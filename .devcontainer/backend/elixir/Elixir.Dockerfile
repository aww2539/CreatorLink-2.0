FROM elixir:1.15

WORKDIR /workspace

COPY . /workspace/

EXPOSE 4000

ENTRYPOINT [ "tail", "-f", "/dev/null" ]
