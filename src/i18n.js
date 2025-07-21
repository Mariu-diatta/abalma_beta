// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n

  .use(LanguageDetector) // détecte automatiquement la langue du navigateur

  .use(initReactI18next)

  .init(

    {
        fallbackLng: 'en', // langue par défaut si la détection échoue
        interpolation: {
        escapeValue: false, // React fait déjà l'échappement
    },

    resources: {

     en: {

        translation: {
             "blog":{
                title: "Our Blog",
                maint_text_content: "Creating a small blog is undoubtedly one of the most effective ways to get yourself known and showcase your activities to Abalma users."
             },
             "buy": "Buy",
             "total_pay":"Total to pay",
             "title": "Privacy Policy",
             "last_updated": "Last updated: May 20, 2025",
             "section_1_title": "1. Who are we?",
             "section_1_content": "The Abalma site is published by: Marius DIATTA, 1 villa des merveille, 77 Versailles (Your address in France), mariusgdiatta@gmail.com: contact@yourplatform.com",
             "section_2_title": "2. Data Collected",
             "section_2_list": {
                 1:"First and last name",
                 2:"Email address",
                 3:"Password (encrypted)",
                 4:"Order/cart history",
                 5:"IP address, browser"
             },
             "section_3_title": "3. Data Usage",
             "section_3_list": {
                 1:"Account creation and management",
                 2:"Order or request processing",
                 3:"Improvement of our services",
                 4:"Sending notifications or emails"
             },
             "section_4_title": "4. Cookies",
             "section_4_content": "We use cookies to ensure proper site operation, measure audience, and improve user experience. You can decline them from the cookie banner.",
             "section_5_title": "5. Data Sharing",
             "section_5_content": "Your data is never sold. It is shared only with our service providers (hosting, email services, secure payment) or authorities if legally required.",
             "section_6_title": "6. Data Retention Period",
             "section_6_list": {
                 1:"Active account: data retained",
                 2:"Inactive account: up to 3 years",
                 3:"Billing data: up to 10 years (legal obligations)"
             },
             "section_7_title": "7. Your Rights",
             "section_7_content_1": "You have the right to access, rectify, delete, and transfer your data, as well as the right to object to its processing.",
             "section_7_content_2": "To exercise these rights, contact us at: contact@yourplatform.com",
             "section_8_title": "8. Security",
             "section_8_content": "We protect your data using technical measures (encryption, secure server, etc.) to prevent unauthorized access.",
             "section_9_title": "9. Changes",
             "section_9_content": "This policy may be updated. You will be notified in the event of significant changes.",


            title_policy: "Why Choose Abalma",
            subtitle: "Make your customers happy by giving services.",
            paragraph1: "Imagine you're a small business in commerce, but your presence on social media is limited or lost in a flood of information that makes your activities and ads invisible. Abalma is here to change that. We help you gain visibility and make your voice heard in a clearer, more targeted, and user-focused digital ecosystem.",
            paragraph2:"Thanks to our platform, you can easily manage your products and data, grow your sales with confidence, and stay connected to your clients and collaborators.",
            button: "Get Started",
            quick_links: "Quick Links",
            premium_support: "Premium Support",
            our_services: "Our Services",
            know_our_team: "Know Our Team",
            company: "Company",
            about_app: "About Abalma",
            contact_support: "Contact & Support",
            success_history: "Success History",
            resource: "Resources",
            footer_product: "Our Products",
            footer_saas: "SaaS Development",
            footer_userflow: "User Flow",
            app_description: "Abalma, launched in 2025, is an application dedicated to promoting small businesses. By choosing Abalma, you become part of a connected, dynamic ecosystem that puts the user at its center.",
            sub_transaction:"sub-transaction",
            view: 'View',
            delete: "Delete",
            welcome: "Welcome",
            login: "Log In",
            register: "Register",
            home: "Home",
            about: "About",
            profil: "profil",
            logOut: "Log out",
            activity: "Your activities",
            footCondition: "Acepte termes",
            politique: "Confidentiality",
            connecTitle: " Log In !!",
            forgetPwd: " Forget password ?",
            notRegistered: "Not registered?",
             alredyRegister: 'Already register ?',
             "form": {
                 "lastName": "Last Name",
                 "firstName": "First Name",
                 "phone": "Phone Number",
                 "password": "Password",
                 "confirmPassword": "Confirm Password",
                 "email": "Email Address",
                 "emailRequired": "Email address is required",
                 "newPassword": "New Password",
                 "allFieldsRequired": "All fields are required"
             },

             homePage: {
                 headline: "Put your belongings in the spotlight.",
                 subheadline: "Give a second life to your belongings (equipment, clothes, toys, ...) with Abalma.",
                 getStarted: "Get Started",
                 downloadApp: "Download App",
                 trustTitle: "They trust us",
                 brandLogo: "Brand logo"
             },

             AccountPage: {
                 title: "Balma",
                 home: "Home",
                 messages: "Messages",
                 create: "Create",
                 upgrade: "Upgrade to Pro",
                 products: "Products",
                 categories: {
                     clothes: "Clothes",
                     books: "Books",
                     equipment: "Equipment",
                     toys: "Toys",
                     electronics: "Electronics",
                     vehicles: "Vehicles",
                     furniture: "Furniture",
                     videogames: "Video Games",
                     bags: "Bags"
                 },
                 help: "Help"
             },

             Dashboard: {
                 dashboard: "Dashboard",
                 settings: "Settings",
                 contacts: "Contacts",
                 welcomeTitle: "Welcome to your dashboard!",
                 welcomeText: "Manage your products, track your activity, and quickly access essential information to enhance your experience."
             },

             tableEntries: {
                 image: "Image",
                 product: "Product",
                 category: "Category",
                 quantity: "Qty",
                 price: "Price",
                 total: "Total",
                 action: "Action",
                 selectedProducts: "Selected Products"
             },

             tableAchat: {
                 name: "Name",
                 color: "Color",
                 category: "Category",
                 price: "Price",
                 statut: "Status",
                 action: "Action",
                 consulter: "View"
             },

             TableRecap: {
                 title: "My Transactions",
                 statusAll: "All",
                 searchPlaceholder: "Search...",
                 tableHeaders: {
                     name: "Name",
                     categories: "Categories",
                     status: "Status",
                     price: "Price",
                     operationDate: "Operation date",
                     endDate: "End date",
                     operation: "Operation",
                     actions: "Actions",
                     view: "View",
                 },
                 noProducts: "No products to display.",
                 pagination: {
                     page: "Page",
                     of: "of",
                     previous: "Previous",
                     next: "Next",
                 },
             },

             ParamText: {
                 title: "Contact list",
                 filterButton: "Filter by status",
                 filterAll: "All users",
                 filterOnline: "Online",
                 deleteSelected: "Delete selected",
                 searchPlaceholder: "Search a user",
                 table: {
                     name: "Name",
                     about: "About",
                     delete: "Delete",
                 },
                 alertDelete: "Delete users:",
             },

             settingsText: {
                 // Titles
                 accountSettings: "Account Settings",
                 paymentMethod: "Payment Method",
                 billingAddress: "Billing Address",

                 // Labels
                 theme: "Theme:",
                 themeLight: "Light",
                 themeDark: "Dark",
                 notifications: "Enable notifications",
                 nameLabel: "Name",
                 emailLabel: "Email address",
                 passwordLabel: "New password",
                 cardNumberLabel: "Card number",
                 expiryLabel: "Exp. MM/YY",
                 cvvLabel: "CVV",
                 addressLabel: "Address",
                 cityLabel: "City",
                 zipLabel: "Postal code",
                 countryLabel: "Country",
                 profileAlt: "Profile",

                 // Buttons
                 changePassword: "Change Password",
                 save: "Save",
                 saveCard: "Save Card",

                 // Messages
                 noAccountId: "No account ID found.",
                 accountSaved: "Account settings saved successfully!",
                 passwordUpdated: "Password updated successfully!",
                 cardSaved: "Card settings saved successfully!",
                 cardFetchError: "Error while fetching card data:",
                 cardSaveError: "Error while saving card data:",
             },

             ProfilText: {
                 modifierCouverture: "Edit cover image",
                 modifierProfil: "Edit your profile",
                 supprimerProfil: "Delete your profile",
                 passerPro: "Switch to professional account",
                 devenirFournisseur: "Become a supplier",
                 envoyerJustificatif: "Send document",
                 annuler: "Cancel",
                 descriptionPlaceholder: "Description",
                 nomPlaceholder: "Last name",
                 prenomPlaceholder: "First name",
                 emailPlaceholder: "Email",
                 adressePlaceholder: "Address",
                 telephonePlaceholder: "Phone number",
                 messageBtn: {
                     envoyer: "Message",
                     fermer: "Close"
                 },
                 erreurTitre: "Error",
                 labels: {
                     justificatif: "Identity document (PDF, JPG, PNG, JPEG)"
                 },
                 boutons: {
                     enregistrer: "Save",
                     annuler: "Cancel"
                 },
                 titreComptePro: "Switch to professional account",
                 titreFournisseur: "Become a supplier",
                 confirmCode: "Enter the verification code:",
                 validate: "Validate"
             },

             ListItemsFilterProduct: {
                 All: "All",
                 JOUET: "Toys",
                 HABITS: "Clothing",
                 MATERIELS_INFORMATIQUES: "Computer Equipment",
                 CAHIERS: "Notebooks",
                 SACS: "Bags",
                 LIVRES: "Books",
                 ELECTROMENAGER: "Home Appliances",
                 TELEPHONIE: "Phones & Telecom",
                 ACCESSOIRES: "Accessories",
                 SPORT: "Sports",
                 JEUX_VIDEO: "Video Games",
                 MEUBLES: "Furniture",
                 VEHICULES: "Vehicles",
                 FOURNITURES_SCOLAIRES: "School Supplies",
                 DIVERS: "Miscellaneous",
                 noProduct:"No product available"
             },


             forgetPswd: {
                 "title": "Forgot Password",
                 "getCode": "Send Code",
                 "code": "Received Code",
                 "reset": "Reset Password",
                 "success": "Password successfully reset!",
                 "step1": "Enter Email",
                 "step2": "Code & New Password",
                 "step3": "Confirmation",
                 "redirectIn": "Redirecting to login page in"
             }
        }
     },

      fr: {

          translation: {
            "blog": {
                title: "Notre Blog",
                maint_text_content: "Créer un petit blog est sans doute l’un des moyens les plus efficaces pour vous faire connaître et présenter vos activités aux utilisateurs d’Abalma."
            },
            "buy": "Acheter",
            "total_pay": "Total à payer",
            "title_policy": "Politique de Confidentialité",
            "last_updated": "Dernière mise à jour : 20 mai 2025",
            "section_1_title": "1. Qui sommes-nous ?",
            "section_1_content": "Le site Abalma est édité par : Marius DIATTA, 1 villa des merveille, 77 Versailles (Votre adresse en France), mariusgdiatta@gmail.com : contact@votreplateforme.com",
            "section_2_title": "2. Données collectées",
            "section_2_list": {
                1:"Nom, prénom",
                2:"Adresse e-mail",
                3:"Mot de passe (chiffré)",
                4:"Historique de commande / panier",
                5:"Adresse IP, navigateur",
            },
            "section_3_title": "3. Utilisation des données",
            "section_3_list": {
                1:"Création et gestion de votre compte",
                2:"Traitement des commandes ou demandes",
                3:"Amélioration de nos services",
                4: "Envoi de notifications ou emails",  
            },
            "section_4_title": "4. Cookies",
            "section_4_content": "Nous utilisons des cookies pour assurer le bon fonctionnement du site, mesurer l’audience et améliorer l'expérience utilisateur. Vous pouvez les refuser depuis le bandeau cookies.",
            "section_5_title": "5. Partage des données",
            "section_5_content": "Vos données ne sont jamais revendues. Elles sont partagées uniquement avec nos prestataires (hébergeur, services d'email, paiement sécurisé) ou les autorités si requis légalement.",
            "section_6_title": "6. Durée de conservation",
            "section_6_list": {
                1:"Compte actif : données conservées",
                2:"Compte inactif : jusqu’à 3 ans",
                3:"Données de facturation : jusqu’à 10 ans (obligations légales)"
            },
            "section_7_title": "7. Vos droits",
            "section_7_content_1": "Vous disposez du droit d’accès, de rectification, de suppression, de portabilité de vos données, ainsi que du droit de vous opposer à leur traitement.",
            "section_7_content_2": "Pour exercer ces droits, contactez-nous à : contact@votreplateforme.com",
            "section_8_title": "8. Sécurité",
            "section_8_content": "Nous protégeons vos données via des mesures techniques (chiffrement, serveur sécurisé, etc.) afin d’empêcher tout accès non autorisé.",
            "section_9_title": "9. Modifications",
            "section_9_content": "Cette politique peut être mise à jour. Vous serez notifié(e) en cas de changement important.",

            title: "Pourquoi choisir Abalma",
            subtitle: "Rendez vos clients heureux en offrant des services.",
            paragraph1: "Imaginez que vous êtes une petite entreprise évoluant dans le commerce, mais que votre présence sur les réseaux sociaux est limitée ou encore noyée dans une masse d’informations qui rend vos activités et publicités invisibles. Abalma est là pour changer cela. Nous vous aidons à gagner en visibilité et à faire entendre votre voix dans un écosystème numérique plus clair, plus ciblé, et mieux adapté à vos besoins.",
            paragraph2: "Grâce à notre plateforme, vous gérez facilement vos produits et données, développez vos ventes en toute confiance, et restez connecté·e à vos clients ainsi qu’à vos collaborateurs·trices",
            button: "Commencer",
            quick_links: "Liens rapides",
            premium_support: "Support Premium",
            our_services: "Nos services",
            know_our_team: "Découvrez notre équipe",
            company: "Entreprise",
            about_app: "À propos d'Abalma",
            contact_support: "Contact & Support",
            success_history: "Historique de réussite",
            resource: "Ressources",
            footer_product: "Nos produits",
            footer_saas: "Développement SaaS",
            footer_userflow: "Parcours utilisateur",
            app_description: "Abalma, lancée en 2025, est une application dédiée à la promotion des petites entreprises. En choisissant Abalma, vous intégrez un écosystème interconnecté, dynamique et centré sur l’utilisateur.",
            sub_transaction: "sous-transaction",
            view: 'Voir',
            delete:"Supprimer",
            welcome: "Bienvenue",
            login: "Se connecter",
            register: "S'inscrire",
            home: "Accueil",
            about: "À propos",
            profil: "Votre profil",
            logOut: "Se déconnecter",
            activity: "Vos activités",
            footCondition: "J'ai lu et accepté",
            politique: "Politique de confidentialité",
            connecTitle: "Connectez-vous !!",
            forgetPwd: " Mot de passe oublié ?",
            notRegistered: "Pas encore inscrit?",
            alredyRegister: 'Déjà inscrit.e ?',

            form: {
                "lastName": "Nom",
                "firstName": "Prénom",
                "phone": "Numéro de téléphone",
                "password": "Mot de passe",
                "confirmPassword": "Confirmez le mot de passe",
                "email": "Adresse e-mail",
                "emailRequired": "L'adresse e-mail est requise",
                "newPassword": "Nouveau mot de passe",
                "allFieldsRequired": "Tous les champs sont obligatoires"
            },

            homePage: {
                headline: "Faites passer vos biens au premier plan.",
                subheadline: "Donnez une seconde vie à vos biens (matériels, vêtements, jouets, ...) grâce à Abalma.",
                getStarted: "Commencer",
                downloadApp: "Télécharger l’application",
                trustTitle: "Ils nous font confiance",
                brandLogo: "Logo de la marque"
            },

            AccountPage: {

                title: "Balma",
                home: "Accueil",
                messages: "Messages",
                create: "Créer",
                upgrade: "Passer à Pro",
                products: "Produits",
                categories: {
                    clothes: "Vêtements",
                    books: "Livres",
                    equipment: "Matériels",
                    toys: "Jouets",
                    electronics: "Électronique",
                    vehicles: "Véhicules",
                    furniture: "Meubles",
                    videogames: "Jeux vidéo",
                    bags: "Sacs"
                },
                help: "Aide"
            },

            Dashboard: {
                dashboard: "Tableau de bord",
                settings: "Paramètres",
                contacts: "Contacts",
                welcomeTitle: "Bienvenue sur votre tableau de bord !",
                welcomeText: "Gérez vos produits, suivez vos activités et accédez rapidement aux informations essentielles pour optimiser votre expérience."
            },

            tableEntries: {
                image: "Image",
                product: "Produit",
                category: "Catégorie",
                quantity: "Qté",
                price: "Prix",
                total: "Total",
                action: "Action",
                selectedProducts: "Produits sélectionnés"
            },

            tableAchat: {
                name: "Nom",
                color: "Couleur",
                category: "Catégorie",
                price: "Prix",
                statut: "Statut",
                action: "Action",
                consulter: "Consulter"
            },

            TableRecap: {
                title: "Mes opérations",
                statusAll: "Tous",
                searchPlaceholder: "Rechercher...",
                tableHeaders: {
                    name: "Nom",
                    categories: "Catégories",
                    status: "Statut",
                    price: "Prix",
                    operationDate: "Date d'operation",
                    endDate: "Date de fin",
                    operation: "Opération",
                    actions: "Actions",
                    view: "Consulter",
                },
                noProducts: "Aucun produit à afficher.",
                pagination: {
                    page: "Page",
                    of: "sur",
                    previous: "Précédent",
                    next: "Suivant",
                },
            },

            ParamText: {

                  title: "Liste des contacts",

                  filterButton: "Filtrer par statut",

                  filterAll: "Tous les utilisateurs",

                  filterOnline: "Online",

                  deleteSelected: "Supprimer les selectionnes",

                  searchPlaceholder: "Rechercher un utilisateur",

                  table: {
                      name: "Nom",
                      about: "À propos",
                      delete: "Supprimer",
                  },

                  alertDelete: "Supprimer les utilisateurs :",
            },

            settingsText: {
                // Titres
                accountSettings: "Paramètres du compte",
                paymentMethod: "Mode de paiement",
                billingAddress: "Adresse de facturation",

                // Labels
                theme: "Thème:",
                themeLight: "Clair",
                themeDark: "Sombre",
                notifications: "Activer les notifications",
                nameLabel: "Nom",
                emailLabel: "Adresse email",
                passwordLabel: "Nouveau mot de passe",
                cardNumberLabel: "Numéro de carte",
                expiryLabel: "Exp. MM/AA",
                cvvLabel: "CVV",
                addressLabel: "Adresse",
                cityLabel: "Ville",
                zipLabel: "Code postal",
                countryLabel: "Pays",
                profileAlt: "Profil",

                // Boutons
                changePassword: "Changer de mot de passe",
                save: "Enregistrer",
                saveCard: "Enregistrer la carte",

                // Messages
                noAccountId: "Aucun ID de compte trouvé.",
                accountSaved: "Paramètres du compte enregistrés avec succès!",
                passwordUpdated: "Mot de passe modifié avec succès !",
                cardSaved: "Paramètres de la carte enregistrés avec succès !",
                cardFetchError: "Erreur lors de la récupération des données de la carte :",
                cardSaveError: "Erreur lors de l'enregistrement des données :",
              },

            ProfilText: {
                  modifierCouverture: "Modifier image de couverture",
                  modifierProfil: "Modifier votre profil",
                  supprimerProfil: "Supprimer votre profil",
                  passerPro: "Passer en compte professionnel",
                  devenirFournisseur: "Devenir fournisseur",
                  envoyerJustificatif: "Envoyer justificatif",
                  annuler: "Annuler",
                  descriptionPlaceholder: "Description",
                  nomPlaceholder: "Nom",
                  prenomPlaceholder: "Prénom",
                  emailPlaceholder: "Email",
                  adressePlaceholder: "Adresse",
                  telephonePlaceholder: "Téléphone",
                  messageBtn: {
                      envoyer: "Message",
                      fermer: "Fermer"
                  },
                  erreurTitre: "Erreur",
                  labels: {
                      justificatif: "Justificatif d'identité (PDF, JPG, PNG, JPEG)"
                  },
                  boutons: {
                      enregistrer: "Enregistrer",
                      annuler: "Annuler"
                  },
                  titreComptePro: "Passer en compte professionnel",
                  titreFournisseur: "Devenir fournisseur",
                  confirmCode: "Entrez le code de confirmation",
                  validate:"Validate"
              },

              ListItemsFilterProduct:{
                  All: "Tous",
                  JOUET: "Jouets",
                  HABITS: "Vêtements",
                  MATERIELS_INFORMATIQUES: "Matériels informatiques",
                  CAHIERS: "Cahiers",
                  SACS: "Sacs",
                  LIVRES: "Livres",
                  ELECTROMENAGER: "Électroménager",
                  TELEPHONIE: "Téléphonie",
                  ACCESSOIRES: "Accessoires",
                  SPORT: "Sport",
                  JEUX_VIDEO: "Jeux vidéo",
                  MEUBLES: "Meubles",
                  VEHICULES: "Véhicules",
                  FOURNITURES_SCOLAIRES: "Fournitures scolaires",
                  DIVERS: "Divers",
                  noProduct: "Aucun produit n'est disponible"
              },

              forgetPswd: {
                  "title": "Mot de passe oublié",
                  "getCode": "Envoyer le code",
                  "code": "Code reçu",
                  "reset": "Réinitialiser le mot de passe",
                  "success": "Mot de passe réinitialisé avec succès !",
                  "step1": "Saisie de l'email",
                  "step2": "Code & Nouveau mot de passe",
                  "step3": "Confirmation",
                  "redirectIn": "Redirection vers la page de connexion dans"
              }
        }
      }
   }

  });

export default i18n;
