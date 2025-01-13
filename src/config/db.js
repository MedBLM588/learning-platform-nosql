/* Question : Pourquoi créer un module séparé pour les connexions aux bases de données ?
* Réponse : Pour séparer clairement la logique de connexion (et de configuration) du reste
*           de l'application, favoriser la réutilisation et la maintenance.
*
* Question : Comment gérer proprement la fermeture des connexions ?
* Réponse : En fournissant des fonctions dédiées qui ferment chaque connexion de façon
*          sécurisée et en gérant les événements d'erreur pour éviter les fuites de ressources.
*/
const { MongoClient } = require('mongodb');
const redis = require('redis');
const config = require('./env');

let mongoClient;
let redisClient;
let db;

/**
 * Connexion à MongoDB
 */
async function connectMongo() {
  try {
    // Initialisation du client MongoDB
    mongoClient = new MongoClient(config.mongodb.uri, {
      useUnifiedTopology: true,
    });

    // Connexion
    await mongoClient.connect();
    db = mongoClient.db(config.mongodb.dbName);
    console.log('Connexion MongoDB réussie !');
  } catch (error) {
    console.error('Erreur de connexion MongoDB :', error);
    // Possibilité d'implémenter un mécanisme de retry si nécessaire
  }
}

/**
 * Connexion à Redis
 */
async function connectRedis() {
  try {
    // Initialisation du client Redis
    redisClient = redis.createClient({
      url: config.redis.uri,
    });

    // Gestion d'erreur
    redisClient.on('error', (err) => {
      console.error('Erreur Redis :', err);
    });

    // Connexion
    await redisClient.connect();
    console.log('Connexion Redis réussie !');
  } catch (error) {
    console.error('Erreur de connexion Redis :', error);
    // Possibilité d'implémenter un mécanisme de retry si nécessaire
  }
}

/**
 * Fermeture des connexions
 */
async function closeConnections() {
  // Fermer MongoDB
  if (mongoClient) {
    try {
      await mongoClient.close();
      console.log('Connexion MongoDB fermée.');
    } catch (error) {
      console.error('Erreur lors de la fermeture de MongoDB :', error);
    }
  }

  // Fermer Redis
  if (redisClient) {
    try {
      await redisClient.quit();
      console.log('Connexion Redis fermée.');
    } catch (error) {
      console.error('Erreur lors de la fermeture de Redis :', error);
    }
  }
}

// Export des fonctions et clients
module.exports = {
  connectMongo,
  connectRedis,
  getDb: () => db,
  getRedisClient: () => redisClient,
  closeConnections,
};
