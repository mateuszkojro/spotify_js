//
// przeprowadzenie oauth2
//
class oauth2 {
  callback_uri = "http://localhost:5500/play.html";
  client_id = "280bd01d22924fb594c56c01bd47b077";
  client_secret = "3b365fc6cb2b4c14b64036a1bfc9b8a4";
  code = null;
  state = null;
  access_token = null;
  refresh_token = null;
  json = null;

  constructor() {}

  request_auth() {
    let url =
      "https://accounts.spotify.com/authorize?" +
      new URLSearchParams({
        client_id: this.client_id,
        response_type: "code",
        redirect_uri: this.callback_uri,
        scope:
          "streaming user-read-email user-read-private user-modify-playback-state user-read-playback-state ",
      });

    window.location.assign(url);
  }

  async request_tokens() {
    //url to make request to
    let url = "https://accounts.spotify.com/api/token";

    //setup POST request data and encode it as x-www-form-urlencoded
    let data = new URLSearchParams({
      code: this.code,
      grant_type: "authorization_code",
      redirect_uri: this.callback_uri,
      client_id: this.client_id,
      client_secret: this.client_secret,
    });
    //prepare headers for the request
    let other_params = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: data,
      method: "POST",
    };

    // send a POST request -> in the response you get a token and refresh token
    await fetch(url, other_params)
      .then((data) => {
        return data.json();
      })
      .then((res) => {
        //HACK: da sie lepiej niz tak zrobic pozniej
        //save response JSON
        this.json = res;
      })
      .catch((error) => {
        console.log(error);
      });

    this.access_token = this.json.access_token;
    this.refresh_token = this.json.refresh_token;
  }

  has_token() {
    if (this.access_token != null) {
      return true;
    }
    return false;
  }
}
//
// Using custom oauth class to get a token
//
// TODO: should implement token refresh
//
async function get_auth() {
  let searchParams = new URLSearchParams(window.location.search);
  let auth = new oauth2();
  if (!searchParams.has("code")) {
    auth.request_auth();
  }
  if (searchParams.has("code")) {
    auth.code = searchParams.get("code");
    auth.state = searchParams.get("state");
    await auth.request_tokens();
  }
  return auth;
}
