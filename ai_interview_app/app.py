import os
import sys
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from flask import Flask, render_template, request, jsonify
from ai.sentiment_analysis import analyze_sentiment
from ai.question_bank import questions

app = Flask(__name__)
from ai_model.question_model import get_question


@app.route('/')
def index():
    return render_template('index.html', question=questions[0])

@app.route('/submit_answer', methods=['POST'])
def submit_answer():
    data = request.get_json()
    answer = data['answer']
    result = analyze_sentiment(answer)
    return jsonify(result)
from ai_model.question_model import get_question  # 👈 Import our new model

@app.route('/api/get_question')
def api_question():
    role = request.args.get("role", "developer")  # default: developer
    question = get_question(role)
    return jsonify({"question": question})

if __name__ == '__main__':
    app.run(debug=True)
