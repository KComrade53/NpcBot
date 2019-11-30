export interface ICharacter {
    name: string,
    owner: string,
    stats: {
        hpMax: number,
        hpCur: number,
        acMax: number,
        acCur: number,
        hitDiceMax: number,
        hitDiceCur: number,
        hitDiceAmnt: number,
        core: {
            strength: number,
            dexterity: number,
            constitution: number,
            intelligence: number,
            wisdom: number,
        },
        inititative: number,
        speed: number,
    },
    actions: IAction[],
    // inventory: {},
};

export interface IAction {
    desc: string,
    hitBonus: number,
    dmg: IDamage[],
}

export interface IDamage {
    dmgMax: number,
    dmgMin: number,
    dmgType: damageType
}

export enum damageType {
    fire = "fire",
    bludge = "bludgeoning",
    slash = "slashing",
    pierce = "piercing",
    ice = "ice",
    radiant = "radiant",
}

export const demoAction: IAction = {
    desc: "Knife",
    hitBonus: 2,
    dmg: [{
        dmgMax: 4,
        dmgMin: 1,
        dmgType: damageType.pierce,
    }],
};

export const demoChar: ICharacter = {
    name: "Taryon Darrington",
    owner: "DmKO7iIYkDBGEqKx7SQL", // "Kyle Test"
    stats: {
        hpMax: 40,
        hpCur: 37,
        acMax: 16,
        acCur: 16,
        hitDiceMax: 4,
        hitDiceCur: 4,
        hitDiceAmnt: 8,
        core: {
            strength: 10,
            dexterity: 10,
            constitution: 10,
            intelligence: 10,
            wisdom: 10,
        },
        inititative: 11,
        speed: 30,
    },
    actions: [
        demoAction,
    ],
};
