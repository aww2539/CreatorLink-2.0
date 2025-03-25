defmodule CreatorLinkWeb.Plugs.VerifyToken do
  import Plug.Conn
  alias JOSE.JWT

  @cognito_jwks_url System.get_env("COGNITO_TOKEN_SIGNING_URL") || raise "Environment variable COGNITO_TOKEN_SIGNING_URL is not set"

  def init(default), do: default

  def call(conn, _opts) do
    with ["Bearer " <> token] <- get_req_header(conn, "authorization"),
         {:ok, %JWT{fields: claims}} <- verify_token(token) do
      assign(conn, :claims, claims)
    else
      _ ->
        conn
        |> send_resp(401, "Unauthorized")
        |> halt()
    end
  end

  defp verify_token(token) do
    {:ok, %{"keys" => keys}} = HTTPoison.get!(@cognito_jwks_url) |> Jason.decode()
    jwk = Enum.find(keys, fn key -> key["kid"] == get_kid(token) end)

    case JOSE.JWT.verify_strict(jwk, ["RS256"], token) do
      {true, jwt, _} -> {:ok, jwt}
      _ -> {:error, :invalid_token}
    end
  end

  defp get_kid(token) do
    [header | _] = String.split(token, ".")
    header |> Base.decode64!(padding: false) |> Jason.decode!() |> Map.get("kid")
  end
end
