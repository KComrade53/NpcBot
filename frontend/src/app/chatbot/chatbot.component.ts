import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})

// Chatbot https://fireship.io/lessons/build-a-chatbot-with-dialogflow/
export class ChatbotComponent implements OnInit {

  dialogflowURL = 'https://us-central1-npc-bot.cloudfunctions.net/dialogflowGateway';
  messages = [];
  loading = false;

  // Random ID to maintain session with server
  sessionId = Math.random().toString(36).slice(-5);

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.addBotMessage('Greetings adventurer! How may I be of assistance?');
  }

  handleUserMessage(event) {
    console.log(event);
    const text = event.message;
    this.addUserMessage(text);

    this.loading = true;

    // Make an HTTP Request
    this.http.post<any>(
      this.dialogflowURL,
      {
        sessionId: this.sessionId,
        queryInput: {
          text: {
            text,
            languageCode: 'en-US'
          }
        }
      }
    ).subscribe(res => {
      this.addBotMessage(res.fulfillmentText);
      this.loading = false;
    });
  }

  // Helpers
  addUserMessage(text) {
    this.messages.push({
      text,
      sender: 'You',
      reply: true,
      date: new Date()
    });
  }

  addBotMessage(text) {
    this.messages.push({
      text,
      sender: 'Bot',
      avatar: '/assets/d20.png',
      date: new Date()
    });
  }
}
