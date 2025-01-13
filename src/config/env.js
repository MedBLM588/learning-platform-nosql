/* Question: Pourquoi est-il important de valider les variables d'environnement au démarrage ?
 * Réponse :  Pour s’assurer que toutes les configurations critiques (connexion à la base de données, URL, etc.) 
 *            sont bien fournies avant que l’application ne se lance. 
 *            Cela évite les erreurs tardives et facilite le diagnostic des problèmes.
 * 
 * Question: Que se passe-t-il si une variable requise est manquante ?
 * Réponse :  L’application risque de ne pas fonctionner correctement (erreur de connexion à la base de données, fonctionnalités indisponibles, etc.).
 *            Il est préférable de lever une exception au démarrage afin de signaler immédiatement le problème et empêcher l’exécution 
 *            dans un état instable. 
 * */

const dotenv = require('dotenv');
dotenv.config();

const requiredEnvVars = [
  'MONGODB_URI',
  'MONGODB_DB_NAME',
  'REDIS_URI'
];

// Validation des variables d'environnement
function validateEnv() {
  requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
      throw new Error(
        `La variable d'environnement '${envVar}' est requise mais n'est pas définie.`
      );
    }
  });
  console.log('Toutes les variables d\'environnement requises sont définies.');
}

// Appel de la fonction de validation dès le chargement du module
validateEnv();

module.exports = {
  mongodb: {
    uri: process.env.MONGODB_URI,
    dbName: process.env.MONGODB_DB_NAME
  },
  redis: {
    uri: process.env.REDIS_URI
  },
  port: process.env.PORT || 3000
};
