/**
 *   Question: Pourquoi séparer les routes dans différents fichiers 
 * Réponse : 
 *      - Pour garder une meilleure lisibilité et organisation du projet : chaque module/fonctionnalité
 *     possède ses propres routes, ce qui facilite la maintenance et l’évolution du code.
 * 
 * 
 *    Question : Comment organiser les routes de manière cohérente ?
 *  Réponse:
 *      - En regroupant les endpoints par domaine/fonctionnalité (ex. courses, users, auth, etc.),
 *      et en utilisant des noms d’URL explicites qui reflètent l’action ou la ressource manipulée.
 * 
 */

const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

// Routes pour les cours
router.post('/', courseController.createCourse);   // Créer un cours
router.get('/:id', courseController.getCourse);    // Récupérer un cours par son ID
router.get('/stats', courseController.getCourseStats); // Récupérer des statistiques sur les cours

module.exports = router;