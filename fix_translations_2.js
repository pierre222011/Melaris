const fs = require('fs');
const path = require('path');

const dir = 'src/messages';
const enFile = path.join(dir, 'en.json');
const en = JSON.parse(fs.readFileSync(enFile, 'utf8'));

// Simple deep merge that copies source over template
function mergeValidStrings(template, source) {
  const result = Array.isArray(template) ? [] : {};
  for (const key in template) {
    if (typeof template[key] === 'object' && template[key] !== null) {
      result[key] = mergeValidStrings(
        template[key], 
        (source && typeof source[key] === 'object') ? source[key] : {}
      );
    } else {
      // If source has a valid string for this key, use it, else template
      if (source && typeof source[key] === 'string') {
        result[key] = source[key];
      } else {
        result[key] = template[key];
      }
    }
  }
  return result;
}

['es', 'de', 'zh'].forEach(lang => {
  const file = path.join(dir, `${lang}.json`);
  let data = {};
  if (fs.existsSync(file)) {
    data = JSON.parse(fs.readFileSync(file, 'utf8'));
  }
  const merged = mergeValidStrings(en, data);
  fs.writeFileSync(file, JSON.stringify(merged, null, 2));
});
console.log('Done');
