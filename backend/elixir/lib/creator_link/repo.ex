defmodule CreatorLink.Repo do
  use Ecto.Repo,
    otp_app: :creator_link,
    adapter: Ecto.Adapters.Postgres
end
