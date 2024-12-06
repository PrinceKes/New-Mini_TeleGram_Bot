from telegram import WebAppInfo, KeyboardButton, ReplyKeyboardMarkup
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes
import pymongo  # MongoDB for storing referral data

# MongoDB connection setup
client = pymongo.MongoClient("mongodb+srv://dbUser:dbUserpass@telegrambot.yngj8.mongodb.net/?retryWrites=true&w=majority")  # Replace with your connection string
db = client["ReferralBotDB"]
referrals_collection = db["Referrals"]

async def start(update, context):
    # Extract username and user ID
    username = update.message.from_user.username or "there"
    user_id = update.message.from_user.id
    context.user_data["user_id"] = user_id

    # Check for referral ID in the command
    args = context.args if context.args else []
    referral_id = args[0] if args else None

    if referral_id:
        # Process the referral
        referring_user = referrals_collection.find_one({"referral_id": referral_id})

        if referring_user:
            # Check if this user is already referred
            if any(ref["referredUserId"] == str(user_id) for ref in referring_user["referrals"]):
                await update.message.reply_text("You have already been referred by this user.")
            else:
                # Add the new user to the referring user's referrals
                referring_user["referrals"].append({
                    "referredUserId": str(user_id),
                    "referredUsername": username,
                    "reward": 250,
                    "isClaimed": False
                })
                referrals_collection.update_one(
                    {"referral_id": referral_id},
                    {"$set": {"referrals": referring_user["referrals"]}}
                )
                await update.message.reply_text(f"Thank you for joining through referral ID {referral_id}!")
        else:
            await update.message.reply_text(f"Invalid referral ID: {referral_id}. Proceeding without referral.")

    # Add the new user to the database if they don't already exist
    if not referrals_collection.find_one({"referral_id": str(user_id)}):
        referrals_collection.insert_one({
            "referral_id": str(user_id),
            "username": username,
            "referrals": []
        })

    # Provide the user with the main menu
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





# from telegram import WebAppInfo, KeyboardButton, ReplyKeyboardMarkup
# from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes

# async def start(update, context):
#     username = update.message.from_user.username or "there"
#     context.user_data["user_id"] = update.message.from_user.id

#     keyboard = [[KeyboardButton("Start Playing")]]
#     reply_markup = ReplyKeyboardMarkup(keyboard, resize_keyboard=True)

#     await update.message.reply_text(
#         f"Hey @{username}, welcome to Roaster Bot where you can perform multiple tasks to earn!",
#         reply_markup=reply_markup
#     )

# async def button_handler(update, context):
#     user_message = update.message.text

#     if user_message == "Start Playing":
#         user_id = context.user_data.get("user_id", 0)

#         web_app = WebAppInfo(
#             url=f'https://new-mini-telegram-bot.onrender.com?user_id={user_id}'  # Include user_id in the URL
#         )
#         keyboard = [[KeyboardButton(
#             text="Open Mini App 🚀",
#             web_app=web_app
#         )]]
#         reply_markup = ReplyKeyboardMarkup(keyboard, resize_keyboard=True)

#         await update.message.reply_text(
#             "Here you go! Click the button below to start earning:",
#             reply_markup=reply_markup
#         )

# def main():
#     app = Application.builder().token("7938728660:AAFg3Ul2k8GO2avvwhCX7OLlzvyXgQj6YEI").build()

#     app.add_handler(CommandHandler("start", start))

#     app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, button_handler))

#     app.run_polling()

# if __name__ == '__main__':
#     main()
