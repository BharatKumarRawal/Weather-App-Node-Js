// openweather api //extension JSON Formatter
//first npm init
// npm requests to req (imp)

const http = require("http");
const fs = require("fs");
var requests = require("requests");

const homeFile = fs.readFileSync("home.html", "utf-8"); // reading the file to write on//
// defination of replaceVal function where specific
// location where data is to be inserted is taken and replaced with data
const replaceVal = (tempVal, org) => {
  let temperature = tempVal.replace("{%tempval%}", org.main.temp);
  temperature = temperature.replace("{%tempmin%}", org.main.temp_min);
  temperature = temperature.replace("{%tempmax%}", org.main.temp_max);
  temperature = temperature.replace("{%location%}", org.name);
  temperature = temperature.replace("{%country%}", org.sys.country);
  temperature = temperature.replace("{%status%}", org.weather[0].main);
  return temperature;
};
const Server = http.createServer((req, res) => {
  if (req.url == "/") {
    // copied from npm doc for requests module
    requests(
      "https://api.openweathermap.org/data/2.5/weather?q=nepalgunj&appid=206ad57c8d5867c0ecb2647a11c63501"
    ) //api call
      .on("data", (chunk) => {
        const objData = JSON.parse(chunk); //parsing into object
        const arrData = [objData]; // making it array

        //taking data and mapping thorugh each item in array
        // and calling a function to dynamically write the value into the file
        const realTimeData = arrData.map((val) => replaceVal(homeFile, val));

        // write into the HTML File at last
        res.write(realTimeData.toString());
      })
      .on("end", (err) => {
        if (err) return console.log("connection closed due to errors", err);
        res.end();
      });
  }
});

Server.listen(8000, "127.0.0.1");
