from flask import Flask, request, jsonify, send_from_directory
import torch
from transformers import AlbertTokenizer, AlbertForSequenceClassification
import torch.nn.functional as F
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load model and tokenizer
model_path = "/home/emdee/Desktop/Ip-2/FakeNews-master/fake_news_model"  # adjust if needed
tokenizer = AlbertTokenizer.from_pretrained(model_path)
model = AlbertForSequenceClassification.from_pretrained(model_path)
model.eval()
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

@app.route("/")
def home():
    return send_from_directory(".", "index.html")  # serve index.html from current folder

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    text = data.get("text", "")
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True)
    inputs = {k: v.to(device) for k, v in inputs.items()}
    with torch.no_grad():
        logits = model(**inputs).logits
        probs = F.softmax(logits, dim=1)
        confidence, predicted_class = torch.max(probs, dim=1)
    
    label = "Fake News" if predicted_class.item() == 0 else "True News"
    return jsonify({
        "label": label,
        "confidence": confidence.item()
    })

if __name__ == "__main__":
    app.run(debug=True)
