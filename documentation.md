# Documentation Back

## Debug

You can find logs of the back in debug.log file

## Config

Description des paramêtres du fichier config :

* couchdbUrl : l'url du service couchdb qui par défaut est http://localhost:5984 et ne devrais pas changer.
* port : le port surlequel tourne le back (par défaut 8080), si modification du port il faut modifier la réécriture d'url correspondant dans le server IIS
* job : les informations relative au job. job_time correpond à l'horraire (et la fréquence) à laquelle s'éxecute le job, le format de sa valeur est décrit dans la doc de node-schedule, le module utilisé (https://www.npmjs.com/package/node-schedule).  xml_file_folder correspond au dossier dans lequel on écrit les fichiers xml, et doit terminer par un /.  number_of_day correspond au nombre de jour pendant lequel on garde les visites après les avoir exporté en XML (cf Jobs ci-dessous.)
* sql_config : la config du serveur SQL IRIS (cf https://www.npmjs.com/package/mssql)

## Jobs

Le back exécute 2 jobs (qui sont un même job divisé en 2 parties).

* Exporter les visites dans SORA ([visiteExport.js](./jobs/visiteExport.js))

Le job récupére toutes les nouvelles visites avec le flag `toBeExported:true` dans le couchdb, puis récupére les controles et les documents (joint et photo uniquement) associés à la visite. Puis génére un fichier XML pour chaque visite (avec un nom aléatoire) comprenant ces informations.
Enfin le job retire le marquage d'export (`toBeExported:false`) des visites exportées en XML et ajoute une date de suppression de la visite (paramétrable dans le fichier config)

* Supprimer les visites un jour après avoir été exporté en XML ([deleteDocuments.js](./jobs/deleteDocuments.js))

Comme il faut environ un jour (la tache s'execute tous les soirs) pour copier les informations de SORA dans la base SQL IRIS que nous requetons, il faut garder les nouvelles visite pendant un jour après avoir été exporté pour que l'utilisateur continue de les voir dans l'application SESAM. Pour cela, nous ne supprimons les visites qu'un jour après (la visite peut donc apparaitre en double si IRIS à récupéré la visite avant que celle ci soit supprimée par le job (de plus la visite est supprimé dans couchdb et pouchdb doit aussi repliquer cette suppression dans le pouchdb client, ce qui se fait dès que l'utilisateur se connecte à internet))
Le job supprime ainsi les visites, leurs controles et leur documents associés.

## Routes

###Entreprise

***Get entreprise by id***
----
  Récupère les informations d'une entreprise par son ID

* **URL :** 
  /entreprise/:id

* **Method :** 
  `GET`

* **Response :**
L'objet entreprise avec toutes ses informations.

* **Error Response:**

  * **Code:** 500 INTERNAL SERVER ERROR <br />
    **Content:** `error description`

  OR

  * **Code:** 404 NOT FOUND <br />
    **Content:** `No enterprise with this id can be found.`

***Get entreprises by query***
----
  Renvoit les k premières entreprise qui correspondent à la recherche (length est optionel, sa valeur par défaut est 10)

* **URL :**
  /entreprise/search?query=searchQuery&length=k

* **Method :**
  `GET`

* **Response :**
Liste des k (ou moins) entreprises correspondant à searchQuery.
 
* **Error Response:**

  * **Code:** 500 INTERNAL SERVER ERROR <br />
    **Content:** `error description`


### Replication

***Get entreprises by query***
----
    Renvoit les données correspond à une table et à un agent permettant de faire la réplication des données en lecture seule avec le pouchdb

* **URL :**
  /fullData/:table?idAgent=id

* **URL params:**

  * table : la clé de table SQL à repliquer (voir le getQueryTable dans [fulldata.controller.js](./controllers/fulldata.controller.js))

  * idAgent : id de l'agent dont les données doivent être répliquées. idAgent est inutiles pour les tables activités et cpf, car ces tables ne dépendent pas de l'agent.

* **Method :**
  `GET`

* **Response :**
    La liste des lignes correspondant aux données demandés.
 
* **Error Response:**

  * **Code:** 500 INTERNAL SERVER ERROR <br />
    **Content:** `error description`

## Agent

***Get agent by id ccrf***
----
  Récupère les informations d'un agent par son identifiant ccrf (terminant en '-ccrf')

* **URL :** 
  /agent/:id

* **Method :** 
  `GET`

* **Response :**
L'agent avec toutes ses informations

* **Error Response:**

  * **Code:** 500 INTERNAL SERVER ERROR <br />
    **Content:** `error description`

  OR

  * **Code:** 404 NOT FOUND <br />
    **Content:** `No enterprise with this id can be found.`