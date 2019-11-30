import * as admin from "firebase-admin";
import * as serviceAccount from './service-account.json';

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

admin.initializeApp({
    // @ts-ignore
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://npc-bot.firebaseio.com"
});

export * from "./character";
export * from "./chatbot";

