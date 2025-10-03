// {
//   "name": "Quote",
//   "type": "object",
//   "properties": {
//     "text": {
//       "type": "string",
//       "description": "The quote text"
//     },
//     "author": {
//       "type": "string",
//       "description": "Quote author"
//     },
//     "category": {
//       "type": "string",
//       "enum": [
//         "motivation",
//         "love",
//         "success",
//         "wisdom",
//         "life"
//       ],
//       "description": "Quote category"
//     }
//   },
//   "required": [
//     "text",
//     "author",
//     "category"
//   ]
// }

export const Quote = [
  {
    id: 1244,
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
    category: "success"
  },
  {
    id: 1233,
    text: "In the middle of every difficulty lies opportunity.",
    author: "Albert Einstein",
    category: "motivation"
  },
  {
    id: 1209,
    text: "Love is composed of a single soul inhabiting two bodies.",
    author: "Aristotle",
    category: "love"
  },
  {
    id: 1259,
    text: "Life is really simple, but we insist on making it complicated.",
    author: "Confucius",
    category: "life"
  }
]