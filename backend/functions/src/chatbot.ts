import * as functions from 'firebase-functions';
import * as  cors from 'cors';
import * as serviceAccount from './service-account.json';
// @ts-ignore
import { SessionsClient }  from 'dialogflow';
// @ts-ignore
import { WebhookClient } from 'dialogflow-fulfillment';
import * as character from './character'

const corsHandler = cors({origin: true});

export const dialogflowGateway = functions.https.onRequest((request, response) => {
    corsHandler(request, response, async () => {
        const { queryInput, sessionId } = request.body;

        const sessionClient = new SessionsClient({ credentials: serviceAccount });
        const session = sessionClient.sessionPath('npc-bot', sessionId);

        const responses = await sessionClient.detectIntent({ session, queryInput});

        const result = responses[0].queryResult;

        response.send(result);
    });
});

export const dialogflowWebhook = functions.https.onRequest(async (request, response) => {
    const client = new WebhookClient({ request, response });

    console.log(JSON.stringify(request.body));

    async function turnHandler(agent: any) {
        const attack = {hit: character.rollVal(2, 22)}
        const damage = [{ dmg: character.rollVal(1, 4), type: "fire"}];
        agent.add(`I move and attack with a roll of ${attack.hit}. If that hits, I deal ${damage[0].dmg} ${damage[0].type} damage.`);
    }

    async function createCharacterHandler(agent: any) {
        // const db = admin.firestore();
        // const profile = db.collection('users').doc('jeffd23');
        //
        // const { name, color } = result.parameters;
        //
        // await profile.set({ name, color });
        agent.add('Your Bot NPC has been created!');
    }

    const intentMap = new Map();
    intentMap.set('CreateCharacter', createCharacterHandler);
    intentMap.set('Turn', turnHandler);
    client.handleRequest(intentMap);
});
