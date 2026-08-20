process.stdin.setRawMode(true);
let user_selected = 0;
let songs = undefined;
const { spawn } = require("child_process");
const { readdirSync } = require("fs");
const { join } = require("path");
function listSongs(directoryPath) {
  // let answer = spawn('ls',[directoryPath])

  // answer.stdout.on('data',(data)=>{
  //     songs = data.toString().trim().split('\n')
  //     songs.forEach((ele,ind)=>{
  //         console.log(`${ind} : ${ele}`)
  //     })
  // })

  songs = readdirSync(directoryPath);
  songs.forEach((ele, ind) => {
    if (user_selected == ind) {
      console.log(`> ${ele}`);
    } else {
      console.log(` ${ele}`);
    }
  });
  console.log("\n\n");
}
listSongs("./songs");

function playSongs(songPath) {
  let player = spawn("afplay", [songPath]);
}

process.stdin.on("data", (data) => {
  if (data[0] == 0x03) {
    process.exit(0);
    return;
  }

  if (data[0] === 13) {
    console.log(join("songs", songs[user_selected]));
    playSongs(join("songs", songs[user_selected]));
  }

  if (data[0] == 0x1b && data[1] === 0x5b) {
    if (data[2] === 0x41) {
      user_selected = Math.max(user_selected - 1, 0);
    }
    if (data[2] === 0x42) {
      user_selected = Math.max(songs.length - 1, user_selected + 1);
    }
  }
  listSongs("./songs");
});