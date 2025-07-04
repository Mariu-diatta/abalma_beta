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
            connecTitle: " Registered !!",
            forgetPwd: " Forget password ?",
            notRegistered: "Not registered?",
             alredyRegister: 'Already register ?',

            "form": {
                "lastName": "Last name",
                "firstName": "First name",
                "email": "Email",
                "phone": "Phone number",
                "password": "Password",
                "confirmPassword": "Confirm password"
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
                 title: "My purchases",
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
        }
     },

      fr: {

        translation: {

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
                "email": "Email",
                "phone": "Numéro de téléphone",
                "password": "Mot de passe",
                "confirmPassword": "Confirmez le mot de passe"
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
                title: "Mes achats",
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
        }
      }
   }

  });

export default i18n;
