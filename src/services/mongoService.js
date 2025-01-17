/* Question: Pourquoi créer des services séparés ?
* Réponse: Pour séparer la logique d'accès aux données (niveau bas) de la logique métier (controllers). 
*          Cela rend le code plus modulaire, maintenable et réutilisable.
*/

const { ObjectId } = require('mongodb');

/**
 * Recherche un document par son ID dans la collection MongoDB
 * @param {Collection} collection - Collection MongoDB
 * @param {string} id - ID au format string
 * @returns {Object} - Document trouvé ou null
 */
async function findOneById(collection, id) {
  try {
    const _id = new ObjectId(id);
    return await collection.findOne({ _id });
  } catch (error) {
    console.error('Erreur lors de la recherche par ID :', error);
    throw error;
  }
}


async function getStats(collection) {
  try {
    const stats = await collection.aggregate([
      {
        // Étape 1 : Filtrer les documents où "title" existe et est de type chaîne
        $match: {
          title: { $exists: true, $type: "string" },
        },
      },
      {
        // Étape 2 : Grouper pour calculer les statistiques
        $group: {
          _id: null, // Groupe unique pour stats globales
          totalCourses: { $sum: 1 }, // Compter les documents
          avgTitleLength: { $avg: { $strLenCP: "$title" } }, // Longueur moyenne des titres
        },
      },
      {
        // Étape 3 : Projeter les champs nécessaires
        $project: {
          _id: 0,
          totalCourses: 1,
          avgTitleLength: 1,
        },
      },
    ]).toArray();

    // Retourne les stats ou des valeurs par défaut si aucun document n'est trouvé
    return stats[0] || { totalCourses: 0, avgTitleLength: 0 };
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques :", error);
    throw error;
  }
}



/**
 * Insère un document dans la collection MongoDB
 * @param {Collection} collection
 * @param {Object} doc - Le document à insérer
 * @returns {Object} - Résultat de l'insertion
 */
async function insertOne(collection, doc) {
  try {
    return await collection.insertOne(doc);
  } catch (error) {
    console.error('Erreur lors de l\'insertion du document :', error);
    throw error;
  }
}

// Export des services
module.exports = {
  findOneById,
  insertOne,
  getStats,
};
