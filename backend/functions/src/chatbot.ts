import * as functions from 'firebase-functions';
import * as  cors from 'cors';
import * as serviceAccount from './service-account.json';
import { SessionsClient }  from 'dialogflow';
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
    const agent = new WebhookClient({ request, response });

    console.log(JSON.stringify(request.body));

    const result = request.body.queryResult;

    function welcome(agent) {
        agent.add(`Welcome to my agent!`);
    }

    function fallback(agent) {
        agent.add(`Sorry, can you try again?`);
    }

    async function createCharacterHandler(agent) {
        // const db = admin.firestore();
        // const profile = db.collection('users').doc('jeffd23');
        //
        // const { name, color } = result.parameters;
        //
        // await profile.set({ name, color });
        agent.add(`Welcome aboard my friend!`);
    }


    let intentMap = new Map();
    intentMap.set('Default Welcome Intent', welcome);
    intentMap.set('Default Fallback Intent', fallback);
    intentMap.set('CreateCharacter', createCharacterHandler);
    agent.handleRequest(intentMap);
});
