const fs = require('fs');
const convert = require('xml-js');
const protobuf = require('protobufjs');

// Charger la définition Protobuf à partir du fichier .proto
const root = protobuf.loadSync('employee.proto');

// Récupérer le type "Employees" défini dans employee.proto
const EmployeeList = root.lookupType('Employees');

// Création d'une liste d'employés en mémoire
const employees = [];

employees.push({
  id: 1,
  name: 'Mouad',
  salary: 22000
});

employees.push({
  id: 2,
  name: 'Abdo',
  salary: 10000
});

employees.push({
  id: 3,
  name: 'Kamal',
  salary: 9000
});
employees.push({
  id: 4,
  name: 'Amal',
  salary: 9000
});
employees.push({
  id: 5,
  name: 'Maryem',
  salary: 9000
});

// Objet racine correspondant au message "Employees"
let jsonObject = {
  employee: employees
};

// ---------- JSON : encodage ----------
console.time('JSON encode');
let jsonData = JSON.stringify(jsonObject);
console.timeEnd('JSON encode');

// Options pour la conversion JSON -> XML
const options = {
  compact: true,
  ignoreComment: true,
  spaces: 0
};



// Encodage en Protobuf : vérification du schéma
let errMsg = EmployeeList.verify(jsonObject);
if (errMsg) {
  throw Error(errMsg);
}

// // ---------- Protobuf : encodage ----------
// console.time('Protobuf encode');
let message = EmployeeList.create(jsonObject);
let buffer = EmployeeList.encode(message).finish();
// console.timeEnd('Protobuf encode');


// Récupération de la taille des fichiers (en octets)
// const jsonFileSize = fs.statSync('data.json').size;
// const xmlFileSize = fs.statSync('data.xml').size;
// const protoFileSize = fs.statSync('data.proto').size;

// Affichage des tailles dans la console
// console.log(`Taille de 'data.json' : ${jsonFileSize} octets`);
// console.log(`Taille de 'data.xml'  : ${xmlFileSize} octets`);
// console.log(`Taille de 'data.proto': ${protoFileSize} octets`);



// ---------- JSON : décodage ----------
console.time('JSON decode');
let jsonDecoded = JSON.parse(jsonData);
console.timeEnd('JSON decode');

// ---------- XML : encodage ----------
console.time('XML encode');
let xmlData = "<root>\n" + convert.json2xml(jsonObject, options) + "\n</root>";
console.timeEnd('XML encode');

// ---------- XML : décodage ----------
console.time('XML decode');
// Conversion XML -> JSON (texte) -> objet JS
let xmlJson = convert.xml2json(xmlData, { compact: true });
let xmlDecoded = JSON.parse(xmlJson);
console.timeEnd('XML decode');



// ---------- Protobuf : décodage ----------
console.time('Protobuf decode');
let decodedMessage = EmployeeList.decode(buffer);
// Optionnel : conversion vers objet JS "classique"
let protoDecoded = EmployeeList.toObject(decodedMessage);
console.timeEnd('Protobuf decode');