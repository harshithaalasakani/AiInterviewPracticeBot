let currentQuestion = 0;
const questionList = [
  "Tell me about yourself.",
  "What are your strengths and weaknesses?",
  "Why do you want this job?",
  "Where do you see yourself in 5 years?",
  "Describe a challenge you overcame.",
  "Why should we hire you?",
  "What motivates you?",
  "Tell me about a time you failed and what you learned.",
  "How do you handle stress and pressure?",
  "What are your career goals?"
];

let timerInterval;
let seconds = 0;

function resetTimer() {
  clearInterval(timerInterval);
  seconds = 0;
  document.getElementById('timer').textContent = '00:00';
}


function startTimer() {
  stopTimer();  // 🧠 stop previous timer before starting new
  totalSeconds = 0;
  timerInterval = setInterval(() => {
    totalSeconds++;
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    document.getElementById('timer').textContent =
      `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }, 1000);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}


function submitAnswer() {
  stopTimer();
  const question = document.getElementById("question").textContent;
  const answer = document.getElementById("answer").value;
  fetch('/submit_answer', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ answer })
  })
  .then(res => res.json())
  .then(data => {
    document.getElementById('feedback').innerHTML = `
      <h3>Feedback:</h3>
      <p>Sentiment: ${data.sentiment}</p>
      <p>Confidence Score: ${data.score}%</p>
      <p>Tip: ${data.tip}</p>
    `;

    // ⬇️ Add to History
    const history = document.getElementById("historyList");
    const item = document.createElement("li");
    item.innerHTML = `<strong>Q:</strong> ${question}<br><strong>A:</strong> ${answer}<br><strong>Score:</strong> ${data.score}%`;
    history.prepend(item); // latest on top
  });
}


function nextQuestion() {
  if (currentQuestion < questionList.length - 1) {
    currentQuestion++;
    document.getElementById("question").textContent = questionList[currentQuestion];
    document.getElementById("answer").value = '';
    document.getElementById("feedback").innerHTML = '';
    resetTimer();
  } else {
    alert("Interview complete! 🎉");
  }
}

// 🎤 Speech Recognition
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-US';
recognition.continuous = true; // 🔁 Keep listening
recognition.interimResults = false;

function startRecording() {
  recognition.start();
  console.log("Recording started...");
}

function stopRecording() {
  recognition.stop();
  console.log("Recording stopped.");
}

recognition.onresult = function (event) {
  const transcript = event.results[event.results.length - 1][0].transcript;
  document.getElementById("answer").value += transcript + " ";
};

recognition.onerror = function (event) {
  alert("Mic error: " + event.error);
};


recognition.onresult = function(event) {
  const transcript = event.results[0][0].transcript;
  document.getElementById("answer").value = transcript;
};

recognition.onerror = function(event) {
  alert("Mic error: " + event.error);
  stopTimer();
};

recognition.onend = () => {
  console.log("Mic manually stopped.");
};
function fetchQuestion() {
  const role = document.getElementById("roleInput").value || "developer";
  fetch(`/api/get_question?role=${encodeURIComponent(role)}`)
    .then(res => res.json())
    .then(data => {
      document.getElementById("question").textContent = data.question;
      document.getElementById("answer").value = '';
      document.getElementById("feedback").innerHTML = '';
      document.getElementById("timer").textContent = '00:00';
      startTimer();
    });
}
