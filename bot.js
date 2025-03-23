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
    'flux': {
      displayName: '🎨 FLUX.1-dev',
      apiModelName: 'FLUX.1-dev'
    },
    'sd2': {
      displayName: '🖼️ SD2',
      apiModelName: 'SD2'
    }
  },
  audio: {
    'melo_tts': {
      displayName: '🔊 Melo TTS'
    }
  }
};

function showCategorySelection(ctx) {
  ctx.reply('*📂 Выберите категорию:*', {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [{ text: '📝 Текстовые модели', callback_data: 'category_text' }],
        [{ text: '🖼️ Модели изображений', callback_data: 'category_image' }],
        [{ text: '🎧 Аудио модели', callback_data: 'category_audio' }]
      ]
    }
  });
}

function showModelSelection(ctx, category) {
  const modelList = models[category];
  const buttons = Object.entries(modelList).map(([key, model]) => [{
    text: model.displayName,
    callback_data: `model_${key}`
  }]);
  ctx.reply(`*🔧 Выберите модель ${category}:*`, {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: buttons
    }
  });
}

bot.command('start', (ctx) => {
  ctx.reply(
    '*Добро пожаловать в бота Hyperbolic AI!*

' +
    'Для начала работы отправьте ваш API-ключ Hyperbolic:
' +
    '1. Перейдите на [сайт Hyperbolic](https://app.hyperbolic.xyz/) и войдите
' +
    '2. Откройте раздел *Настройки*
' +
    '3. Скопируйте API-ключ
' +
    '4. Вставьте его сюда

' +
    '🛡️ *Безопасность:*
' +
    '- Ваш API-ключ хранится безопасно
' +
    '- Вы можете удалить его с помощью /remove
' +
    '- Этот бот хранит ключ только для текущей сессии',
    {
      parse_mode: 'Markdown'
    }
  );
});

bot.command('help', (ctx) => {
  ctx.reply(
    '📚 *Команды:*
' +
    '*/start* - Запустить бота
' +
    '*/switch* - Сменить модель
' +
    '*/remove* - Удалить данные
' +
    '*/help* - Помощь',
    { parse_mode: 'Markdown' }
  );
});

bot.launch();
console.log('🤖 Бот запущен...');

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
