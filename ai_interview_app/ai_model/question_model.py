import pandas as pd
import random
import os

# Auto-load dataset when this file is imported
DATA_PATH = os.path.join(os.path.dirname(__file__), "data", "questions.csv")
df = pd.read_csv(DATA_PATH)

def get_question(role_input):
    """
    Return a random interview question based on a given job role.
    """
    # Case-insensitive filter by role
    filtered = df[df['Role'].str.contains(role_input, case=False, na=False)]

    if filtered.empty:
        return "Sorry, I don't have a question for that role yet."

    return random.choice(filtered['Question'].values.tolist())
