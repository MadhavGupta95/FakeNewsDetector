import React, { useState } from "react";
import "./App.css";

function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  

  const checkFakeNews = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setResult("");
    
    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      setResult(
        `Prediction: ${data.label}\nConfidence: ${(
          data.confidence * 100
        ).toFixed(2)}%`
      );
    } catch (error) {
      console.error(error);
      setResult("Error contacting the server.");
    }

    setLoading(false);
  };

  return (
    <div className="main">
      <header className="main-header">
        <h1>Fake News Detection</h1>
      </header>

      <div className="container">
        <textarea
          className="input-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter a news headline or article to check..."
        />
        <button onClick={checkFakeNews} className="analyze-button">
          Analyze
        </button>
        <nav className="navbar">
          <ul>
            <li>
              <a href="#about">What is Fake News?</a>
            </li>
            <li>
              <a href="#how">How It Works</a>
            </li>
            <li>
              <a href="#tips">Tips to Spot Fake News</a>
            </li>
          </ul>
        </nav>
        <div className={`result-area ${result ? "show" : ""}`}>
          {loading ? <div className="loader"></div> : <pre>{result}</pre>}
        </div>
        <section id="about" className="info">
          <h2>What is Fake News?</h2>
          <p>
            Fake news is misinformation or hoaxes spread via traditional news
            media or online social platforms. It can mislead public opinion and
            cause real-world harm.
          </p>

          <h2 id="how">How It Works</h2>
          <p>
            This AI-powered model uses NLP (Natural Language Processing) to
            analyze the language patterns and classify whether the news is
            likely real or fake.
          </p>

          <h2 id="tips">Tips to Spot Fake News:</h2>
          <ul>
            <li>Check the source's credibility</li>
            <li>Look for supporting evidence</li>
            <li>Watch for sensational or emotional language</li>
            <li>Cross-check with reputable sources</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

export default App;
