import * as admin from "firebase-admin";
import { ICharacter, DamageType, IDamage, IDamageArray } from "../models";

class CharacterControllerClass {

    readonly characterId = "9OwrThTSDUtQGtfHxVNH"; // Each function should instead get passed this as a real value

    async getCharacterByID(charId: string): Promise<ICharacter> {
        try {
            const charDoc = await admin.firestore().collection("character").doc(charId).get();
            const character: ICharacter = <ICharacter>charDoc.data();

            if (!character) {
                console.error("No matching character found in db with ID: " + charId);
                throw new Error("No matching character found in db");
            }

            return character;
        } catch (err) {
            console.error("Error getting character", err);
            throw new Error("Failed to get character by ID");
        }
    }

    async initiateAttack() {
        try {
            const character = await this.getCharacterByID(this.characterId);
            let hit: number = this.rollVal(0, 20);

            /* Critical Hit */
            if (hit === 20) {
                const critRoll = this.getDamage(character);
                const attack = character.actions[0].dmg[0];
                const critDmg = { dmg: (critRoll[0].dmg + attack.dmgMax), type: attack.dmgType };

                return ({ status: "crit", critDmg });
            }

            hit += character.actions[0].hitBonus || 0;

            return ({ status: "roll", hit })
        } catch (err) {
            console.error("Error rolling attack", err);
            throw new Error("Failed to roll attack");
        }
    }

    async initiateDamage() {
        try {
            const character = await this.getCharacterByID(this.characterId);

            const output = this.getDamage(character);
            return output;
        } catch (err) {
            console.error("Error rolling damage", err);
            throw new Error("Failed to roll damage");
        }
    }

    async hitChar(attack: number): Promise<boolean> {
        try {
            const character = await this.getCharacterByID(this.characterId);

            return (attack >= character.stats.acCur);
        } catch (err) {
            console.error("Error determining if attack hits", err);
            throw new Error("Failed to determine if attack hits");
        }
    }

    async damageChar(damage: IDamage[] = [{ dmg: 5, type: DamageType.fire }, { dmg: 2, type: DamageType.slash }]): Promise<boolean> {
        try {
            const character = await this.getCharacterByID(this.characterId);
            const sources: IDamageArray = {};
            let newHp: number = character.stats.hpCur;

            // TODO factor in resistances
            damage.map((d) => {
                sources[d.type] = d.dmg;
            });

            for (const type in sources) {
                console.info(`Dealing ${sources[type]} ${type} damage`);
                newHp -= sources[type];
            }

            // Update character's hp in db to newHp

            return (newHp > 0); // true: alive, false: down/dead
        } catch (err) {
            console.error("Error dealing damage to character", err);
            throw new Error("Failed to deal damage to character");
        }
    }

    getDamage(character: ICharacter) {
        const attack = character.actions[0].dmg[0];

        const dmg: number = this.rollVal(attack.dmgMin, attack.dmgMax);
        const output = [{ dmg, type: attack.dmgType }];
        return output;
    }

    rollVal(min: number, max: number) {
        const val: number = Math.floor(Math.random() * (max - min + 1) + min);

        return val;
    }
}

export const CharacterController = new CharacterControllerClass();
