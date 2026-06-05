const fs = require('fs');
const path = require('path');

const dir = 'src/messages';
const enFile = path.join(dir, 'en.json');
const frFile = path.join(dir, 'fr.json');

const en = JSON.parse(fs.readFileSync(enFile, 'utf8'));
const fr = JSON.parse(fs.readFileSync(frFile, 'utf8'));

const sidebarEn = {
  "Dashboard": "Dashboard",
  "Roadmap": "Roadmap",
  "All Categories": "All Categories",
  "Gaming": "Gaming",
  "Fortnite": "Fortnite",
  "Roblox": "Roblox",
  "Minecraft": "Minecraft",
  "Education": "Education",
  "Productivity": "Productivity",
  "Discord Tools": "Discord Tools",
  "AI Video": "AI Video",
  "Real Life Tools": "Real Life Tools",
  "Storytelling": "Storytelling",
  "Labs": "Labs",
  "Vision": "Vision",
  "Platform Status": "Platform Status",
  "All systems operational": "All systems operational",
  "Search": "Search..."
};

const sidebarFr = {
  "Dashboard": "Tableau de bord",
  "Roadmap": "Feuille de route",
  "All Categories": "Toutes les catégories",
  "Gaming": "Jeux vidéo",
  "Fortnite": "Fortnite",
  "Roblox": "Roblox",
  "Minecraft": "Minecraft",
  "Education": "Éducation",
  "Productivity": "Productivité",
  "Discord Tools": "Outils Discord",
  "AI Video": "Vidéo IA",
  "Real Life Tools": "Outils du quotidien",
  "Storytelling": "Écriture / Histoires",
  "Labs": "Labo Expérimental",
  "Vision": "Vision",
  "Platform Status": "État de la plateforme",
  "All systems operational": "Tous les systèmes sont opérationnels",
  "Search": "Rechercher..."
};

en.Sidebar = sidebarEn;
fr.Sidebar = sidebarFr;

fs.writeFileSync(enFile, JSON.stringify(en, null, 2));
fs.writeFileSync(frFile, JSON.stringify(fr, null, 2));

function mergeFallback(template, source) {
  const result = {};
  for (const key in template) {
    if (typeof template[key] === 'object' && template[key] !== null) {
      result[key] = mergeFallback(template[key], (source && typeof source[key] === 'object') ? source[key] : {});
    } else {
      if (source && source[key] !== undefined && typeof source[key] !== 'object') {
        result[key] = source[key];
      } else {
        result[key] = template[key];
      }
    }
  }
  return result;
}

['es', 'de', 'zh', 'ja'].forEach(lang => {
  const file = path.join(dir, `${lang}.json`);
  let data = {};
  if (fs.existsSync(file)) {
    data = JSON.parse(fs.readFileSync(file, 'utf8'));
  }
  const merged = mergeFallback(en, data);
  fs.writeFileSync(file, JSON.stringify(merged, null, 2));
});
console.log('All translations fixed and synced.');
