//
// przeprowadzenie oauth2
//
function request_auth() {
  let callback_uri = "http://localhost:5500/callback.html";
  let client_id = "280bd01d22924fb594c56c01bd47b077";
  let url =
    "https://accounts.spotify.com/authorize?client_id=" +
    client_id +
    "&response_type=code&redirect_uri=" +
    callback_uri +
    "&scope=user-read-private%20user-read-email&state=34fFs29kd09";
  window.open(encodeURI(url));
}
