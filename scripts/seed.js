import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { competitors, hireglobal, objectionHandling, discovery } from './seedData.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const keyPath = resolve(root, 'serviceAccountKey.json');

let serviceAccount;
try {
  serviceAccount = JSON.parse(readFileSync(keyPath, 'utf8'));
} catch {
  console.error(
    `Could not read ${keyPath}\n\n` +
      'Firebase console > Project settings > Service accounts > Generate new private key,\n' +
      'then save the downloaded file as serviceAccountKey.json in the project root.',
  );
  process.exit(1);
}

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

const batch = db.batch();

for (const [id, data] of Object.entries(competitors)) {
  batch.set(db.collection('competitors').doc(id), data);
}
batch.set(db.collection('content').doc('hireglobal'), hireglobal);
batch.set(db.collection('content').doc('objectionHandling'), objectionHandling);
batch.set(db.collection('content').doc('discovery'), discovery);

await batch.commit();

console.log(`Seeded project ${serviceAccount.project_id}`);
console.log(`  competitors/  ${Object.keys(competitors).join(', ')}`);
console.log('  content/      hireglobal, objectionHandling, discovery');
