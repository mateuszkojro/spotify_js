//
// przeprowadzenie oauth2
//
class oauth2 {
  callback_uri = "https://mateuszkojro.github.io/portfolio/play.html";
  client_id = "280bd01d22924fb594c56c01bd47b077";
  client_secret = "3b365fc6cb2b4c14b64036a1bfc9b8a4";
  code = null;
  state = null;
  access_token = null;
  refresh_token = null;
  json = null;

  constructor() {}
  has_token() {
    if (this.access_token != null) {
      return true;
    }
    return false;
  }
  request_auth() {
    /*
    let url =
      "https://accounts.spotify.com/authorize?client_id=" +
      this.client_id +
      "&response_type=code&redirect_uri=" +
      this.callback_uri +
      "&scope=user-read-private%20user-read-email&state=34fFs29kd09";
    */
    let url =
      "https://accounts.spotify.com/authorize?" +
      new URLSearchParams({
        client_id: this.client_id,
        response_type: "code",
        redirect_uri: this.callback_uri,
        scope: "streaming user-read-email user-read-private",
      });
    async function close() {
      window.close();
    }
    window.open(url);
  }
  async request_tokens() {
    let url = "https://accounts.spotify.com/api/token";

    let text_data =
      "grant_type=authorization_code" +
      "&code=" +
      this.code +
      "&redirect_uri=" +
      this.callback_uri;
    text_data = encodeURI(text_data);
    let data = new URLSearchParams({
      code: this.code,
      grant_type: "authorization_code",
      redirect_uri: this.callback_uri,
      client_id: this.client_id,
      client_secret: this.client_secret,
    });
    let other_params = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: data,
      method: "POST",
    };

    await fetch(url, other_params)
      .then((data) => {
        return data.json();
      })
      .then((res) => {
        this.json = res;
        console.log("this.json: " + this.json);
        console.log("res: " + res);
      })
      .catch((error) => {
        console.log(error);
      });

    this.access_token = this.json.access_token;
    this.refresh_token = this.json.refresh_token;
  }
}

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
