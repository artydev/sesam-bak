const express = require('express');

const router = express.Router();

const nano = require('nano')('http://Admin:password@172.17.64.136:5984');

const sql = require('mssql');

const requests = require('./requests');

const UserController = require('../../controllers/user.controller');

router.get('/getUsers', async function(req, res) {
  const request = new sql.Request();

  try {
    await saveUsers(request);
    await saveDossiers(request);
    res.status(200).send('ok');
  } catch (e) {
    res.status(500).send(e);
  }
});

function saveDossiers(request) {
  return new Promise((resolve, reject) => {
    //récupérer les dossiers
    request.query(requests.getDossiers, async function(err, recordset) {
      if (err) res.send(err);
      try {
        await UserController.createDossiers(recordset['recordsets'][0]);
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  });
}

function saveUsers(request) {
  //récupérer les utilisateurs
  return new Promise((resolve, reject) =>
    request.query(requests.getUsers, async function(err, recordset) {
      if (err) reject(err);
      try {
        await UserController.createUsers(recordset['recordsets'][0]);
        resolve();
      } catch (e) {
        reject(e);
      }
    })
  );
}

module.exports = router;
