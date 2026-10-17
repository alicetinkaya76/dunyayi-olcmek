import {cp,mkdir,writeFile,rm} from 'node:fs/promises';
// docs is a generated GitHub Pages publication directory.
await rm(new URL('../docs/',import.meta.url),{recursive:true,force:true});
await mkdir(new URL('../docs/',import.meta.url),{recursive:true});
await cp(new URL('../dist/',import.meta.url),new URL('../docs/',import.meta.url),{recursive:true});
await writeFile(new URL('../docs/.nojekyll',import.meta.url),'');
console.log('GitHub Pages publication prepared in docs/');
