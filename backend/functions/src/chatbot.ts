import * as functions from 'firebase-functions';
import * as  cors from 'cors';
import * as serviceAccount from './service-account.json';
import * as http from 'request';
// @ts-ignore
import { SessionsClient }  from 'dialogflow';
// @ts-ignore
import { WebhookClient } from 'dialogflow-fulfillment';

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
        await http('https://us-central1-npc-bot.cloudfunctions.net/rollAttack', {json: true}, (err: any, res: any, body: any) => {
            if(err) {
                console.log(err)
            }
            console.log(body);
            agent.add(`I move and attack for`);
        });
    }

    async function createCharacterHandler(agent: any) {
        // const db = admin.firestore();
        // const profile = db.collection('users').doc('jeffd23');
        //
        // const { name, color } = result.parameters;
        //
        // await profile.set({ name, color });
        agent.add(`Welcome aboard my friend!`);
    }


    const intentMap = new Map();
    await intentMap.set('CreateCharacter', createCharacterHandler);
    await intentMap.set('Turn', turnHandler);
    await client.handleRequest(intentMap);
});
