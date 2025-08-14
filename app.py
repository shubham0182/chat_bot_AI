from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI

app = Flask(__name__)
CORS(app)

# Initialize OpenAI client
client = OpenAI(api_key="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")  # 🔹 Replace with your actual API key

@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()
        user_message = data.get("message", "").strip()

        if not user_message:
            return jsonify({"reply": "Please enter a message."})

        # Get AI response from OpenAI
        chat_completion = client.chat.completions.create(
            messages=[{"role": "user", "content": user_message}],
            model="gpt-4o-mini"
        )
        ai_reply = chat_completion.choices[0].message.content
        return jsonify({"reply": ai_reply})

    except Exception as e:
        return jsonify({"reply": f"Error: {str(e)}"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
