/* Question: Pourquoi créer des services séparés ?
* Réponse: Pour séparer la logique d'accès aux données (niveau bas) de la logique métier (controllers). 
*          Cela rend le code plus modulaire, maintenable et réutilisable.
*/

const { ObjectId } = require('mongodb');

// Fonctions utilitaires pour MongoDB
async function findOneById(collection, id) {
  try {
    const _id = new ObjectId(id); 
    return await collection.findOne({ _id });
  } catch (error) {
    console.error('Erreur lors de la recherche par ID :', error);
    throw error;
  }
}

// Export des services
module.exports = {
  findOneById,
};
