import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { /* ICharacter, */ demoChar } from "./models";


export const getStats = functions.https.onRequest((req, res) => {
    console.info("Attempting to get stats... for: " + demoChar.name);

    res.send(demoChar);
});