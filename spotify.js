//TODO: rozbic to na wiecej plikow
//

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

// HACK: It should be done difrently but thats quick and dirty
let x = null;
let current_id = null;
let current_token = null;

//required by spotify web player sdk
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
  //HACK: fix it before
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
      'Ready <div onclick="take_control()" style="cursor: pointer; text-decoration: underline; color: blueviolet">take control</div>  of the player';
  });

  // Not Ready
  player.addListener("not_ready", ({ device_id }) => {
    app.title = "Device has gone offline";
  });

  //evry state change
  player.addListener("player_state_changed", (state) => {
    app.title = `U r ${Math.round(
      (state.position / state.duration) * 100
    )} % into ${state.track_window.current_track.name}`;
  });

  //evry 3 s refresh info about now playing
  setInterval(function () {
    player.getCurrentState().then((state) => {
      if (state) {
        app.title = `U r ${Math.round(
          (state.position / state.duration) * 100
        )} % into ${state.track_window.current_track.name}`;

        if (state.paused) {
          set_pause();
        } else {
          set_play();
        }
      } else {
      }
    });
  }, 3000); //evr 3 sekundy

  // Connect to the player!
  player.connect();
};

//i dont use it rn but seams usefull
async function get_currently_playing() {
  if (!x) {
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

// helper functon
async function is_playing() {
  if (!x) {
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

//transfer playback to currently created player
async function take_control() {
  if (!x) {
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

//functions used by control buttons
async function prev() {
  if (!x) {
    x.previousTrack().then(() => {
      console.log("Set to previous track!");
    });
  }
}
async function stop() {
  if (!x) {
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
async function next() {
  if (!x) {
    x.nextTrack().then(() => {
      console.log("Skipped to next track!");
    });
  }
}
