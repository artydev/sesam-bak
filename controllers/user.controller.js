const nano = require('nano')('http://Admin:password@172.17.64.136:5984');

const Promise = require('bluebird');

exports.createDossiers = async function(dossiers) {
  return new Promise(async (resolve, reject) => {
    try {
      await nano.db.destroy('dossiers');
      await nano.db.create('dossiers');
      const dossier_table = await nano.db.use('dossiers');
      await Promise.all(saveDossiers(dossier_table, dossiers));
      resolve();
    } catch (e) {
      try {
        await nano.db.create('dossiers');
        const dossier_table = await nano.db.use('dossiers');
        await Promise.all(saveDossiers(dossier_table, dossiers));
        resolve();
      } catch (err) {
        reject(err);
      }
    }
  });
};

exports.createUsers = async function(users) {
  return new Promise(async (resolve, reject) => {
    try {
      await nano.db.destroy('users');
      await nano.db.create('users');
      const user_table = await nano.db.use('users');
      await Promise.all(saveUsers(user_table, users));
      resolve();
    } catch (e) {
      //la base de donnée des utilisateurs n'existe peut-être pas...
      try {
        await nano.db.create('users');
        const user_table = await nano.db.use('users');
        await Promise.all(saveUsers(user_table, users));
        resolve();
      } catch (e) {
        reject(e);
      }
    }
  });
};

function saveUsers(user_table, users) {
  return Promise.map(
    users,
    function(user) {
      return user_table.insert(user, user.AGENT_DD_IDENT.toString());
    },
    { concurrency: 1000 }
    //éviter que tous les documents soient ouverts en même temps!
  );
}

function saveDossiers(dossier_table, dossiers) {
  return Promise.map(
    dossiers,
    function(dossier) {
      return dossier_table.insert(dossier, dossier.DOSSIER_IDENT.toString());
    },
    { concurrency: 100 }
    //éviter que tous les documents soient ouverts en même temps!
  );
}
