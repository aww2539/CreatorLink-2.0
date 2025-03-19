defmodule CreatorLink.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      CreatorLinkWeb.Telemetry,
      CreatorLink.Repo,
      {DNSCluster, query: Application.get_env(:creator_link, :dns_cluster_query) || :ignore},
      {Phoenix.PubSub, name: CreatorLink.PubSub},
      # Start the Finch HTTP client for sending emails
      {Finch, name: CreatorLink.Finch},
      # Start a worker by calling: CreatorLink.Worker.start_link(arg)
      # {CreatorLink.Worker, arg},
      # Start to serve requests, typically the last entry
      CreatorLinkWeb.Endpoint
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: CreatorLink.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    CreatorLinkWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
