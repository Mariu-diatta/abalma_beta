#!/usr/bin/env bash
#
# cleanup_abalma.sh
# Script de nettoyage du projet Abalma (frontend React)
#
# Usage :
#   ./cleanup_abalma.sh            -> mode SIMULATION (dry-run), ne supprime rien
#   ./cleanup_abalma.sh --force    -> supprime réellement les fichiers et met à jour .gitignore
#
# À exécuter depuis la RACINE du projet (le dossier où se trouve package.json)

set -euo pipefail

MODE="${1:-}"
DRY_RUN=true
if [ "$MODE" == "--force" ]; then
  DRY_RUN=false
fi

# Vérification qu'on est bien à la racine du projet
if [ ! -f "package.json" ]; then
  echo "❌ Erreur : lancez ce script depuis la racine du projet (là où se trouve package.json)."
  exit 1
fi

echo "=================================================="
if $DRY_RUN; then
  echo "🔍 MODE SIMULATION (dry-run) — rien ne sera supprimé."
  echo "   Relancez avec --force pour appliquer réellement les suppressions."
else
  echo "⚠️  MODE SUPPRESSION RÉELLE — les fichiers listés vont être supprimés."
fi
echo "=================================================="
echo ""

# --- Liste des fichiers / dossiers identifiés comme morts ou inutiles ---
TARGETS=(
  "abalma_beta"                                      # dossier vide fantôme
  ".vs"                                               # métadonnées Visual Studio
  "firebase-debug.log"                                # log de debug, fuite d'infos locales
  "public/_redirects_f"                               # fichier _redirects désactivé/inutile (Nginx gère déjà le SPA routing)
  "public/favicon_.ico"                                # doublon désactivé du favicon
  "src/hooks/useAuth.jsx"                              # fichier vide, risque de collision avec useAuth de AuthContext.jsx
  "src/hooks/useFetch.jsx"                             # fichier vide
  "src/features/CreatPdf.jsx"                          # fichier vide
  "src/assets/image_4.jpg"                             # 16 Mo, jamais importé dans le code
  "src/assets/image_5.jpg"                             # 6.4 Mo, jamais importé
  "src/assets/image.jpg"                               # jamais importé
  "src/assets/image_capture.PNG"                       # jamais importé
  "src/assets/logoApp.jpg"                              # jamais importé (le vrai logo est un SVG inline)
  "src/assets/express-delivery_1981844 (1).png"        # doublon de express-delivery_1981844.png
  "src/assets/background_home.jpg"                     # jamais importé
  "src/assets/home_5657414.png"                        # jamais importé
  "src/assets/icons8-hug-94.png"                       # jamais importé
  "src/assets/old-tv_3765513.png"                      # jamais importé
  "src/assets/packaging_1205899.png"                   # jamais importé
  "src/assets/products_1312205.png"                    # jamais importé
  "src/assets/software_992605.png"                     # jamais importé
  "src/assets/materiel_elec.png"                       # jamais importé
  "src/assets/books_6578221.png"                       # jamais importé
  "src/assets/24-hour-service.png"                     # jamais importé
  "src/assets/hobby.png"                               # jamais importé
  "src/assets/marketing_12033044.png"                  # jamais importé
)

TOTAL_SIZE_KB=0
DELETED_COUNT=0
NOT_FOUND_COUNT=0

for target in "${TARGETS[@]}"; do
  if [ -e "$target" ]; then
    size_kb=$(du -sk -- "$target" 2>/dev/null | cut -f1)
    size_kb=${size_kb:-0}
    TOTAL_SIZE_KB=$((TOTAL_SIZE_KB + size_kb))
    human_size=$(du -sh -- "$target" 2>/dev/null | cut -f1)

    if $DRY_RUN; then
      echo "🗑️  [À SUPPRIMER] $target ($human_size)"
    else
      rm -rf -- "$target"
      echo "✅ Supprimé : $target ($human_size)"
    fi
    DELETED_COUNT=$((DELETED_COUNT + 1))
  else
    echo "⏭️  Introuvable (déjà absent ou chemin différent) : $target"
    NOT_FOUND_COUNT=$((NOT_FOUND_COUNT + 1))
  fi
done

echo ""
echo "=================================================="
echo "Résumé : $DELETED_COUNT élément(s) traité(s), $NOT_FOUND_COUNT introuvable(s)."
echo "Espace concerné : environ $((TOTAL_SIZE_KB / 1024)) Mo."
echo "=================================================="
echo ""

# --- Mise à jour du .gitignore ---
GITIGNORE=".gitignore"
ENTRIES_TO_ADD=(
  ".env"
  "*.log"
  "firebase-debug.log"
  ".vs/"
)

if $DRY_RUN; then
  echo "📝 [SIMULATION] Lignes qui seraient ajoutées à $GITIGNORE (si absentes) :"
  for entry in "${ENTRIES_TO_ADD[@]}"; do
    if ! grep -qxF "$entry" "$GITIGNORE" 2>/dev/null; then
      echo "   + $entry"
    fi
  done
else
  echo "📝 Mise à jour de $GITIGNORE..."
  added_any=false
  for entry in "${ENTRIES_TO_ADD[@]}"; do
    if ! grep -qxF "$entry" "$GITIGNORE" 2>/dev/null; then
      if ! $added_any; then
        printf "\n# Ajouté par cleanup_abalma.sh\n" >> "$GITIGNORE"
        added_any=true
      fi
      echo "$entry" >> "$GITIGNORE"
      echo "   + ajouté : $entry"
    fi
  done
  if ! $added_any; then
    echo "   (rien à ajouter, déjà à jour)"
  fi
fi

echo ""
echo "⚠️  IMPORTANT — actions manuelles à faire en plus :"
echo ""
echo "  1. Le fichier .env contient des clés (PAYPAL_CLIENT_ID, API_KEY)."
echo "     Si ce repo a déjà été poussé sur GitHub/GitLab, ces clés sont"
echo "     potentiellement visibles dans l'historique git. Ce script ne"
echo "     nettoie PAS l'historique git : régénérez/révoquez ces clés par"
echo "     précaution, et envisagez 'git filter-repo' ou BFG si besoin de"
echo "     purger l'historique."
echo ""
echo "  2. Si certains des fichiers supprimés étaient déjà suivis par git,"
echo "     un simple 'rm' ne suffit pas pour git : faites aussi :"
echo "       git rm -r --cached <fichier_ou_dossier>"
echo "     avant de committer, sinon git les recréera au prochain commit."
echo ""
echo "  3. Pensez à corriger src/cors.json pour autoriser votre domaine de"
echo "     production (pas seulement localhost:3000) si ce fichier est bien"
echo "     appliqué à votre bucket Firebase Storage / GCS."
echo ""

if $DRY_RUN; then
  echo "👉 Pour appliquer ces changements, relancez :"
  echo "     ./cleanup_abalma.sh --force"
fi