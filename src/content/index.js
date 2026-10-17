// Turkish is implemented. Future locales can provide the same Markdown schema.
export const localeRegistry = { tr:{label:'Türkçe',dir:'ltr',available:true}, en:{label:'English',dir:'ltr',available:false}, ar:{label:'العربية',dir:'rtl',available:false} };
const documents=import.meta.glob('./tr/*.md',{query:'?raw',import:'default',eager:true});
function parseDocument(raw){const match=raw.match(/^---\n([\s\S]+?)\n---\n([\s\S]*)$/);if(!match)throw new Error('Invalid chapter Markdown');return {...JSON.parse(match[1]),story:match[2].trim().split(/\n\s*\n/)};}
export const chapters=Object.values(documents).map(parseDocument).sort((a,b)=>a.year-b.year);
export function getLocale(locale='tr'){return localeRegistry[locale]?.available?locale:'tr';}
