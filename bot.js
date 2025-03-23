require('dotenv').config();
const { Telegraf } = require('telegraf');
const LocalSession = require('telegraf-session-local');
const axios = require('axios');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

const session = new LocalSession({
  getSessionKey: (ctx) => ctx.from && ctx.from.id ? ctx.from.id.toString() : undefined
});
bot.use(session.middleware());

const models = {
  text: {
    'meta_llama': {
      displayName: '🦙 Meta Llama 3.1 8B',
      apiModelName: 'meta-llama/Meta-Llama-3.1-8B-Instruct',
      maxTokens: 2048,
      temperature: 0.7,
      topP: 0.9
    },
    'deepseek': {
      displayName: '🔍 DeepSeek V3',
      apiModelName: 'deepseek-ai/DeepSeek-V3',
      maxTokens: 512,
      temperature: 0.1,
      topP: 0.9
    },
    'hermes': {
      displayName: '⚡ Hermes-3-Llama-3.1-70B',
      apiModelName: 'NousResearch/Hermes-3-Llama-3.1-70B',
      maxTokens: 2048,
      temperature: 0.7,
      topP: 0.9
    },
    'qwen': {
      displayName: '💻 Qwen2.5-Coder-32B-Instruct',
      apiModelName: 'Qwen/Qwen2.5-Coder-32B-Instruct',
      maxTokens: 512,
      temperature: 0.1,
      topP: 0.9
    }
  },
  image: {
    'flux':
