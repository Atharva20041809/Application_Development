#!/opt/homebrew/bin/node
//shebang

const { spawn } = require("child_process");
const { readdirSync } = require("fs");
const { join } = require("path");
let songs = undefined;
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
    console.log(`${ind} : ${ele}`);
  });
}

function playSongs(songPath) {
  let player = spawn("afplay", [songPath]);
}

listSongs(join(__dirname, "songs"));

let user_input = undefined;
process.stdin.on("data", (data) => {
  user_input = data.toString();
  console.log(`Your input is ${data}`);
  playSongs(join(__dirname, "songs", songs[Number(user_input)]));
});
