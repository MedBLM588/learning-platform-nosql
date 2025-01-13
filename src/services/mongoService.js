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
};
