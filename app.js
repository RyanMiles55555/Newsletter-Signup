//Required packages
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const { post } = require("request");
const { response } = require("express");
const mailchimpTx = require("@mailchimp/mailchimp_transactional")(
  "a17cfda84727370d313daaf9f15ab9e8-us20"
);

//Start an instance of express
const app = express();
//express.static allows the use of "local" files such as css
app.use(express.static("public"));
//use bodyParser to parse JSON
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
  console.log(req.body.firstName, req.body.lastName, req.body.email);
  const email = req.body.email;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;

  var data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const JSONData = JSON.stringify(data);
  console.log(`JSONData === ${JSONData}`);

  // the url contains the mailing lists, the mailing list id, and which server in the US I am a part of
  const url = `https://us20.api.mailchimp.com/3.0/lists/aa2a31aefc`;

  //options passed to the request.
  const options = {
    method: "post",
    auth: "ryan1:a17cfda84727370d313daaf9f15ab9e8-us20",
  };

  const request = https.request(url, options, (response) => {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", (data) => {
      console.log(JSON.parse(data).errors);
    });
  });

  request.write(JSONData);
  request.end();
});

app.post("/success", (req, res) => {
  console.log("app.post success");
  res.redirect("/");
});

app.post("/failure", (req, res) => {
  console.log("app.post failure");
  res.redirect("/");
});

app.listen(3005, () => {
  console.log("Server is up");
});

// async function run() {
//   const response = await mailchimpTx.users.ping();
//   console.log(response);
// }

// run();
//API key
//a17cfda84727370d313daaf9f15ab9e8-us20

//audience id
//aa2a31aefc
