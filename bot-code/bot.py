from telegram import WebAppInfo, KeyboardButton, ReplyKeyboardMarkup
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes

async def start(update, context):
    username = update.message.from_user.username or "there"
    context.user_data["user_id"] = update.message.from_user.id

    keyboard = [[KeyboardButton("Start Playing")]]
    reply_markup = ReplyKeyboardMarkup(keyboard, resize_keyboard=True)

    await update.message.reply_text(
        f"Hey @{username}, welcome to Roaster Bot where you can perform multiple tasks to earn!",
        reply_markup=reply_markup
    )

async def button_handler(update, context):
    user_message = update.message.text

    if user_message == "Start Playing":
        user_id = context.user_data.get("user_id", 0)

        web_app = WebAppInfo(
            url=f'https://new-mini-telegram-bot.onrender.com?user_id={user_id}'  # Include user_id in the URL
        )
        keyboard = [[KeyboardButton(
            text="Open Mini App 🚀",
            web_app=web_app
        )]]
        reply_markup = ReplyKeyboardMarkup(keyboard, resize_keyboard=True)

        await update.message.reply_text(
            "Here you go! Click the button below to start earning:",
            reply_markup=reply_markup
        )

def main():
    app = Application.builder().token("7938728660:AAFg3Ul2k8GO2avvwhCX7OLlzvyXgQj6YEI").build()

    app.add_handler(CommandHandler("start", start))

    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, button_handler))

    app.run_polling()

if __name__ == '__main__':
    main()
