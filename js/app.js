// ============================================================================
// LearnApp - Aplicação de Aprendizado Diário Adaptativa (Android & Desktop)
// ============================================================================

class SoundManager {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
  }

  playCorrect() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(523.25, now); // C5
    osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
    osc.frequency.setValueAtTime(783.99, now + 0.2); // G5

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.45);
  }

  playWrong() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.linearRampToValueAtTime(150, now + 0.25);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
  }

  playVictory() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C, E, G, High C
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);
      gain.gain.setValueAtTime(0.3, now + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.4);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 0.45);
    });
  }
}

class LearnApp {
  constructor() {
    this.sounds = new SoundManager();
    this.loadState();

    this.currentTopicId = "programacao";
    this.currentSubtopicId = "cpp";

    this.activeLesson = null;
    this.currentStepIndex = 0;
    this.selectedOptionIndex = null;
    this.isStepAnswered = false;

    this.initElements();
    this.bindEvents();
    this.bindKeyboardShortcuts();
    this.renderHeader();
    this.renderPath();
  }

  // Vibração tátil no Android nativo (Kotlin) ou Web API
  vibrate(ms = 40) {
    if (window.AndroidBridge && typeof window.AndroidBridge.vibrate === "function") {
      try {
        window.AndroidBridge.vibrate(ms);
        return;
      } catch (e) {}
    }
    if ("vibrate" in navigator) {
      try {
        navigator.vibrate(ms);
      } catch (e) {}
    }
  }

  loadState() {
    const savedCourses = localStorage.getItem("learn_app_courses");
    if (savedCourses) {
      try {
        this.coursesData = JSON.parse(savedCourses);
      } catch (e) {
        this.coursesData = initialCoursesData;
      }
    } else {
      this.coursesData = initialCoursesData;
    }

    this.xp = parseInt(localStorage.getItem("learn_app_xp") || "120", 10);
    this.streak = parseInt(localStorage.getItem("learn_app_streak") || "1", 10);
  }

  saveState() {
    localStorage.setItem("learn_app_courses", JSON.stringify(this.coursesData));
    localStorage.setItem("learn_app_xp", this.xp.toString());
    localStorage.setItem("learn_app_streak", this.streak.toString());
  }

  getCurrentSubtopic() {
    const topic = this.coursesData.topics.find(t => t.id === this.currentTopicId);
    if (!topic) return null;
    return topic.subtopics.find(s => s.id === this.currentSubtopicId);
  }

  initElements() {
    // Header
    this.topicSelectorBtn = document.getElementById("topic-selector-btn");
    this.currentCategoryEl = document.getElementById("current-category");
    this.currentSubtopicEl = document.getElementById("current-subtopic");
    this.streakCountEl = document.getElementById("streak-count");
    this.xpCountEl = document.getElementById("xp-count");

    // Hero
    this.heroTitleEl = document.getElementById("hero-subtopic-title");
    this.heroDescEl = document.getElementById("hero-subtopic-desc");
    this.btnSimulateDaily = document.getElementById("btn-simulate-daily");

    // Caminho
    this.pathContainer = document.getElementById("path-container");
    this.nodesList = document.getElementById("nodes-list");
    this.pathSvg = document.getElementById("path-svg");

    // Modais
    this.topicModal = document.getElementById("topic-modal");
    this.closeTopicModalBtn = document.getElementById("close-topic-modal");
    this.topicsTreeContainer = document.getElementById("topics-tree-container");

    this.generatorModal = document.getElementById("generator-modal");
    this.closeGeneratorModalBtn = document.getElementById("close-generator-modal");
    this.btnRunSimulation = document.getElementById("btn-run-simulation");

    // Player de Lição
    this.lessonPlayer = document.getElementById("lesson-player");
    this.closeLessonBtn = document.getElementById("close-lesson-btn");
    this.lessonProgressFill = document.getElementById("lesson-progress-fill");
    this.playerStepContent = document.getElementById("player-step-content");
    this.playerFooter = document.getElementById("player-footer");
    this.feedbackBanner = document.getElementById("feedback-banner");
    this.feedbackIcon = document.getElementById("feedback-icon");
    this.feedbackTitle = document.getElementById("feedback-title");
    this.feedbackMessage = document.getElementById("feedback-message");
    this.btnPlayerAction = document.getElementById("btn-player-action");
  }

  bindEvents() {
    this.topicSelectorBtn.addEventListener("click", () => this.openTopicModal());
    this.closeTopicModalBtn.addEventListener("click", () => this.closeTopicModal());

    this.btnSimulateDaily.addEventListener("click", () => this.openGeneratorModal());
    this.closeGeneratorModalBtn.addEventListener("click", () => this.closeGeneratorModal());
    this.btnRunSimulation.addEventListener("click", () => this.runDailyLessonSimulation());

    this.closeLessonBtn.addEventListener("click", () => this.exitLesson());
    this.btnPlayerAction.addEventListener("click", () => this.handlePlayerAction());

    window.addEventListener("resize", () => this.drawConnectingPath());
    window.addEventListener("orientationchange", () => setTimeout(() => this.drawConnectingPath(), 100));
  }

  // Suporte a teclado no Desktop
  bindKeyboardShortcuts() {
    window.addEventListener("keydown", (e) => {
      // Se a lição estiver aberta
      if (this.activeLesson) {
        if (e.key === "Escape") {
          this.exitLesson();
          return;
        }

        const step = this.activeLesson.steps[this.currentStepIndex];
        if (step && step.type === "quiz" && !this.isStepAnswered) {
          const keyNum = parseInt(e.key, 10);
          if (keyNum >= 1 && keyNum <= step.options.length) {
            this.selectQuizOption(keyNum - 1);
            return;
          }
        }

        if (e.key === "Enter" || e.key === " ") {
          if (!this.btnPlayerAction.disabled) {
            e.preventDefault();
            this.handlePlayerAction();
          }
        }
      } else {
        if (e.key === "Escape") {
          this.closeTopicModal();
          this.closeGeneratorModal();
        }
      }
    });
  }

  renderHeader() {
    const topic = this.coursesData.topics.find(t => t.id === this.currentTopicId);
    const subtopic = this.getCurrentSubtopic();

    if (topic && subtopic) {
      this.currentCategoryEl.textContent = topic.name;
      this.currentSubtopicEl.textContent = subtopic.name;
      this.heroTitleEl.textContent = subtopic.heroTitle || subtopic.name;
      this.heroDescEl.textContent = subtopic.description;
    }

    this.streakCountEl.textContent = this.streak;
    this.xpCountEl.textContent = this.xp;
  }

  // ============================================================================
  // Renderização da Trilha em Zigue-zague (Estilo Duolingo)
  // ============================================================================
  renderPath() {
    const subtopic = this.getCurrentSubtopic();
    if (!subtopic) return;

    this.nodesList.innerHTML = "";

    const lessons = subtopic.lessons || [];

    lessons.forEach((lesson, index) => {
      // Cálculo do zigue-zague em senoide: -72px, 0px, +72px, 0px...
      const offset = Math.round(Math.sin(index * 1.1) * 72);

      const nodeWrapper = document.createElement("div");
      nodeWrapper.className = `node-wrapper ${lesson.status}`;
      if (lesson.isDailyAi) nodeWrapper.classList.add("daily-ai");
      nodeWrapper.style.transform = `translateX(${offset}px)`;

      // Tooltip para o nó atual
      if (lesson.status === "current") {
        const tooltip = document.createElement("div");
        tooltip.className = "node-tooltip";
        tooltip.textContent = "COMEÇAR!";
        nodeWrapper.appendChild(tooltip);
      }

      // Botão 3D tátil redondo
      const circleBtn = document.createElement("button");
      circleBtn.className = "node-circle-btn";
      circleBtn.title = lesson.title;

      let iconDisplay = lesson.icon;
      if (lesson.status === "completed") {
        iconDisplay = "✓";
      } else if (lesson.status === "locked") {
        iconDisplay = "🔒";
      }

      circleBtn.innerHTML = `<span class="node-icon">${iconDisplay}</span>`;

      // Evento de clique na lição
      circleBtn.addEventListener("click", () => {
        this.vibrate(30);
        if (lesson.status !== "locked") {
          this.startLesson(lesson);
        } else {
          circleBtn.style.animation = "shake 0.3s";
          setTimeout(() => circleBtn.style.animation = "", 300);
        }
      });

      // Rótulo da lição
      const titleBadge = document.createElement("div");
      titleBadge.className = "node-title-badge";
      if (lesson.isDailyAi) {
        titleBadge.innerHTML = `<span class="node-tag-ia">✨ NOVO</span>${lesson.title}`;
      } else {
        titleBadge.textContent = `${index + 1}. ${lesson.title}`;
      }

      nodeWrapper.appendChild(circleBtn);
      nodeWrapper.appendChild(titleBadge);
      this.nodesList.appendChild(nodeWrapper);
    });

    // Conectar nós com curvas SVG após renderizar o DOM
    setTimeout(() => this.drawConnectingPath(), 60);
  }

  drawConnectingPath() {
    const wrappers = this.nodesList.querySelectorAll(".node-wrapper");
    if (wrappers.length < 2) {
      this.pathSvg.innerHTML = "";
      return;
    }

    const svgRect = this.pathContainer.getBoundingClientRect();
    this.pathSvg.setAttribute("width", svgRect.width);
    this.pathSvg.setAttribute("height", svgRect.height);

    let pathD = "";

    wrappers.forEach((wrapper, i) => {
      const btn = wrapper.querySelector(".node-circle-btn");
      const rect = btn.getBoundingClientRect();
      const x = rect.left - svgRect.left + rect.width / 2;
      const y = rect.top - svgRect.top + rect.height / 2;

      if (i === 0) {
        pathD += `M ${x} ${y}`;
      } else {
        const prevWrapper = wrappers[i - 1];
        const prevBtn = prevWrapper.querySelector(".node-circle-btn");
        const prevRect = prevBtn.getBoundingClientRect();
        const prevX = prevRect.left - svgRect.left + prevRect.width / 2;
        const prevY = prevRect.top - svgRect.top + prevRect.height / 2;

        const cpY1 = prevY + (y - prevY) / 2;
        const cpY2 = prevY + (y - prevY) / 2;
        pathD += ` C ${prevX} ${cpY1}, ${x} ${cpY2}, ${x} ${y}`;
      }
    });

    this.pathSvg.innerHTML = `
      <path d="${pathD}" fill="none" stroke="#e5e5e5" stroke-width="12" stroke-linecap="round" stroke-dasharray="8 12" />
    `;
  }

  // ============================================================================
  // Modal de Seleção de Tópicos (Programação > C++, etc.)
  // ============================================================================
  openTopicModal() {
    this.vibrate(25);
    this.topicsTreeContainer.innerHTML = "";

    this.coursesData.topics.forEach(topic => {
      const group = document.createElement("div");
      group.className = "category-group";

      const groupName = document.createElement("div");
      groupName.className = "category-name";
      groupName.textContent = `${topic.icon} ${topic.name}`;
      group.appendChild(groupName);

      topic.subtopics.forEach(sub => {
        const item = document.createElement("div");
        item.className = "subtopic-item";
        if (this.currentTopicId === topic.id && this.currentSubtopicId === sub.id) {
          item.classList.add("active");
        }

        item.innerHTML = `
          <div class="subtopic-left">
            <span class="subtopic-icon">${sub.icon}</span>
            <div>
              <div class="subtopic-title-text">${sub.name}</div>
              <div class="subtopic-lessons-count">${sub.lessons.length} aulas na trilha</div>
            </div>
          </div>
          <span>➔</span>
        `;

        item.addEventListener("click", () => {
          this.vibrate(30);
          this.currentTopicId = topic.id;
          this.currentSubtopicId = sub.id;
          this.closeTopicModal();
          this.renderHeader();
          this.renderPath();
        });

        group.appendChild(item);
      });

      this.topicsTreeContainer.appendChild(group);
    });

    this.topicModal.classList.remove("hidden");
  }

  closeTopicModal() {
    this.topicModal.classList.add("hidden");
  }

  // ============================================================================
  // Simulação da Criação Automática de Aula Diária com IA
  // ============================================================================
  openGeneratorModal() {
    this.vibrate(25);
    this.generatorModal.classList.remove("hidden");
    document.getElementById("gen-step-1").className = "status-step";
    document.getElementById("gen-step-2").className = "status-step";
    document.getElementById("gen-step-3").className = "status-step";
    this.btnRunSimulation.disabled = false;
    this.btnRunSimulation.textContent = "GERAR NOVA AULA DE HOJE";
  }

  closeGeneratorModal() {
    this.generatorModal.classList.add("hidden");
  }

  async runDailyLessonSimulation() {
    this.vibrate(40);
    this.btnRunSimulation.disabled = true;
    this.btnRunSimulation.textContent = "PESQUISANDO E CRIANDO...";

    const step1 = document.getElementById("gen-step-1");
    const step2 = document.getElementById("gen-step-2");
    const step3 = document.getElementById("gen-step-3");

    step1.classList.add("active");
    await new Promise(r => setTimeout(r, 700));

    step2.classList.add("active");
    await new Promise(r => setTimeout(r, 800));

    step3.classList.add("active");
    await new Promise(r => setTimeout(r, 600));

    // Seleciona um template da piscina de tópicos de C++
    const subtopic = this.getCurrentSubtopic();
    const existingTitles = new Set(subtopic.lessons.map(l => l.title));
    const available = dailyLessonPool.find(p => !existingTitles.has(p.title)) || dailyLessonPool[0];

    const newLesson = {
      id: "cpp_daily_" + Date.now(),
      title: available.title,
      icon: available.icon,
      status: "current",
      isDailyAi: true,
      dateCreated: new Date().toLocaleDateString("pt-BR"),
      steps: available.steps
    };

    // Atualiza lições anteriores para completed ou locked conforme o fluxo
    subtopic.lessons.forEach(l => {
      if (l.status === "current") l.status = "completed";
    });

    subtopic.lessons.push(newLesson);
    this.saveState();

    this.sounds.playVictory();
    this.vibrate([100, 50, 100]);
    this.closeGeneratorModal();
    this.renderPath();

    alert(`🎉 Nova aula criada com sucesso!\n"${newLesson.title}" foi pesquisada e adicionada à sua trilha de C++!`);
  }

  // ============================================================================
  // Player de Lição Interativa com Botões Grandes
  // ============================================================================
  startLesson(lesson) {
    this.activeLesson = lesson;
    this.currentStepIndex = 0;
    this.selectedOptionIndex = null;
    this.isStepAnswered = false;

    this.lessonPlayer.classList.remove("hidden");
    this.renderCurrentStep();
  }

  exitLesson() {
    if (confirm("Deseja sair da aula agora? Seu progresso nesta sessão não será gravado.")) {
      this.lessonPlayer.classList.add("hidden");
      this.activeLesson = null;
    }
  }

  selectQuizOption(index) {
    if (this.isStepAnswered) return;
    this.vibrate(25);
    const options = this.playerStepContent.querySelectorAll(".btn-quiz-option");
    options.forEach(b => b.classList.remove("selected"));
    if (options[index]) {
      options[index].classList.add("selected");
      this.selectedOptionIndex = index;
      this.btnPlayerAction.disabled = false;
    }
  }

  renderCurrentStep() {
    this.selectedOptionIndex = null;
    this.isStepAnswered = false;
    this.feedbackBanner.className = "feedback-banner hidden";

    const steps = this.activeLesson.steps;
    const progressPercent = Math.round((this.currentStepIndex / steps.length) * 100);
    this.lessonProgressFill.style.width = `${progressPercent}%`;

    const step = steps[this.currentStepIndex];
    this.playerStepContent.innerHTML = "";

    // Título do passo
    const heading = document.createElement("h2");
    heading.className = "step-heading";
    heading.textContent = step.heading || "Lição";
    this.playerStepContent.appendChild(heading);

    if (step.type === "explanation") {
      const card = document.createElement("div");
      card.className = "step-card";
      card.innerHTML = `<p>${step.text}</p>`;

      if (step.code) {
        const codePre = document.createElement("pre");
        codePre.className = "code-block";
        codePre.textContent = step.code;
        card.appendChild(codePre);
      }
      this.playerStepContent.appendChild(card);

      this.btnPlayerAction.textContent = "CONTINUAR";
      this.btnPlayerAction.disabled = false;
    } else if (step.type === "keypoint") {
      const keypoint = document.createElement("div");
      keypoint.className = "step-keypoint";
      keypoint.innerHTML = `
        <span class="keypoint-icon">💡</span>
        <div class="keypoint-text">${step.text}</div>
      `;
      this.playerStepContent.appendChild(keypoint);

      this.btnPlayerAction.textContent = "ENTENDI";
      this.btnPlayerAction.disabled = false;
    } else if (step.type === "quiz") {
      const questionText = document.createElement("p");
      questionText.style.fontSize = "1.25rem";
      questionText.style.fontWeight = "800";
      questionText.style.marginBottom = "16px";
      questionText.textContent = step.question;
      this.playerStepContent.appendChild(questionText);

      const optionsList = document.createElement("div");
      optionsList.className = "quiz-options-list";

      const letters = ["A", "B", "C", "D"];
      step.options.forEach((opt, idx) => {
        const btnOpt = document.createElement("button");
        btnOpt.className = "btn-quiz-option";
        btnOpt.innerHTML = `
          <div class="option-badge">${letters[idx]}</div>
          <span>${opt}</span>
        `;

        btnOpt.addEventListener("click", () => this.selectQuizOption(idx));
        optionsList.appendChild(btnOpt);
      });

      this.playerStepContent.appendChild(optionsList);
      this.btnPlayerAction.textContent = "VERIFICAR";
      this.btnPlayerAction.disabled = true;
    }
  }

  handlePlayerAction() {
    this.vibrate(30);
    const step = this.activeLesson.steps[this.currentStepIndex];

    if (step.type === "quiz" && !this.isStepAnswered) {
      if (this.selectedOptionIndex === null) return;

      this.isStepAnswered = true;
      const isCorrect = this.selectedOptionIndex === step.correctIndex;

      if (isCorrect) {
        this.sounds.playCorrect();
        this.vibrate([40, 40, 80]);
        this.feedbackBanner.className = "feedback-banner correct";
        this.feedbackIcon.textContent = "✓";
        this.feedbackTitle.textContent = "Muito bem!";
        this.feedbackMessage.textContent = step.explanation || "Resposta correta!";
      } else {
        this.sounds.playWrong();
        this.vibrate(150);
        this.feedbackBanner.className = "feedback-banner wrong";
        this.feedbackIcon.textContent = "✕";
        this.feedbackTitle.textContent = "Quase lá!";
        this.feedbackMessage.textContent = step.explanation || `A resposta correta é: ${step.options[step.correctIndex]}`;
      }

      this.feedbackBanner.classList.remove("hidden");
      this.btnPlayerAction.textContent = "CONTINUAR";
      return;
    }

    // Avança para o próximo passo
    this.currentStepIndex++;
    if (this.currentStepIndex < this.activeLesson.steps.length) {
      this.renderCurrentStep();
    } else {
      this.showVictoryScreen();
    }
  }

  showVictoryScreen() {
    this.sounds.playVictory();
    this.vibrate([100, 50, 100, 50, 200]);
    this.lessonProgressFill.style.width = "100%";

    // Recompensas
    this.xp += 25;
    this.activeLesson.status = "completed";

    // Destrava a próxima lição na trilha se houver
    const subtopic = this.getCurrentSubtopic();
    const currIdx = subtopic.lessons.findIndex(l => l.id === this.activeLesson.id);
    if (currIdx !== -1 && currIdx + 1 < subtopic.lessons.length) {
      if (subtopic.lessons[currIdx + 1].status === "locked") {
        subtopic.lessons[currIdx + 1].status = "current";
      }
    }

    this.saveState();
    this.renderHeader();

    this.playerStepContent.innerHTML = `
      <div class="victory-screen">
        <div class="victory-trophy">🏆</div>
        <h2 class="victory-title">Lição Concluída!</h2>
        <p style="font-size: 1.15rem; color: #555;">Você deu mais um passo fundamental em <strong>${subtopic.name}</strong>!</p>
        
        <div class="victory-stats">
          <div class="v-stat-card">
            <div class="v-stat-val">+25</div>
            <div class="v-stat-lbl">XP GANHO</div>
          </div>
          <div class="v-stat-card">
            <div class="v-stat-val">100%</div>
            <div class="v-stat-lbl">PRECISÃO</div>
          </div>
        </div>
      </div>
    `;

    this.feedbackBanner.classList.add("hidden");
    this.btnPlayerAction.textContent = "CONCLUIR";
    this.btnPlayerAction.onclick = () => {
      this.lessonPlayer.classList.add("hidden");
      this.activeLesson = null;
      this.btnPlayerAction.onclick = () => this.handlePlayerAction();
      this.renderPath();
    };
  }
}

// Inicializa o aplicativo ao carregar a página
window.addEventListener("DOMContentLoaded", () => {
  window.app = new LearnApp();
});
