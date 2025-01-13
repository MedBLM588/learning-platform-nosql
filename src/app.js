/**
 * Question: Comment organiser le point d'entrée de l'application ?
 *  Réponse: 
 *  - En rassemblant : la configuration (variables d'environnement), 
 *    la connexion aux bases de données, la configuration d'Express (middlewares),
 *    et l'initialisation des routes dans un seul fichier central.
 * 
 * 
 * Question: Quelle est la meilleure façon de gérer le démarrage de l'application ?
 *  Réponse:
 *  - En plaçant toutes les opérations critiques (connexion BDD, config) dans un try/catch
 *    pour gérer les erreurs dès le lancement. Écouter aussi les signaux système (SIGTERM, SIGINT)
 *    pour fermer proprement les connexions et éviter les fuites de ressources.
 * 
 */


const express = require('express');
const config = require('./config/env');
const db = require('./config/db');

// Import des routes
const courseRoutes = require('./routes/courseRoutes');
const studentRoutes = require('./routes/studentRoutes');

const app = express();

async function startServer() {
  try {
    // 1. Connexion aux bases de données
    await db.connectMongo();
    await db.connectRedis();

    // 2. Configuration des middlewares Express
    app.use(express.json());
    // Vous pouvez également ajouter d'autres middlewares (body-parser, cors, etc.)

    // 3. Montage des routes
    app.use('/courses', courseRoutes);
    app.use('/students', studentRoutes);

    // 4. Démarrage du serveur
    app.listen(config.port, () => {
      console.log(`Serveur démarré sur le port ${config.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Gestion propre de l'arrêt (arrêt contrôlé)
process.on('SIGTERM', async () => {
  try {
    await db.closeConnections(); // Fermer les connexions MongoDB/Redis
    console.log('Connexions fermées. Arrêt du serveur.');
    process.exit(0);
  } catch (err) {
    console.error('Erreur lors de la fermeture des connexions :', err);
    process.exit(1);
  }
});

// Lancement de l'application
startServer();
