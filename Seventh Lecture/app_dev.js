const { readdirSync } = require("fs");
const { join } = require("path");
const { spawn } = require("child_process");
process.stdin.setRawMode(true);

let user_input = 0;
let songs = undefined;
let player = undefined;
let song_is_playing = false;
let duration = undefined;
let timeElapsed = undefined;
let progress = undefined;

async function getSongDuration(directoryPath) {
  return new Promise((res, rej) => {
    let get_duration = spawn("afinfo", [directoryPath]);
    get_duration.stdout.on("data", (data) => {
      res(
        Number(data.toString().split("estimated duration: ")[1].split(".")[0]),
      );
    });
  });
}

function progressBarLoader(duration) {
  timeElapsed = 0;
  progress = setInterval(() => {
    if (song_is_playing && player) {
      timeElapsed += 0.1;
    }
    listSongs(join("songs"));
  }, 100);
}

function listSongs(directoryPath) {
  songs = readdirSync(directoryPath);
  process.stdout.write("\x1B[3;1H");

  let menuText = songs
    .map((ele, ind) => {
      if (user_input == ind) {
        return `> ${ele}`;
      } else {
        return `${ele}`;
      }
    })
    .join("\n");
  process.stdout.write(menuText);
  let percentage = Math.round((timeElapsed / duration) * 100);
  if (player) {
    process.stdout.write(
      `\n${Math.floor(timeElapsed / 60)}:${Math.floor(timeElapsed % 60)
        .toString()
        .padStart(2, "0")} | ${Math.floor(duration / 60)}:${Math.floor(
        duration % 60,
      )
        .toString()
        .padStart(2, "0")}`,
    );
    let bar =
      "\n" +
      "-".repeat(Math.max(percentage - 1, 0)) +
      "o" +
      "-".repeat(100 - percentage);
    process.stdout.write(bar);
  }
}

async function playSongs(directoryPath) {
  player = spawn("vlc", ["--intf", "rc", directoryPath], { stdio: "pipe" });
  duration = await getSongDuration(directoryPath);
  progressBarLoader(duration);
  //   console.log(`\n${duration}`);
  // console.log(player)
}

process.stdout.write("\x1B[2J");
listSongs(join("songs"));

process.stdin.on("data", (data) => {
  //   console.log(data);
  if (data[0] == 0x0d) {
    if (!song_is_playing) {
      playSongs(join("songs", songs[user_input]));
      song_is_playing = true;
    } else {
      player.stdin.write("quit\n");
      clearInterval(progress);
      process.exit(0);
      song_is_playing = false;
    }
    return;
  }
  if (data[0] == 3) {
    process.exit(0);
    return;
  }
  if (data[0] == 0x20) {
    // player.kill('SIGSTOP')
    // player.kill('SIGKILL')
    // player.('SIGTERM')
    // player('SIGINT')
    if (song_is_playing) {
      player.stdin.write("pause\n");
      song_is_playing = false;
    } else {
      player.stdin.write("pause\n");
      song_is_playing = true;
    }
  }
  if (data[0] == "0x6E") {
    player.stdin.write("pause\n");
    clearInterval(progress);
    user_input = Math.min(songs.length - 1, user_input + 1);
    listSongs(join("songs"));
    playSongs(join("songs", songs[user_input]));
  }
  if (data[0] == "0x64") {
    player.stdin.write("pause\n");
    clearInterval(progress);
    user_input = Math.max(0, user_input - 1);
    listSongs(join("songs"));
    playSongs(join("songs", songs[user_input]));
  }
  if (data[0] == 0x1b && data[1] == 0x5b) {
    if (data[2] == 0x41) {
      user_input = Math.max(0, user_input - 1);
      listSongs(join("songs"));
    }
    if (data[2] == 0x42) {
      user_input = Math.min(songs.length - 1, user_input + 1);
      listSongs(join("songs"));
    }
  }
  //   listSongs(join("songs"));
});

//afinfo

// \r\x1B[0k

// \n\x1B[0k


//gogcli
//commanderJs
//google/SDK
// process.argv (vlc,'--intf','rc')
// Readme.md update (architecture Diagram, AI Chat History, Answer Questionnaire)

