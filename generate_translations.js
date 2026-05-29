const fs = require('fs');

// We will parse the featuresData array from src/data/features.ts
// Since it's a TS file with exports, we can extract the content using a simple regex or by executing it if we compile it.
// Let's just read it as text and extract titles and descriptions.

const tsContent = fs.readFileSync('src/data/features.ts', 'utf-8');

// Match objects in the array
const regex = /title:\s*'([^']+)',\s*category:\s*'[^']+',\s*description:\s*'([^']+)',\s*tooltipText:\s*'([^']+)'/g;
let match;
const featuresEn = {};
const featuresFr = {};

// Hardcoded French translations for the 44 features to ensure high quality
const frTranslations = {
  'Minecraft Story Map Generator': { title: 'Générateur de Maps Histoire Minecraft', desc: 'Générateur de maps Minecraft basé sur une histoire écrite.', tooltip: 'Utilise des LLM pour analyser les arcs narratifs et générer des commandes.' },
  'Minecraft RP Quest AI': { title: 'IA Quêtes Minecraft RP', desc: 'IA qui crée automatiquement des quêtes Minecraft RP.', tooltip: 'Génère dynamiquement des PNJ, des dialogues et des objectifs cohérents.' },
  'HD Minecraft Skin AI': { title: 'IA Skins Minecraft HD', desc: 'IA qui transforme un skin Minecraft en skin HD réaliste.', tooltip: 'Utilise des modèles de diffusion pour upscaler le pixel art en 3D haute résolution.' },
  'Minecraft Build to Tutorial': { title: 'Tuto de Construction Minecraft', desc: 'Transforme des captures d\'écran de constructions en tutoriel étape par étape.', tooltip: 'L\'IA visuelle analyse les couches de blocs pour créer un guide.' },
  'Roblox Lua Assistant': { title: 'Assistant Lua Roblox', desc: 'Assistant Roblox Studio qui corrige les scripts Lua automatiquement.', tooltip: 'Entraîné sur l\'API Roblox pour déboguer et optimiser le code Luau.' },
  'Discord to Wiki': { title: 'Discord vers Wiki', desc: 'Site qui transforme un serveur Discord gaming en wiki automatique.', tooltip: 'Scrape les messages épinglés et les FAQ pour créer une base de connaissances.' },
  'Discord Event Creator': { title: 'Créateur d\'Événements Discord', desc: 'Créateur automatique d\'événements pour serveurs Discord.', tooltip: 'Analyse l\'activité du serveur pour proposer et planifier des événements communautaires.' },
  'Funny Discord Summarizer': { title: 'Résumé Discord Humoristique', desc: 'IA qui transforme les conversations Discord en résumé drôle.', tooltip: 'Utilise le NLP pour extraire les blagues et moments clés de l\'historique.' },
  'Gaming Thumbnail AI': { title: 'IA Miniatures Gaming', desc: 'IA qui crée des miniatures YouTube gaming cohérentes avec le gameplay.', tooltip: 'Extrait les meilleures scènes d\'action et applique un style optimisé pour le clic.' },
  'Custom Fortnite Challenges': { title: 'Défis Fortnite Sur Mesure', desc: 'IA qui propose des défis Fortnite personnalisés.', tooltip: 'Génère des règles et des lieux de drop pour votre prochain stream.' },
  'Gaming Inspiration Assistant': { title: 'Assistant Inspiration Gaming', desc: 'Assistant "anti-panne d\'inspiration" pour créateurs gaming.', tooltip: 'Croise les jeux tendance avec votre style pour suggérer du contenu.' },
  'NPC Dialogue Generator': { title: 'Générateur de Dialogues PNJ', desc: 'IA qui génère automatiquement des dialogues de PNJ.', tooltip: 'Se connecte à un LLM local pour générer des arbres de dialogue contextuels.' },
  'Ultra-Short Notes Generator': { title: 'Générateur de Fiches Ultra-Courtes', desc: 'Générateur de fiches de révision ultra-courtes pour collégiens.', tooltip: 'Simplifie les concepts complexes en 3 points clés maximum.' },
  'PDF to Quiz': { title: 'PDF vers Quiz', desc: 'Site qui transforme un PDF en quiz interactif.', tooltip: 'Extrait les faits clés et génère des questions à choix multiples.' },
  'Homework Explainer AI': { title: 'IA Explicateur de Devoirs', desc: 'IA qui explique les devoirs niveau collège/lycée.', tooltip: 'IA socratique qui guide l\'élève sans donner les réponses directes.' },
  'Auto Mind Maps': { title: 'Cartes Mentales Auto', desc: 'IA qui crée des cartes mentales automatiques.', tooltip: 'Analyse le texte pour construire des cartes relationnelles visuelles.' },
  'Lesson to Interactive Game': { title: 'Leçon vers Jeu Interactif', desc: 'Site qui transforme une leçon en jeu interactif.', tooltip: 'Génère des mini-jeux web basés sur des faits historiques ou des formules.' },
  'Auto Test Creator': { title: 'Créateur de Contrôles Auto', desc: 'Site qui crée des contrôles scolaires automatiquement.', tooltip: 'Génère des examens équilibrés avec différents niveaux de difficulté.' },
  'Photo to MCQ': { title: 'Photo vers QCM', desc: 'Générateur de QCM à partir d\'une photo.', tooltip: 'Utilise l\'IA visuelle pour lire les manuels et générer des questions.' },
  'ADHD/Dyslexia Rewriter': { title: 'Réécrivain TDAH/Dyslexie', desc: 'IA qui réécrit les cours pour TDAH/dyslexie.', tooltip: 'Applique la lecture bionique et découpe les murs de texte en parties digestes.' },
  'Custom Mock Exams': { title: 'Examens Blancs Sur Mesure', desc: 'Générateur de devoirs blancs personnalisés.', tooltip: 'S\'adapte aux faiblesses de l\'élève pour générer un entraînement ciblé.' },
  'Auto File Organizer': { title: 'Organiseur de Fichiers Auto', desc: 'IA qui organise les fichiers automatiquement.', tooltip: 'Trie votre bureau et vos documents en analysant leur contenu.' },
  'Idea to 30 Shorts': { title: 'Une Idée vers 30 Shorts', desc: 'Site qui transforme une idée en 30 scripts de Shorts.', tooltip: 'Applique des structures virales pour générer un mois de contenu.' },
  'Meta Creator Assistant': { title: 'Assistant Créateur Meta', desc: 'Assistant qui crée miniatures + titres + hashtags cohérents.', tooltip: 'Génération de packages optimisés pour le SEO et les clics.' },
  'Infinite YouTube Ideas': { title: 'Idées YouTube Infinies', desc: 'Générateur d\'idées YouTube infinies par niche.', tooltip: 'Analyse votre audience pour trouver des sujets inexploités.' },
  'TikTok Trend Assistant': { title: 'Assistant Tendances TikTok', desc: 'Assistant TikTok basé sur les tendances en temps réel.', tooltip: 'Scrape les audios et formats tendances avant qu\'ils ne s\'essoufflent.' },
  'Optimized YT Descriptions': { title: 'Descriptions YT Optimisées', desc: 'Site qui génère des descriptions YouTube optimisées.', tooltip: 'Inclut des chapitres, des mots-clés SEO et le formatage des liens d\'affiliation.' },
  'Viral Potential Predictor': { title: 'Prédicteur de Potentiel Viral', desc: 'IA qui prédit le potentiel viral d\'une vidéo.', tooltip: 'Analyse le rythme, la rétention et la force de l\'accroche.' },
  'Auto Content Calendar': { title: 'Calendrier de Contenu Auto', desc: 'Site qui crée un calendrier de contenu automatique.', tooltip: 'Répartit les piliers de contenu sur la semaine pour une portée maximale.' },
  'Room/Setup Organizer AI': { title: 'IA Organiseur de Setup', desc: 'IA qui aide à organiser une chambre ou un setup gaming.', tooltip: 'Uploadez une photo et obtenez un plan 3D du placement optimal.' },
  'Fridge to Recipes': { title: 'Frigo vers Recettes', desc: 'Site qui transforme une photo de frigo en recettes.', tooltip: 'Identifie les ingrédients et suggère des repas avec ce que vous avez.' },
  'Family Organizer Assistant': { title: 'Assistant Organiseur Familial', desc: 'Assistant d\'organisation pour parents/enfants.', tooltip: 'Synchronise les emplois du temps et gamifie les tâches ménagères.' },
  'Custom Routine AI': { title: 'IA Routine Sur Mesure', desc: 'IA qui crée des routines personnalisées.', tooltip: 'S\'adapte à votre chronotype et à votre niveau d\'énergie.' },
  'Goals to Mini-Missions': { title: 'Objectifs vers Mini-Missions', desc: 'Site qui transforme les objectifs en mini-missions.', tooltip: 'Applique les mécaniques des RPG à la productivité réelle.' },
  'Ultra-Simplified Travel AI': { title: 'IA Voyage Ultra-Simplifiée', desc: 'Assistant de voyage ultra-simplifié.', tooltip: 'Génère des itinéraires jour par jour selon l\'ambiance et le budget.' },
  'Auto List Generator': { title: 'Générateur de Listes Auto', desc: 'Générateur automatique de listes.', tooltip: 'Listes de bagages, courses, toutes générées selon le contexte.' },
  'Budget Weekend Planner': { title: 'Planificateur Week-end Budget', desc: 'IA qui planifie un week-end selon un budget.', tooltip: 'Trouve des activités et transports strictement dans vos limites.' },
  'Goal Progression Tree': { title: 'Arbre de Progression d\'Objectifs', desc: 'IA qui transforme les objectifs en arbre de progression.', tooltip: 'Cartographie visuelle de compétences pour le développement personnel.' },
  'Budget Family Menus': { title: 'Menus Familiaux Budget', desc: 'IA qui crée des menus selon le budget familial.', tooltip: 'Optimise la nutrition par euro dépensé.' },
  'Friend Challenges': { title: 'Défis Entre Amis', desc: 'Site qui génère des défis entre amis.', tooltip: 'Gages et paris personnalisés selon la dynamique du groupe.' },
  'Story Character AI': { title: 'IA Personnages d\'Histoire', desc: 'IA qui crée des personnages cohérents pour des histoires.', tooltip: 'Maintient des bibles de personnages avec des profils psychologiques profonds.' },
  'Song to Visual Universe': { title: 'Chanson vers Univers Visuel', desc: 'Site qui transforme une chanson en univers visuel.', tooltip: 'Analyse les paroles pour générer un moodboard et un lore.' },
  'Text to RPG Quest': { title: 'Texte vers Quête RPG', desc: 'Site qui transforme un texte en quête RPG.', tooltip: 'Aventures textuelles jouables générées à partir d\'un prompt.' },
  'Simple Conlang Gen': { title: 'Générateur de Langues', desc: 'Générateur de langues fictives simples.', tooltip: 'Crée une phonologie, un vocabulaire et des règles de grammaire.' }
};

while ((match = regex.exec(tsContent)) !== null) {
  const title = match[1];
  const desc = match[2];
  const tooltip = match[3];
  
  const key = title.toLowerCase().replace(/[^a-z0-9]/g, '_');
  
  featuresEn[key] = {
    title: title,
    description: desc,
    tooltip: tooltip
  };
  
  const fr = frTranslations[title];
  featuresFr[key] = {
    title: fr ? fr.title : title,
    description: fr ? fr.desc : desc,
    tooltip: fr ? fr.tooltip : tooltip
  };
}

// Read existing JSON
const enJson = JSON.parse(fs.readFileSync('src/messages/en.json', 'utf-8'));
const frJson = JSON.parse(fs.readFileSync('src/messages/fr.json', 'utf-8'));

enJson.Features = featuresEn;
frJson.Features = featuresFr;

fs.writeFileSync('src/messages/en.json', JSON.stringify(enJson, null, 2));
fs.writeFileSync('src/messages/fr.json', JSON.stringify(frJson, null, 2));

console.log('Translations generated successfully!');
