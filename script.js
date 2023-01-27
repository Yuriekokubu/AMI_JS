const fs = require('fs');

const string1 = fs.readFileSync('./new.txt', { encoding: "utf8" });
const string2 = fs.readFileSync('./old.txt', { encoding: "utf8" });
const diff = (diffMe, diffBy) => diffMe.split(diffBy).join("");
const finalString = diff(string2, string1);
fs.writeFile("./compare/result.txt", finalString, function (err) {
    if (err) return console.log(err);
    console.log("written")
})

