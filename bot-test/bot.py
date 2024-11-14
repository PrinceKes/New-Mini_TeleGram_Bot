from telegram import InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler

async def start(update, context):
    user_id = update.message.from_user.id 

    keyboard = [
        [InlineKeyboardButton("Open Mini App", url=f'https://new-mini-telegram-bot.onrender.com?user_id={user_id}')]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    

    await update.message.reply_text("Welcome! Click below to open the Mini App.", reply_markup=reply_markup)

def main():

    app = Application.builder().token("7455246901:AAFPPlVwB-ztjwjIRYF-bodlfGcgwpN1QoU").build()
    

    app.add_handler(CommandHandler("start", start))
    

    app.run_polling()

if __name__ == '__main__':
    main()





# from telegram import WebAppInfo, KeyboardButton, ReplyKeyboardMarkup
# from telegram.ext import CommandHandler, Application
# import logging

# logging.basicConfig(
#     format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
#     level=logging.INFO
# )

# TOKEN = "7455246901:AAFPPlVwB-ztjwjIRYF-bodlfGcgwpN1QoU"

# async def start(update, context):

#     web_app = WebAppInfo(
#         url="https://new-mini-telegram-bot.onrender.com/"
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

#     app = Application.builder().token(TOKEN).build()


#     app.add_handler(CommandHandler('start', start))


#     print("Bot is running...")
#     app.run_polling(allowed_updates=["message", "callback_query"])

# if __name__ == "__main__":
#     main()






# from telegram import WebAppInfo, KeyboardButton, ReplyKeyboardMarkup
# from telegram.ext import CommandHandler, Application
# import logging

# # Initialize logging to see errors and important information
# logging.basicConfig(
#     format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
#     level=logging.INFO
# )

# TOKEN = "7455246901:AAFPPlVwB-ztjwjIRYF-bodlfGcgwpN1QoU" 

# async def start(update, context):
#     keyboard = [[KeyboardButton(
#         text="Open Mini App",
#         web_app=WebAppInfo(url="https://new-mini-telegram-bot.onrender.com/")  # Replace with your web app URL
#     )]]
#     reply_markup = ReplyKeyboardMarkup(keyboard, resize_keyboard=True)
    
#     await update.message.reply_text(
#         "Welcome! Click the button below to open the Mini App:",
#         reply_markup=reply_markup
#     )

# def main():

#     app = Application.builder().token(TOKEN).build()

#     app.add_handler(CommandHandler('start', start))


#     print("Bot is running...")
#     app.run_polling()

# if __name__ == "__main__":
#     main()
