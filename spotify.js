var app = new Vue({
  el: "#app",
  data: {
    title: "Loading",
    previous: "Previous",
    pause: "Pause",
    next: "Next",
    stop: '<img src="start.svg" alt="Pause" />',
  },
});

async function set_play() {
  app.stop = '<img src="pause.svg" alt="Pause" />';
}
async function set_pause() {
  app.stop = '<img src="start.svg" alt="Play" />';
}

let x = null;
let current_id = null;
let current_token = null;

window.onSpotifyWebPlaybackSDKReady = async () => {
  //console.log("zaczekalem na token: " + (await get_auth()).access_token);
  const token = (await get_auth()).access_token;
  console.log("this is your token: " + token);
  current_token = token;
  var player = new Spotify.Player({
    name: "Spotify server player",
    getOAuthToken: (cb) => {
      cb(token);
    },
  });
  x = player;
  // Error handling
  player.addListener("initialization_error", ({ message }) => {
    app.title = message;
  });
  player.addListener("authentication_error", ({ message }) => {
    app.title = `${message} pls <a href="\\">log in</a> again`;
  });
  player.addListener("account_error", ({ message }) => {
    app.title = message;
  });
  player.addListener("playback_error", ({ message }) => {
    app.title = message;
  });

  // Ready
  player.addListener("ready", ({ device_id }) => {
    current_id = device_id;
    app.title =
      'Ready <div onclick="take_control()" style="cursor: pointer; text-decoration: underline; color: blueviolet">take controlr</div>  of the player';
  });

  // Not Ready
  player.addListener("not_ready", ({ device_id }) => {
    app.title = "Device has gone offline";
  });

  player.addListener(
    "player_state_changed",
    ({ position, duration, track_window: { current_track } }) => {
      app.title =
        "U r " +
        Math.round((position / duration) * 100) +
        "% into " +
        current_track.name;
      console.log("Currently Playing", current_track.name);
      console.log("Position in Song", position);
      console.log("Duration of Song", duration);
    }
  );
  // Connect to the player!
  setInterval(function () {
    player.getCurrentState().then((state) => {
      if (state) {
        app.title =
          "U r " +
          Math.round((state.position / state.duration) * 100) +
          "% into " +
          state.track_window.current_track.name;
        if (state.paused) {
          set_pause();
        } else {
          set_play();
        }
      } else {
      }
    });
  }, 3000); //evr 3 sekundy
  player.connect();
};
function refresh_data(player) {}

function prev() {
  if (x != null) {
    x.previousTrack().then(() => {
      console.log("Set to previous track!");
    });
  }
}
function stop() {
  if (x != null) {
    x.togglePlay().then(() => {
      if (is_playing()) {
        set_pause();
      } else {
        set_play();
      }
      console.log("Toggled playback!");
    });
  }
}
function next() {
  if (x != null) {
    x.nextTrack().then(() => {
      console.log("Skipped to next track!");
    });
  }
}

function take_control() {
  if (x != null) {
    let url = "https://api.spotify.com/v1/me/player";
    let data = {
      device_ids: [current_id],
      play: true,
    };
    console.log(current_id);
    let other_params = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${current_token}`,
      },
      body: `{ "device_ids" : ["${current_id}"], "play" : false}`,
      method: "PUT",
    };
    console.log(data);
    fetch(url, other_params)
      .then((data) => {
        return data.json();
      })
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

function get_currently_playing() {
  if (x != null) {
    let url = "https://api.spotify.com/v1/me/player/currently-playing";

    console.log(current_id);
    let other_params = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${current_token}`,
      },
      //body: data,
      method: "GET",
    };
    fetch(url, other_params)
      .then((data) => {
        return data.json();
      })
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

async function is_playing() {
  if (x != null) {
    let url = "https://api.spotify.com/v1/me/player/currently-playing";

    console.log(current_id);
    let other_params = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${current_token}`,
      },
      method: "GET",
    };
    let response = null;
    fetch(url, other_params)
      .then((data) => {
        return data.json();
      })
      .then((res) => {
        response = res;
      })
      .catch((error) => {
        console.log(error);
      });
  }
  return response;
}
