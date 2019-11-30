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
    // actions: {},
    // inventory: {},
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
};

// • Char_id - int
// • Name - string
// • Strength - int
// • Dexterity - int
// • Constitution - int
// • Intelligence - int
// • Wisdom - int
// • Charisma - int
// • Initiative - int
// • HP_max - int
// • HP_current - int
// • AC_max - int
// • AC_current - int
// • Hit_dice_max - int
// • Hit_dice_current - int
// Speed - int