import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-3xl mx-auto p-6 text-gray-800 dark:text-gray-200">
      <h1 className="text-3xl font-bold mb-4">Politique de Confidentialit�</h1>
      <p className="mb-6 text-sm text-gray-500">Derni�re mise � jour : 20 mai 2025</p>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">1. Qui sommes-nous ?</h2>
        <p>
          Le site "[<strong>Nom de votre plateforme</strong>]" est �dit� par :
          <br />
          <strong>Nom</strong> : Votre Nom ou Raison Sociale
          <br />
          <strong>Adresse</strong> : Votre adresse en France
          <br />
          <strong>Email</strong> : contact@votreplateforme.com
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">2. Donn�es collect�es</h2>
        <ul className="list-disc list-inside">
          <li>Nom, pr�nom</li>
          <li>Adresse e-mail</li>
          <li>Mot de passe (chiffr�)</li>
          <li>Historique de commande / panier</li>
          <li>Adresse IP, navigateur</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">3. Utilisation des donn�es</h2>
        <ul className="list-disc list-inside">
          <li>Cr�ation et gestion de votre compte</li>
          <li>Traitement des commandes ou demandes</li>
          <li>Am�lioration de nos services</li>
          <li>Envoi de notifications ou emails</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">4. Cookies</h2>
        <p>
          Nous utilisons des cookies pour assurer le bon fonctionnement du site, mesurer l�audience et
          am�liorer l'exp�rience utilisateur. Vous pouvez les refuser depuis le bandeau cookies.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">5. Partage des donn�es</h2>
        <p>
          Vos donn�es ne sont jamais revendues. Elles sont partag�es uniquement avec nos prestataires
          (h�bergeur, services d'email, paiement s�curis�) ou les autorit�s si requis l�galement.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">6. Dur�e de conservation</h2>
        <ul className="list-disc list-inside">
          <li>Compte actif : donn�es conserv�es</li>
          <li>Compte inactif : jusqu�� 3 ans</li>
          <li>Donn�es de facturation : jusqu�� 10 ans (obligations l�gales)</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">7. Vos droits</h2>
        <p>
          Vous disposez du droit d�acc�s, de rectification, de suppression, de portabilit� de vos donn�es,
          ainsi que du droit de vous opposer � leur traitement.
        </p>
        <p>
          Pour exercer ces droits, contactez-nous � : <strong>contact@votreplateforme.com</strong>
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">8. S�curit�</h2>
        <p>
          Nous prot�geons vos donn�es via des mesures techniques (chiffrement, serveur s�curis�, etc.) afin
          d�emp�cher tout acc�s non autoris�.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">9. Modifications</h2>
        <p>
          Cette politique peut �tre mise � jour. Vous serez notifi�(e) en cas de changement important.
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
