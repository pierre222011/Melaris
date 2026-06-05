const fs = require('fs');
const path = require('path');

const dir = 'src/messages';

// 1. Load en and fr
const enFile = path.join(dir, 'en.json');
const frFile = path.join(dir, 'fr.json');
const en = JSON.parse(fs.readFileSync(enFile, 'utf8'));
const fr = JSON.parse(fs.readFileSync(frFile, 'utf8'));

// 2. Update EN Pricing
en.Pricing = {
  ...en.Pricing,
  Pro_desc: "Unlock the power of Melaris AI tools.",
  Premium_desc: "Maximum power for serious creators.",
  Shop_title: "Melacoins Shop",
  Shop_subtitle: "Need more credits? Top up your balance with one-time packs.",
  Best_value: "Best Value",
  Buy_now: "Buy Now"
};
// Remove unused keys
delete en.Pricing.Supporter_desc;
delete en.Pricing.Supporter_feat_1;
delete en.Pricing.Supporter_feat_2;
delete en.Pricing.Supporter_cta;

// 3. Update FR Pricing
fr.Pricing = {
  ...fr.Pricing,
  Pro_desc: "Débloquez la puissance des outils IA de Melaris.",
  Premium_desc: "Puissance maximale pour les créateurs sérieux.",
  Shop_title: "Boutique Melacoins",
  Shop_subtitle: "Besoin de plus de crédits ? Rechargez votre solde avec des packs uniques.",
  Best_value: "Meilleur rapport",
  Buy_now: "Acheter"
};
// Remove unused keys
delete fr.Pricing.Supporter_desc;
delete fr.Pricing.Supporter_feat_1;
delete fr.Pricing.Supporter_feat_2;
delete fr.Pricing.Supporter_cta;

fs.writeFileSync(enFile, JSON.stringify(en, null, 2));
fs.writeFileSync(frFile, JSON.stringify(fr, null, 2));

// 4. Merge EN into other languages to prevent missing keys
const langs = ['es', 'de', 'zh', 'ja'];
function deepMergeFallback(target, source) {
  for (const key of Object.keys(source)) {
    if (source[key] instanceof Object && !Array.isArray(source[key])) {
      if (!target[key]) target[key] = {};
      deepMergeFallback(target[key], source[key]);
    } else {
      if (target[key] === undefined) {
        target[key] = source[key];
      }
    }
  }
}

for (const lang of langs) {
  const file = path.join(dir, `${lang}.json`);
  let data = {};
  if (fs.existsSync(file)) {
    data = JSON.parse(fs.readFileSync(file, 'utf8'));
  }
  deepMergeFallback(data, en);
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

console.log('Translations fixed successfully.');
