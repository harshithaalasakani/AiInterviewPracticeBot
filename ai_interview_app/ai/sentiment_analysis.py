from textblob import TextBlob

def analyze_sentiment(text):
    blob = TextBlob(text)
    polarity = blob.sentiment.polarity

    if polarity > 0.2:
        sentiment = "Positive"
        tip = "Good tone! Try to add more real examples."
    elif polarity < -0.1:
        sentiment = "Negative"
        tip = "Try to be more confident and avoid negative tone."
    else:
        sentiment = "Neutral"
        tip = "Add more enthusiasm to make it impactful."

    score = round((polarity + 1) * 50)
    return {'sentiment': sentiment, 'score': score, 'tip': tip}
