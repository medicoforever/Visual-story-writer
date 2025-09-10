
import { type SampleStory } from '../types';

export const aliceInWonderland: SampleStory = {
  text: `Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, “and what is the use of a book,” thought Alice “without pictures or conversations?” So she was considering in her own mind (as well as she could, for the hot day made her feel very sleepy and stupid), whether the pleasure of making a daisy-chain would be worth the trouble of getting up and picking the daisies, when suddenly a White Rabbit with pink eyes ran close by her. There was nothing so very remarkable in that; nor did Alice think it so very much out of the way to hear the Rabbit say to itself, “Oh dear! Oh dear! I shall be late!” but when the Rabbit actually took a watch out of its waistcoat-pocket, and looked at it, and then hurried on, Alice started to her feet, for it flashed across her mind that she had never before seen a rabbit with either a waistcoat-pocket, or a watch to take out of it, and burning with curiosity, she ran across the field after it, and fortunately was just in time to see it pop down a large rabbit-hole under the hedge.`,
  entities: [
    {
      "name": "Alice",
      "emoji": "👧",
      "properties": [
        { "name": "tired", "value": 8 },
        { "name": "bored", "value": 7 },
        { "name": "curious", "value": 9 }
      ]
    },
    {
      "name": "Sister",
      "emoji": "👩",
      "properties": [
        { "name": "studious", "value": 7 }
      ]
    },
    {
      "name": "Book",
      "emoji": "📖",
      "properties": [
        { "name": "uninteresting", "value": 9 }
      ]
    },
    {
      "name": "White Rabbit",
      "emoji": "🐇",
      "properties": [
        { "name": "anxious", "value": 9 },
        { "name": "well-dressed", "value": 8 }
      ]
    },
  ],
  locations: [
    { "name": "The Bank", "emoji": "🏞️" },
    { "name": "The Field", "emoji": "🌾" },
    { "name": "Rabbit-hole", "emoji": "🕳️" },
  ],
  actions: [
    {
      "name": "sitting by",
      "source": "Alice",
      "target": "Sister",
      "location": "The Bank",
      "passage": "Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do"
    },
    {
      "name": "peeped into",
      "source": "Alice",
      "target": "Book",
      "location": "The Bank",
      "passage": "once or twice she had peeped into the book her sister was reading"
    },
    {
      "name": "ran close by",
      "source": "White Rabbit",
      "target": "Alice",
      "location": "The Bank",
      "passage": "when suddenly a White Rabbit with pink eyes ran close by her."
    },
    {
      "name": "ran after",
      "source": "Alice",
      "target": "White Rabbit",
      "location": "The Field",
      "passage": "burning with curiosity, she ran across the field after it"
    },
    {
      "name": "pop down",
      "source": "White Rabbit",
      "target": "Rabbit-hole",
      "location": "The Field",
      "passage": "and fortunately was just in time to see it pop down a large rabbit-hole under the hedge."
    }
  ]
};
