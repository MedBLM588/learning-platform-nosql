/*
* Question : Comment gérer efficacement le cache avec Redis ?
* Réponse :
*      - Définir un TTL (Time To Live) approprié pour limiter la taille du cache.
*      - Invalider ou rafraîchir régulièrement les données expirées.
*      - Choisir la bonne stratégie (write-through, write-back, etc.) selon le cas d'utilisation.
* 
*
* Question: Quelles sont les bonnes pratiques pour les clés Redis ?
* Réponse :
*        - Utiliser un préfixe explicite (ex. "user:", "course:") pour organiser les données.
*        - Employer un TTL adapté pour chaque type de donnée.
*        - Maintenir une structure cohérente (ex. user:123:session).
*
*/


// Fonctions utilitaires pour Redis
async function cacheData(redisClient, key, data, ttl = 3600) {
  try {
    // Convertir l'objet data en chaîne JSON si nécessaire
    const value = JSON.stringify(data);

    // Définir la clé en Redis avec un TTL
    await redisClient.set(key, value, {
      EX: ttl,
    });
    console.log(`Données mises en cache sous la clé "${key}" pour ${ttl} secondes.`);
  } catch (error) {
    console.error('Erreur lors de la mise en cache des données :', error);
    throw error;
  }
}

async function getData(redisClient, key) {
  try {
    const value = await redisClient.get(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error('Erreur lors de la récupération des données du cache :', error);
    throw error;
  }
}

// Export des fonctions utilitaires
module.exports = {
  cacheData,
  getData,
};
