// HOW TO USE
// download the data from dynamodb (aws console) as csv.
// convert the dynamodb json to unmarshalled json at https://dangerfarms.github.io/unmarshall-dynamodb-json/
// create .json file with above value.
// run this script with the file path as argument.
// e.g. node dynamodb-unmarshal-array.js '~/data.json'

// this is a node.js cli script
const fs = require("fs");

function alt(obj) {
  // input will be { "0": {}, "1": {}, "2": {} }
  // output will be [ {}, {}, {} ]

  // get keys of object
  const keys = Object.keys(obj);

  // map keys to values
  const values = keys.map((key) => obj[key]);

  // return values
  return values;
}

if (process.argv[2]) {
  // write values to out.json
  const file = process.argv[2];

  const obj = require(file);

  const values = alt(obj);
  fs.writeFileSync(file, JSON.stringify(values));
} else {
  console.log("no input");
}
