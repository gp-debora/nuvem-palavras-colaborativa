console.log("🚀 Script carregado!");

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const wordInput = document.getElementById("word-input");
  const addWordButton = document.getElementById("add-word-btn");
  const cloudContainer = document.getElementById("word-cloud");

  // 📌 Função de Login
  if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      if (email && password) {
        localStorage.setItem("user", email); 
        window.location.href = "nuvem.html"; 
      } else {
        alert("Por favor, preencha todos os campos.");
      }
    });
  }

  // 📌 Função de Registo
  if (registerForm) {
    registerForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const name = document.getElementById("name").value;
      const email = document.getElementById("register-email").value;
      const password = document.getElementById("register-password").value;

      if (name && email && password) {
        alert("Conta criada com sucesso! Faça login para continuar.");
      } else {
        alert("Por favor, preencha todos os campos.");
      }
    });
  }

  // 📌 Função para procurar palavras e atualizar a nuvem
  const fetchWordCloud = async () => {
    try {
      const response = await fetch("http://localhost:5001/words");
      const words = await response.json();
      console.log("📡 Dados recebidos do backend:", words);

      // Converte os dados para o formato D3.js
      const formattedWords = words.map(d => ({ text: d.text, size: 10 + d.frequency * 5 }));

      renderWordCloud(formattedWords);
    } catch (error) {
      console.error("Erro ao carregar nuvem:", error);
    }
  };

  // 📌 Função para adicionar palavras ao backend
  const addWord = async () => {
    const word = wordInput.value.trim();
    if (!word) {
      alert("Digite uma palavra!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5001/words", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word }),
      });

      const data = await response.json();
      console.log("✅ Palavra adicionada:", data);

      wordInput.value = ""; // Limpa o campo de entrada
      fetchWordCloud(); // Atualiza a nuvem de palavras
    } catch (error) {
      console.error("Erro ao enviar palavra:", error);
    }
  };

  // 📌 Evento de clique para adicionar palavras
  if (addWordButton) {
    addWordButton.addEventListener("click", addWord);
  }

  // 📌 Atualiza a nuvem de palavras periodicamente
  if (cloudContainer) {
    fetchWordCloud();
    setInterval(fetchWordCloud, 5000);
  }
});

// 🎨 Função para renderizar a nuvem de palavras com D3.js
function renderWordCloud(words) {
  d3.select("#word-cloud").html(""); // Limpa a nuvem antes de redesenhá-la

  const width = 500;
  const height = 400;

  const layout = d3.layout.cloud()
    .size([width, height])
    .words(words)
    .padding(5)
    .rotate(() => ~~(Math.random() * 2) * 90) // Rotação aleatória
    .fontSize(d => d.size)
    .on("end", draw);

  layout.start();

  function draw(words) {
    d3.select("#word-cloud")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`)
      .selectAll("text")
      .data(words)
      .enter().append("text")
      .style("font-size", d => `${d.size}px`)
      .style("fill", () => `hsl(${Math.random() * 360}, 100%, 50%)`) // Cores aleatórias
      .attr("text-anchor", "middle")
      .attr("transform", d => `translate(${d.x},${d.y}) rotate(${d.rotate})`)
      .text(d => d.text);
  }
}
