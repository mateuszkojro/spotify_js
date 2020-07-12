var login = new Vue({
  el: "#login",
  data: {
    login_text: "Login to ur spotify account",
  },
});

function start_auth() {
  get_auth();
  login.login_text = "You r logged in, you can close this tab now";
  document.getElementById("img").innerHTML =
    '<img src="open.svg" alt="login" />';
}
