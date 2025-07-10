import React, { useState, useRef } from "react";

export default function AnalyticsBotFrontend() {
  const [query, setQuery] = useState("");
  const [platforms, setPlatforms] = useState(["youtube", "reddit", "google", "instagram"]);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [followUpQuestions, setFollowUpQuestions] = useState([]);
  const [contextAnswers, setContextAnswers] = useState({});
  const [finalResult, setFinalResult] = useState(null);
  const [step, setStep] = useState("input");
  const [refineQuestion, setRefineQuestion] = useState("");
  const [refineAnswer, setRefineAnswer] = useState("");
  const wsRef = useRef(null);

  const handleStart = () => {
    setProgress(0);
    setStatus("Connecting...");
    setStep("progress");
    setFinalResult(null);
    setFollowUpQuestions([]);
    setContextAnswers({});
    setRefineQuestion("");
    setRefineAnswer("");
    wsRef.current = new WebSocket("ws://localhost:8000/ws/analyze");
    wsRef.current.onopen = () => {
      // First, call /start for refinement
      fetch("/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, platforms }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.step === "refinement") {
            setRefineQuestion(data.question);
            setStep("refinement");
          } else {
            // No refinement needed, proceed to analysis
            wsRef.current.send(JSON.stringify({ query, platforms }));
          }
        });
    };
    wsRef.current.onmessage = (event) => {
      let msg;
      try {
        msg = JSON.parse(event.data);
      } catch {
        setStatus(event.data);
        return;
      }
      if (msg.type === "progress") {
        setProgress(msg.percent);
      } else if (msg.type === "status") {
        setStatus(msg.content);
      } else if (msg.type === "follow_up_questions") {
        setFollowUpQuestions(msg.questions);
        setStep("followup");
      } else if (msg.type === "final_result") {
        setFinalResult(msg);
        setStep("done");
      } else if (msg.type === "error") {
        setStatus(msg.content);
        setStep("error");
      }
    };
    wsRef.current.onerror = () => {
      setStatus("WebSocket error.");
      setStep("error");
    };
    wsRef.current.onclose = () => {};
  };

  const handleRefineSubmit = (e) => {
    e.preventDefault();
    fetch("/refine", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers: { [refineQuestion]: refineAnswer } }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.step === "refinement") {
          setRefineQuestion(data.question);
          setRefineAnswer("");
        } else {
          // Refinement complete, start analysis
          wsRef.current.send(JSON.stringify({ query: data.refined_query || query, platforms }));
          setStep("progress");
        }
      });
  };

  const handleFollowUpSubmit = (e) => {
    e.preventDefault();
    wsRef.current.send(JSON.stringify({ context: contextAnswers }));
    setStep("progress");
    setStatus("Submitting your answers and continuing analysis...");
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 24 }}>
      <h2>Analytics Bot</h2>
      {step === "input" && (
        <div>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Enter your query"
            style={{ width: "100%", marginBottom: 8 }}
          />
          <div>
            <label>Platforms:</label>
            {["youtube", "reddit", "google", "instagram"].map(p => (
              <label key={p} style={{ marginLeft: 8 }}>
                <input
                  type="checkbox"
                  checked={platforms.includes(p)}
                  onChange={e => {
                    if (e.target.checked) setPlatforms([...platforms, p]);
                    else setPlatforms(platforms.filter(x => x !== p));
                  }}
                />
                {p}
              </label>
            ))}
          </div>
          <button onClick={handleStart} style={{ marginTop: 12 }}>Start Analysis</button>
        </div>
      )}

      {step === "refinement" && (
        <form onSubmit={handleRefineSubmit} style={{ marginTop: 24 }}>
          <h4>Refine Your Query</h4>
          <div style={{ marginBottom: 8 }}>
            <label>{refineQuestion}</label>
            <input
              type="text"
              required
              style={{ width: "100%" }}
              value={refineAnswer}
              onChange={e => setRefineAnswer(e.target.value)}
            />
          </div>
          <button type="submit">Submit</button>
        </form>
      )}

      {(step === "progress" || step === "followup") && (
        <div style={{ marginTop: 24 }}>
          <div style={{ marginBottom: 8 }}>{status}</div>
          <div style={{ background: "#eee", borderRadius: 4, height: 24, width: "100%", overflow: "hidden" }}>
            <div
              style={{
                width: `${progress}%`,
                background: "#4caf50",
                height: "100%",
                transition: "width 0.3s"
              }}
            />
          </div>
        </div>
      )}

      {step === "followup" && followUpQuestions.length > 0 && (
        <form onSubmit={handleFollowUpSubmit} style={{ marginTop: 24 }}>
          <h4>Follow-up Questions</h4>
          {followUpQuestions.map((q, idx) => (
            <div key={idx} style={{ marginBottom: 8 }}>
              <label>{q}</label>
              <input
                type="text"
                required
                style={{ width: "100%" }}
                value={contextAnswers[q] || ""}
                onChange={e => setContextAnswers({ ...contextAnswers, [q]: e.target.value })}
              />
            </div>
          ))}
          <button type="submit">Submit Answers</button>
        </form>
      )}

      {step === "done" && finalResult && (
        <div style={{ marginTop: 24 }}>
          <h4>Analysis Complete!</h4>
          <pre style={{ background: "#f5f5f5", padding: 12, borderRadius: 4 }}>
            {JSON.stringify(finalResult, null, 2)}
          </pre>
        </div>
      )}

      {step === "error" && (
        <div style={{ color: "red", marginTop: 24 }}>{status}</div>
      )}
    </div>
  );
}
