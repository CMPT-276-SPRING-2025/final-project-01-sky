// openai api handling route

// load environment variables
require('dotenv').config();

import { OpenAI } from 'openai'; 

export default async function handler(req, res) {
  // initialize OpenAI with the API key from environment variables
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

}