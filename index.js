//Run with: nodemon server.js in dev mode
//http://localhost:9000/wanakana/okurigana

const awsServerlessExpress = require('aws-serverless-express');
const express = require('express');
const bodyParser = require('body-parser');
const wanakana = require('wanakana');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// For CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PATCH, PUT, DELETE');
  next();
});

app.get('/', function (req, res) {

  var ideas = [{
    "keyword_pattern": "root",
    "priority": 1,
    "is_default": true,
    "comment": "Default keywords provided by user."
    }];
  
  // res.end(JSON.stringify(ideas));
  res.json(ideas);
});

//Defining Route
app.get('/wanakana/:word', function (req, res) {
    console.log("Converting to kana");
    console.log("Hirakana"+wanakana.toHiragana(req.params.word));
    console.log("Katakana"+wanakana.toKatakana(req.params.word));

    var ideas = [{
      "keyword_pattern": req.params.word,
      "priority": 1,
      "is_default": true,
      "comment": "Default keywords provided by user."
      },
      {
        "keyword_pattern": wanakana.toHiragana(req.params.word),
        "priority": 2,
        "is_default": true,
        "comment": "Katakana keywords converted to hirakana"
        },
      {
        "keyword_pattern": wanakana.toKatakana(req.params.word),
        "priority": 3,
        "is_default": true,
        "comment": "Katakana keywords converted to katakana"
        }]
    
    // res.end(JSON.stringify(ideas));
    res.json(ideas);
});

app.get('/wanakana', function (req, res) {

  var ideas = [{
    "keyword_pattern": "Def",
    "priority": 1,
    "is_default": true,
    "comment": "Default keywords provided by user."
    }];
  
  // res.end(JSON.stringify(ideas));
  res.json(ideas);
});

// Create the server
const server = awsServerlessExpress.createServer(app);

// Lambda handler
exports.handler = (event, context) => {
  awsServerlessExpress.proxy(server, event, context);
};


if (process.env.NODE_ENV !== 'lambda') {
  const port = 9000;
  app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
  });
}