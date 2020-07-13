var login = new Vue({
  el: "#login",
  data: {
    login_text: "Login to ur spotify account",
  },
});

function start_auth() {
  get_auth();
  login.login_text = "Wait while we r redirecting u";
  document.getElementById("img").innerHTML =
    '<img src="open.svg" alt="login" />';
}
