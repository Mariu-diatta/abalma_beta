import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-3xl mx-auto p-6 text-gray-800 dark:text-gray-200">
      <h1 className="text-3xl font-bold mb-4">Politique de Confidentialité</h1>
      <p className="mb-6 text-sm text-gray-500">Dernière mise à jour : 20 mai 2025</p>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">1. Qui sommes-nous ?</h2>
        <p>
          Le site <strong>Abalma</strong> est édité par :
          <br />
          <strong>Marius DIATTA</strong> 
          <br />
          <strong>1 villa des merveille, 77 Versailles</strong> : Votre adresse en France
          <br />
          <strong>mariusgdiatta@gmail.com</strong> : contact@votreplateforme.com
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">2. Données collectées</h2>
        <ul className="list-disc list-inside">
          <li>Nom, prénom</li>
          <li>Adresse e-mail</li>
          <li>Mot de passe (chiffré)</li>
          <li>Historique de commande / panier</li>
          <li>Adresse IP, navigateur</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">3. Utilisation des données</h2>
        <ul className="list-disc list-inside">
          <li>Création et gestion de votre compte</li>
          <li>Traitement des commandes ou demandes</li>
          <li>Amélioration de nos services</li>
          <li>Envoi de notifications ou emails</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">4. Cookies</h2>
        <p>
          Nous utilisons des cookies pour assurer le bon fonctionnement du site, mesurer l’audience et
          améliorer l'expérience utilisateur. Vous pouvez les refuser depuis le bandeau cookies.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">5. Partage des données</h2>
        <p>
          Vos données ne sont jamais revendues. Elles sont partagées uniquement avec nos prestataires
          (hébergeur, services d'email, paiement sécurisé) ou les autorités si requis légalement.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">6. Durée de conservation</h2>
        <ul className="list-disc list-inside">
          <li>Compte actif : données conservées</li>
          <li>Compte inactif : jusqu’à 3 ans</li>
          <li>Données de facturation : jusqu’à 10 ans (obligations légales)</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">7. Vos droits</h2>
        <p>
          Vous disposez du droit d’accès, de rectification, de suppression, de portabilité de vos données,
          ainsi que du droit de vous opposer à leur traitement.
        </p>
        <p>
          Pour exercer ces droits, contactez-nous à : <strong>contact@votreplateforme.com</strong>
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">8. Sécurité</h2>
        <p>
          Nous protégeons vos données via des mesures techniques (chiffrement, serveur sécurisé, etc.) afin
          d’empêcher tout accès non autorisé.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">9. Modifications</h2>
        <p>
          Cette politique peut être mise à jour. Vous serez notifié(e) en cas de changement important.
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
