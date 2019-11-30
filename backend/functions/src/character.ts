import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { ICharacter, demoChar } from "./models";

// For future
export const addCharacter = functions.https.onRequest(async (req, res) => {
    try {
        const curUser = await admin.firestore().collection("user").doc(demoChar.owner).get();
        const userInfo = curUser.data();
        console.info("User found: ", userInfo);

        if (userInfo) {
            const newCharRef = await admin.firestore().collection("character").add(demoChar);

            if (!newCharRef) {
                console.error("Failed to create character");
                throw new Error("Error creating character in db");
            }

            console.info(`Created new character with ID: ${newCharRef.id}`);
            res.sendStatus(200);
        }

    } catch (err) {
        console.error("Error occurred creating character", err);
        res.sendStatus(500);
    }
});

export const getStats = functions.https.onRequest(async (req, res) => {
    console.info("Attempting to get stats... for: " + demoChar.name);

    try {
        // Move this to user.ts
        const curUser = await admin.firestore().collection("user").doc(demoChar.owner).get();
        const userInfo = curUser.data();
        console.info("User found: ", userInfo);

        if (userInfo) {
            const charQuery = await admin.firestore().collection("character").where("owner", "==", demoChar.owner).where("name", "==", demoChar.name);
            const charDoc: ICharacter = <ICharacter>(await charQuery.get()).docs[0].data();

            if (!charDoc) {
                console.error("Failed to get character to db");
                throw new Error("Error getting character from db");
            }

            // const character: ICharacter = <ICharacter>(await charDoc.get()).data();
            res.send(charDoc);
        } else {
            console.error(`No user found with id: ${demoChar.owner}`);
            throw new Error("No user found");
        }

    } catch (err) {
        console.error("Error occurred getting stats", err);
        res.sendStatus(500);
    }
});

export const rollAttack = functions.https.onRequest(async (req, res) => {
    console.info("Rolling an attack");

    try {
        const output = await initiateAttack();
        res.status(200).send(output);
    } catch (err) {
        res.sendStatus(500);
    }
});

export const rollDamage = functions.https.onRequest(async (req, res) => {
    console.info("Rolling an attack");

    try {
        const output = await initiateDamage();
        res.status(200).send({ output });
    } catch (err) {
        res.sendStatus(500);
    }
});

function getDamage(character: ICharacter) {
    const attack = character.actions[0].dmg[0];

    const dmg: number = rollVal(attack.dmgMin, attack.dmgMax);
    const output = [{ dmg, type: attack.dmgType }];
    return output;
}

export function rollVal(min: number, max: number) {
    const val: number = Math.floor(Math.random() * (max - min + 1) + min);

    return val;
}

export async function initiateAttack() {
    const characterId = "9OwrThTSDUtQGtfHxVNH";

    try {
        const charDoc = await admin.firestore().collection("character").doc(characterId).get();
        const character: ICharacter = <ICharacter>charDoc.data();

        if (!character) {
            console.error("Failed to find character for attack roll");
            throw new Error("Error finding character in db for attack roll");
        }

        let hit: number = rollVal(0, 20);

        /* Critical Hit */
        // if (hit === 20) {
        //     const critRoll = getDamage(character);
        //     const attack = character.actions[0].dmg[0];
        //     const critDmg = { dmg: (critRoll[0].dmg + attack.dmgMax), type: attack.dmgType };

        //     res.status(200).send({ status: "crit", critDmg });
        // }

        hit += character.actions[0].hitBonus || 0;

        return ({ status: "roll", hit })
    } catch (err) {
        console.error("Error rolling attack", err);
        throw err;
    }
}

export async function initiateDamage() {
    const characterId = "9OwrThTSDUtQGtfHxVNH";

    try {
        const charDoc = await admin.firestore().collection("character").doc(characterId).get();
        const character: ICharacter = <ICharacter>charDoc.data();

        if (!character) {
            console.error("Failed to find character for attack roll");
            throw new Error("Error finding character in db for attack roll");
        }

        const output = getDamage(character);
        return output;
    } catch (err) {
        console.error("Error rolling damage", err);
        throw err;
    }
}
