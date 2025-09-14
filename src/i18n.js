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
             "doPaimenent": "Make your payment",
             "choosePaiementMode": "Choose a payment method.",
             message: {
                nomessage: "you have no message"
             },
             confirmForgotPassword: 'Please confirm by clicking on the link sent to your email.',
             justif_send: '✅ Proof sent successfully!',
             compte_pro: '🎉 Your account is now professional.',
             select_file: 'Please select a file before saving.',
             error_file: 'Error while updating the profile.',
             update_profil: '✅ Profile updated!',
             Search: "Search",
             uploadedFile: "File uploaded",
             paymentMethod: "Payement method",
             address: "Adress",
             delivery: "Delivery",
             views_product: "View the product",
             about_us:"Read more about us",
             file_selected:"File selected",
             read_more: "Read more",
             add_new_product:"Add new product",
             user_created:"User created successfully!!",
             about_image_text: 'Fill your basket with products from local producers and buy them',
             about_image_text1: 'Get your products delivered on time',
             about_image_text2: 'Plan your business effectively',
             modifyProduct: {
                 confirmDeleteProduct: "Do you really want to update this product?",
                 modify_product: "Modify",
                 cancel_modify_product: "Cancel modification",
                 title_modify_product: "Product modification"
             },

             myProducts: 'My products',

             quantity_sold:"qty sold",

             quantity:'qty available',

             All: 'All',

             homePan: {
                 title: "Every great business starts with a single step.",
                 content: "Welcome to the Abalma platform! We help you enhance your social media presence, boost your visibility, and accelerate your business growth."
             },

             serviceHome: {
                 detail_1: "Abalma boosts your online visibility and grows your business from the ground up with tailored strategies and expert support.",
                 detail_2: "Protect your digital assets with Abalma's seamless and stress-free security solutions, designed to keep your business safe.",
                 detail_3: "With our premium plan, connect with a vast audience and turn prospects into loyal customers through targeted outreach.",
             },
             text_home_picture: "Like Samba, launch your small business and get noticed!",
             hintProofDoc: "Upload both your ID card and proof of address in a single file.",
             followed:"Unfollow",
             follow:'Follow',
             following: "Following",
             followers:'Followers',
             at:"at",
             phrasaleDate:"Today",
             reviews: 'Views',
             choose_language:'Choose a langage',
             connect_with: "Connect With",
             param: 'Settings and Privacy',
             add_product: {
                 "add_or_update_product": "Add / Edit a product",
                 ChooseImage: 'Choose an image',
                 name_product: "Product name",
                 payement_methode:'Payment method',
                 "informations": "Product Information",
                 "paimement_infos": "Payment Information",
                 "informations_livraison": "Delivery Information",
                 FREE: "Free",
                 DELPAID: "Paid",
                 "code_reference": "Reference Code",
                 "required": "*",
                 "product_color": "Product color",
                 "default_currency_label": "Select default currency Francs",
                 "select_currency": "-- Select currency --",
                 "euro": "Euro",
                 "dollar": "Dollar",
                 "franc": "Franc",
                 "product_price": "Product price",
                 "product_category": "Category",
                 "select_category": "-- Select a category --",
                 "categories": {
                     "JOUET": "Toy",
                     "HABITS": "Clothes",
                     "MATERIELS_INFORMATIQUES": "IT Equipment",
                     "CAHIERS": "Notebooks",
                     "SACS": "Bags",
                     "LIVRES": "Books",
                     "ELECTROMENAGER": "Home Appliances",
                     "TELEPHONIE": "Phones",
                     "ACCESSOIRES": "Accessories",
                     "SPORT": "Sport Equipment",
                     "JEUX_VIDEO": "Video Games",
                     "MEUBLES": "Furniture",
                     "VEHICULES": "Vehicles",
                     "FOURNITURES_SCOLAIRES": "School Supplies",
                     "DIVERS": "Other / Misc",
                     "HB": "Clothes"
                 },
                 "operation_type": "Operation Type",
                 "select_operation": "-- Select operation --",
                 "PRETER": "Lend",
                 "VENDRE": "Sell",
                 "DONNER": "Give",
                 "ECHANGER": "Exchange",
                 "LOCATION": "Rent",
                 "RESERVER": "Reserve",
                 "loan_start_date": "Loan start date",
                 "loan_end_date": "Loan end date",
                 "supplier": "Supplier",
                 "product_description": "Description",
                 "product_image": "Product image",
                 "choose_image": "Choose an image",
                 "product_size": "Product size (default medium)",
                 "select_size": "-- Select size --",
                 "SMALL": "Small",
                 "MEDIUM": "Medium",
                 "BIG": "Large",
                 "quantity": "Quantity (default 1)",
                 "save_product": "Save product",
                 "switch_to_supplier": "Switch to supplier account",
                 "message_title": "Message",
                 "error_missing_fields": "The field \"{{field}}\" is required.",
                 "error_image_required": "Product image is required.",
                 "error_dates_required": "Start and end loan dates are required.",
                 "success_product_created": "Product created successfully!",
                 "error_create_product": "Error while creating the product:",
                 "unknown_error": "Unknown error while creating the product.",
                 "no_account": "No account"
             },
             "blog": {
                 title: "Our Blog",
                 error_creating: "Error while creating the blog",
                 blog_created: "Blog successfully created!",
                 cancel: "Cancel",
                 reaMore:'Read more',
                 title_pop:'Title of blog',
                 blog: "Add blog",
                 create_blog: "Create a blog",
                 title_placeholder: "Your blog title",
                 delete: "Delete",
                 description: "Description of your blog",
                 description_placeholder: "description",
                 submit: "Submit",
                 maint_text_content: "Creating a small blog is undoubtedly one of the most effective ways to get known and showcase your activities to Abalma users."
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


            title_policy: "Why Abalma ?",
            subtitle: "Impress your customers by delivering an outstanding service experience.",
            paragraph1: "Imagine you're a small business in commerce, but your presence on social media is limited or lost in a flood of information that makes your activities and ads invisible. Abalma is here to change that. We help you gain visibility and make your voice heard in a clearer, more targeted, and user-focused digital ecosystem.",
            paragraph2:"Thanks to our platform, you can easily manage your products and data, grow your sales with confidence, and stay connected to your clients and collaborators.",
            button: "Get Started",
            quick_links: "Quick Links",
            client_support: "Delivery information",
            client_support_alert: "Product safety alerts",
            client_fraud: "Report suspicious activity",
            client_services: "Client services",
            contact_us:'contact us',
            know_us:"Know us",
            about_abalma: "About Abalma",
            help: "Help",
            help_center_faq: "Help Center & FAQ",
            security_center: "Security Center",
            abalma_purchase_protection: "Purchase Protection on Abalma",
            digital_services_act: "Digital Services Act (DSA)",
            company_info_legal: "Company information – Legal notice",
            follow_us:'Follow us on',
            know_our_team: "Know Our Team",
            company: "Company",
            about_app: "About Abalma",
            contact_support: "Contact & Support",
            success_history: "Success History",
            resource: "Resources",
            footer_product: "Our Products",
            footer_saas: "SaaS Development",
            footer_userflow: "User Flow",
            footer_sendEmail: 'Send us an email',
            footer_toutDroit: "All rights reserved.",
            footer_flowOn: "Follow Us On",
            app_description: "Abalma, launched in 2025, is an application dedicated to promoting small businesses.\n By choosing Abalma, you become part of a connected, dynamic ecosystem that puts the user at its center.",
            sub_transaction:"sub-transaction",
            view: 'View',
            delete: "Delete",
            welcome: "Welcome",
            login: "Log In",
            register: "Creat an account",
            home: "Home",
            about: "About",
            profil: "profil",
            logOut: "Log out",
            activity: "Your activities",
            footCondition: "Accept terms",
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
                 "allFieldsRequired": "All fields are required",
                 resetRequestError: "Reset failed: email not found in our database."
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
                 supprimerProfil: "Delete account",
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
                 confirmCode: "Enter the verification code send by email:",
                 validate: "Validate"
             },

             ListItemsFilterProduct : {
                 All: "All",
                 JOUET: "Toys",
                 HABITS: "Clothes",
                 MATERIELS_INFORMATIQUES: "Computer Equipment",
                 CAHIERS: "Notebooks",
                 SACS: "Bags",
                 LIVRES: "Books",
                 ELECTROMENAGER: "Home Appliances",
                 TELEPHONIE: "Telephony",
                 ACCESSOIRES: "Accessories",
                 SPORT: "Sport",
                 JEUX_VIDEO: "Video Games",
                 MEUBLES: "Furniture",
                 VEHICULES: "Vehicles",
                 FOURNITURES_SCOLAIRES: "School Supplies",
                 DIVERS: "Miscellaneous",
                 BIJOUX: "Jewelry",
                 COSMETIQUES: "Cosmetics",
                 ALIMENTATION: "Food",
                 MUSIQUE: "Music",
                 noProduct: "No product available"
             },

             forgetPswd: {
                 "title": "Forgot Password",
                 "getCode": "Send Code",
                 "code": "Received Code",
                 "reset": "Reset Password",
                 "success": "Password successfully reset!",
                 "step1": "Email?",
                 "step2": "Code & Password",
                 "step3": "Confirmation",
                 "redirectIn": "Redirecting to login page in"
             }
        }
     },

     fr: {

         translation: {
             doPaimenent: "Faire votre Paiement",
             choosePaiementMode:"Choisir un mode de paiement.",
             message: {
                 nomessage: "Vous n'avez aucun message"
             },
             confirmForgotPassword:"Veuillez confimer en clicquant sur le lien envoyé à  votre mail ",
             justif_send: '✅ Justificatif envoyé avec succès !',
             compte_pro: '🎉 Votre compte est maintenant professionnel.',
             select_file: 'Veuillez sélectionner un fichier avant de sauvegarder.',
             error_file: 'Erreur lors de la mise à jour du profil.',
             update_profil: '✅ Profil mis à jour !',
             Search:"Recherche",
             uploadedFile: "Fichier sélectionné",
             paymentMethod: "Méthode de payement",
             adress: "Adresse",
             delivery: "Livraison",
             views_product:'Voir le produit',
             about_us: "A propos de nous",
             file_selected: "Fichier sélectionné",
             read_more:"Lire plus",
             add_new_product: "Ajout nouveau produit",
             user_created:"Utilisateur.rice créé.e avec succé!!",
             about_image_text: 'Remplissez votre panier avec des produits de producteurs locaux et achetez-les',
             about_image_text1: 'Recevez vos produits dans les délais',
             about_image_text2: 'Planifiez efficacement votre activité',

             modifyProduct: {
                 confirmDeleteProduct: "Voulez-vous vraiment mettre à jour ce produit ?",
                 modify_product: "Modifier",
                 cancel_modify_product: "Annuler la modification",
                 title_modify_product: "Modification du produit"
             },

             myProducts: 'Mes produits',

             quantity_sold:'qté vendue',

             quantity: "qté disponible",

             All: 'Tous',

             homePan: {
                 title: "Toute grande entreprise commence par un premier pas.",
                 content: "Bienvenue sur la plateforme Abalma ! Nous vous accompagnons pour optimiser votre présence sur les réseaux sociaux, renforcer votre visibilité et accélérer la croissance de votre activité."
             },

             serviceHome: {
                 detail_1: "Abalma renforce votre visibilité en ligne et développe votre entreprise de A à Z grâce à des stratégies personnalisées et un accompagnement expert.",
                 detail_2: "Protégez vos actifs numériques avec les solutions de sécurité fluides et sans stress d'Abalma, conçues pour sécuriser votre activité.",
                 detail_3: "Avec notre offre premium, touchez une vaste audience et transformez vos prospects en clients fidèles grâce à une approche ciblée.",
             },

             text_home_picture: "Comme Samba, lancez votre petit business et faites- vous connaître !", 
              hintProofDoc: "Téléversez votre carte d’identité et votre justificatif de domicile dans un seul fichier.",
              followed: "Ne plus suivre",
              follow: 'Suivre',
              following: 'Abonnements',
              followers: 'Abonnés',
              at: "à",
              phrasaleDate: "Aujourd'hui à",
              reviews: 'Vues',
              choose_language: 'Choisir une langue',
              connect_with: "Se connecter avec",
             param: 'Paramètres et convidentialités',

              add_product: {
                  "add_or_update_product": "Ajouter / Modifier un produit",
                  ChooseImage: 'Choisissez une image',
                  "paiement_methode": "Méthode de paiement",
                  name_product:"Nom de la guerre",
                  informations: "Informations sur le produit",
                  paimement_infos: "Informations sur le paiement",
                  informations_livraison:"Informations de livraison",
                  "code_reference": "Code Référence",
                  FREE: "Gratuite",
                  DELPAID: "Avec frais",
                  "required": "*",
                  "product_color": "Couleur produit",
                  "default_currency_label": "Choisir la monnaie defaul Francs",
                  "select_currency": "-- Choisir la monnaie --",
                  "euro": "Euro",
                  "dollar": "Dollar",
                  "franc": "Franc",
                  "product_price": "Prix du produit",
                  "product_category": "Catégorie",
                  "select_category": "-- Choisir une catégorie --",
                  "categories": {
                      "JOUET": "Jouet",
                      "HABITS": "Habits",
                      "MATERIELS_INFORMATIQUES": "Matériels Informatiques",
                      "CAHIERS": "Cahiers",
                      "SACS": "Sacs",
                      "LIVRES": "Livres",
                      "ELECTROMENAGER": "Électroménager",
                      "TELEPHONIE": "Téléphonie",
                      "ACCESSOIRES": "Accessoires",
                      "SPORT": "Équipements de sport",
                      "JEUX_VIDEO": "Jeux vidéo",
                      "MEUBLES": "Meubles",
                      "VEHICULES": "Véhicules",
                      "FOURNITURES_SCOLAIRES": "Fournitures scolaires",
                      "DIVERS": "Autres / Divers",
                      "HB": "Habits"
                  },
                  "operation_type": "Type d'opération",
                  "select_operation": "-- Choisir l'opération --",
                  "PRETER": "Prêter",
                  "VENDRE": "Vendre",
                  "DONNER": "Donner",
                  "ECHANGER": "Échanger",
                  "LOCATION": "Louer",
                  "RESERVER": "Réserver",
                  "loan_start_date": "Date de début d'emprunt",
                  "loan_end_date": "Date de fin d'emprunt",
                  "supplier": "Fournisseur",
                  "product_description": "Description",
                  "product_image": "Image du produit",
                  "choose_image": "Choisissez une image",
                  "product_size": "Taille du produit (défaut moyenne)",
                  "select_size": "-- Choisir la taille --",
                  "SMALL": "Petite",
                  "MEDIUM": "Moyenne",
                  "BIG": "Grande",
                  "quantity": "Quantité (défaut 1)",
                  "save_product": "Enregistrer le produit",
                  "switch_to_supplier": "Passer au compte fournisseur",
                  "message_title": "Message",
                  "error_missing_fields": "Le champ \"{{field}}\" est requis.",
                  "error_image_required": "L'image du produit est requise.",
                  "error_dates_required": "Les dates d'emprunt et de fin sont requises.",
                  "success_product_created": "Produit créé avec succès !",
                  "error_create_product": "Erreur lors de la création du produit :",
                  "unknown_error": "Erreur inconnue lors de la création du produit.",
                  "no_account": "Pas de compte"
              },
            "blog": {
                blogName: 'Nom',
                blogContent: 'Contenu',
                error_creating: "Erreur lors de la création du blog",
                blog_created: "Blog créé avec succès !",
                dateBlog: "Date",
                myBlogs:'Mes blogs',
                title: "Notre Blog",
                blog: 'Ajouter un blog',
                cancel: "Annuler",
                reaMore:'Lire plus',
                title_pop: 'Tire de votre blog',
                create_blog: 'Créer un blog',
                title_placeholder:"Titre de ton blog",
                delete: 'Supprimer',
                description:"Description de ton blog",
                description_placeholder:"description",
                submit: 'Soumettret',
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
            about_abalma : "À propos de Abalma",
            contact_us:"Contactez-nous",
            know_us:"Nous connaître",
            company_info_legal: "Informations sur l'entreprise – Mentions légales",
            help: "Aide",
            help_center_faq: "Centre d’aide et FAQ",
            security_center: "Centre de sécurité",
            abalma_purchase_protection: "Protection des achats sur Abalma",
            digital_services_act: "Règlement sur les services numériques (DSA)",
            title: "Pourquoi Abalma ?",
            follow_us:"Nous suivre sur",
            subtitle: "Surprenez vos clients en leur offrant une expérience de service exceptionnelle.",
            paragraph1: "Imaginez que vous êtes une petite entreprise évoluant dans le commerce, mais que votre présence sur les réseaux sociaux est limitée ou encore noyée dans une masse d’informations qui rend vos activités et publicités invisibles. Abalma est là pour changer cela. Nous vous aidons à gagner en visibilité et à faire entendre votre voix dans un écosystème numérique plus clair, plus ciblé, et mieux adapté à vos besoins.",
            paragraph2: "Grâce à notre plateforme, vous gérez facilement vos produits et données, développez vos ventes en toute confiance, et restez connecté·e à vos clients ainsi qu’à vos collaborateurs·trices",
            button: "Commencer",
            quick_links: "Liens rapides",
            client_support: "Informations de livraison",
            client_support_alert: "Alertes sur la sécurité des produits",
            client_fraud:'Signaler une activité suspecte',
            client_services: "Services client",
            know_our_team: "Découvrez notre équipe",
            company: "Entreprise",
            about_app: "À propos d'Abalma",
            contact_support: "Contact & Support",
            success_history: "Historique de réussite",
            resource: "Ressources",
            footer_product: "Nos produits",
            footer_flowOn:"Suivez-nous sur ",
            footer_saas: "Développement SaaS",
            footer_userflow: "Parcours utilisateur",
            footer_sendEmail: 'Envoyez-nous un email',
            footer_toutDroit:".Tous droits réservés.",
            app_description: "Abalma, lancée en 2025, est une application dédiée à la promotion des petites entreprises.\n\n En choisissant Abalma, vous intégrez un écosystème interconnecté, dynamique et centré sur l’utilisateur.",
            sub_transaction: "sous-transaction",
            view: 'Voir',
            delete:"Supprimer",
            welcome: "Bienvenue",
            login: "Se connecter",
            register: "Créer un compte",
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
                "allFieldsRequired": "Tous les champs sont obligatoires",
                resetRequestError: "Échec de la réinitialisation : l’adresse e-mail est introuvable dans notre base de données."
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

                  alertDelete: "Supprimer les utilisateurs",
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
                  supprimerProfil: "Supprimer compte",
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
                  confirmCode: "Entrez le code de confirmation qui vous a été envoyé par email",
                  validate:"Validate"
              },

              ListItemsFilterProduct : {
                 All: "Tous",
                 JOUET: "Jouets",
                 HABITS: "Habits",
                 MATERIELS_INFORMATIQUES: "Matériels Informatiques",
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
                 BIJOUX: "Bijous",
                 COSMETIQUES : "Cosmétiques", 
                 ALIMENTATION : "Alimentations",
                 MUSIQUE : "Musique",
                 noProduct: "Aucun produit n'est disponible"
             },

              forgetPswd: {
                  "title": "Mot de passe oublié",
                  "getCode": "Envoyer le code",
                  "code": "Code reçu",
                  "reset": "Réinitialiser le mot de passe",
                  "success": "Mot de passe réinitialisé avec succès !",
                  "step1": "Email ?",
                  "step2": "Code & Passe",
                  "step3": "Confirmation",
                  "redirectIn": "Redirection vers la page de connexion dans"
              }
        }
      }
   }

  });

export default i18n;
