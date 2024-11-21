# "7455246901:AAFPPlVwB-ztjwjIRYF-bodlfGcgwpN1QoU"

from telegram import InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo, KeyboardButton, ReplyKeyboardMarkup
from telegram.ext import Application, CommandHandler

async def start(update, context):
    user_id = update.message.from_user.id 

    web_app = WebAppInfo(
        url=f'https://new-mini-telegram-bot.onrender.com?user_id={user_id}'  # Include user_id in the URL
    )

    keyboard = [[KeyboardButton(
        text="Open Mini App 🚀",
        web_app=web_app
    )]]
    
    reply_markup = ReplyKeyboardMarkup(keyboard, resize_keyboard=True)
    
    await update.message.reply_text(
        "Welcome! Click the button below to open the Mini App:",
        reply_markup=reply_markup
    )


def main():
    app = Application.builder().token("BOT_TOKEN").build()
    app.add_handler(CommandHandler("start", start))
    app.run_polling()

if __name__ == '__main__':
    main()

