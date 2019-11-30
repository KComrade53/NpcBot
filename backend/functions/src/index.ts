import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { /* ICharacter, */ demoChar } from "./models";

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

admin.initializeApp();

// export const helloWorld = functions.https.onRequest((request, response) => {
//     response.send("Hello from Firebase!");
// });

export const getStats = functions.https.onRequest((req, res) => {
    res.send({ demoChar });
});
