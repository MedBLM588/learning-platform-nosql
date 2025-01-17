/***
 * Question: Quelle est la différence entre un contrôleur et une route ?
 *  Réponse:
 *    - Une route définit l'URL et la méthode HTTP (GET, POST, etc.).
 *    - Un contrôleur contient la logique métier qui s'exécute lorsque la route est appelée.
 *  Question : Pourquoi séparer la logique métier des routes ?
 *   Réponse :
 *     - Pour garder un code plus lisible et modulaire :
 *       + Les routes définissent seulement l'URL et la méthode.
 *       + Les contrôleurs gèrent la logique de traitement.
 * 
 */
 

const { getDb } = require('../config/db');
const mongoService = require('../services/mongoService');
const { getRedisClient } = require('../config/db');
const redisService = require('../services/redisService');
const { ObjectId } = require('mongodb');

async function createCourse(req, res) {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez fournir un titre et une description.',
      });
    }

    // On insère le nouveau cours dans MongoDB
    const db = getDb();
    const collection = db.collection('courses');
    const newCourse = {
      title,
      description,
      createdAt: new Date(),
    };

    const result = await mongoService.insertOne(collection, newCourse);

    // Exemple d'utilisation de Redis (optionnel)
    const redisClient = getRedisClient();
    // On pourrait mettre en cache la liste des cours, par exemple
    // await redisService.cacheData(redisClient, 'courses_list', [...], 3600);

    return res.status(201).json({
      success: true,
      message: 'Cours créé avec succès',
      data: result.ops ? result.ops[0] : newCourse, // Selon la version du driver
    });
  } catch (error) {
    console.error('Erreur lors de la création du cours :', error);
    return res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors de la création du cours',
      error: error.message,
    });
  }
}

async function getCourse(req, res) {
  try {
    const { id } = req.params;

    // Vérifiez si l'ID est valide
    if (!id || !ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "ID invalide fourni." });
    }

    const db = getDb();
    const collection = db.collection("courses");

    // Utilisez uniquement l'ID brut ici
    const course = await mongoService.findOneById(collection, id);

    if (!course) {
      return res.status(404).json({ success: false, message: "Cours introuvable" });
    }

    return res.status(200).json({ success: true, data: course });
  } catch (error) {
    console.error("Erreur lors de la récupération du cours :", error);
    return res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération du cours",
      error: error.message,
    });
  }
}

async function getCourseStats(req, res) {
  try {
    const db = getDb();
    const collection = db.collection('courses');

    const stats = await mongoService.getStats(collection);

    return res.status(200).json({ success: true, data: stats });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Erreur lors de la récupération des statistiques', error: error.message });
  }
}



// Export des contrôleurs
module.exports = {
  createCourse,
  getCourse,
  getCourseStats,
};