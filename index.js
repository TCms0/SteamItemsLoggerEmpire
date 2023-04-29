var fs = require("fs");
var request = require("request");

// https://csgoempire.com/trading/apikey to get the key
var EmpireApikey = "";

console.log("Starting");

StartBot();
function StartBot() {
  try {
    console.log("Getting data...");

    var options = {
      method: "GET",
      url: "https://csgoempire.com/api/v2/trading/user/inventory",
      headers: {
        Authorization: "Bearer " + EmpireApikey,
        "User-Agent": "Chrome/59.0.3071.115 Safari/537.36 Edge/16.16299",
      },
    };
    return new Promise(async (resolve, reject) => {
      request(options, function (error, response) {
        if (error) console.log(error);

        console.log("Checking Response code...");

        if (response.statusCode == 200) {
          var data = JSON.parse(response.body).data;
          var ItemNames = [];
          for (var i = 0; i < data.length; i++) {
            ItemNames.push([data[i].market_name, data[i].created_at]);
          }
          var FileName = new Date().toLocaleDateString("en-GB") + ".json";
          FileName = FileName.replace(/\//g, "-");
          fs.writeFile(FileName, JSON.stringify(ItemNames), function (err) {
            if (err) {
              console.log(err);
            }
            console.log("Saved to " + FileName);
          });
          return resolve(ItemNames);
        } else {
          console.log("Error: " + response.statusCode);
          console.log(response.body);
          return reject("Error: " + response.statusCode);
        }
      });
    });
  } catch (error) {
    console.log(error);
  }
}
