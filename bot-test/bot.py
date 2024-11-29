# "7455246901:AAFPPlVwB-ztjwjIRYF-bodlfGcgwpN1QoU"

from telegram import InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo, KeyboardButton, ReplyKeyboardMarkup
from telegram.ext import Application, CommandHandler, ContextTypes

async def start(update, context):
    user_id = update.message.from_user.id
    web_app = WebAppInfo(
        url=f'https://new-mini-telegram-bot.onrender.com?user_id={user_id}'  # Pass user_id to the mini app
    )

    keyboard = [[KeyboardButton(text="Open Mini App 🚀", web_app=web_app)]]
    reply_markup = ReplyKeyboardMarkup(keyboard, resize_keyboard=True)

    referral_link = f"https://t.me/SunEarner_bot?start={user_id}"

    await update.message.reply_text(
        f"Welcome! Click the button below to open the Mini App:\n\n"
        f"Your referral link is: {referral_link}",
        reply_markup=reply_markup
    )

def main():
    app = Application.builder().token("7455246901:AAFPPlVwB-ztjwjIRYF-bodlfGcgwpN1QoU").build()
    app.add_handler(CommandHandler("start", start))
    app.run_polling()

if __name__ == '__main__':
    main()







# from telegram import InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo, KeyboardButton, ReplyKeyboardMarkup
# from telegram.ext import Application, CommandHandler

# async def start(update, context):
#     user_id = update.message.from_user.id 

#     web_app = WebAppInfo(
#         url=f'https://new-mini-telegram-bot.onrender.com?user_id={user_id}'  # Include user_id in the URL
#     )

#     keyboard = [[KeyboardButton(
#         text="Open Mini App 🚀",
#         web_app=web_app
#     )]]
    
#     reply_markup = ReplyKeyboardMarkup(keyboard, resize_keyboard=True)
    
#     await update.message.reply_text(
#         "Welcome! Click the button below to open the Mini App:",
#         reply_markup=reply_markup
#     )


# def main():
#     app = Application.builder().token("BOT_TOKEN").build()
#     app.add_handler(CommandHandler("start", start))
#     app.run_polling()

# if __name__ == '__main__':
#     main()

