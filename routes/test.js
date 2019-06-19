const express = require("express");

const router = express.Router();

const nano = require("nano")("http://Admin:password@172.17.64.136:5984");

router.get("/test", function(req, res) {
  const sql = require("mssql");

  const config = {
    user: "sa",
    password: "raphael8600A",
    server: "localhost",
    database: "STG_IrisSora"
  };

  sql.close();

  sql.connect(config, function(err) {
    if (err) console.log(err);

    const request = new sql.Request();

    request.query(
      `select * from DOSSIER WHERE DOSSIER_RESPONSABLE_LIBELLE LIKE '%PIERSON DELPHINE%'`,
      function(err, recordset) {
        if (err) res.send(err);
        const dossiers = recordset["recordsets"][0];

        const table = nano.db.use("dossiers");

        dossiers.map(dossier => {
          table
            .insert(dossier, dossier.DOSSIER_IDENT.toString())
            .then(response => {
              console.log(response);
              res.send("ok");
            })
            .catch(err => {
              console.log(err);
              res.send(err);
            });
        });
      }
    );
  });
});

router.get("/createdb", function(req, res) {
  nano.db
    .create("dossiers")
    .then(result => {
      console.log(result);
      res.send("success");
    })
    .catch(err => {
      console.log(err);
      res.send(err);
    });
});

module.exports = router;
