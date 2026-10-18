// ============================================================================
// LearnApp - Aplicação de Aprendizado Diário Adaptativa (Android & Desktop)
// Suporte a Modo Escuro Automático, Configurações e Trilha de Baixo para Cima
// ============================================================================

class SoundManager {
  constructor(app) {
    this.app = app;
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
    if (this.app && !this.app.isSoundEnabled) return;
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
    if (this.app && !this.app.isSoundEnabled) return;
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
    if (this.app && !this.app.isSoundEnabled) return;
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
    this.loadSettings();
    this.sounds = new SoundManager(this);
    this.loadState();

    this.currentTopicId = "programacao";
    this.currentSubtopicId = "cpp";

    this.activeLesson = null;
    this.currentStepIndex = 0;
    this.selectedOptionIndex = null;
    this.isStepAnswered = false;

    this.initElements();
    this.applyTheme(this.themePreference);
    this.bindEvents();
    this.bindKeyboardShortcuts();
    this.renderHeader();
    this.renderPath();

    // Rola suavemente até o nó ativo da trilha
    setTimeout(() => this.scrollToActiveLesson(), 300);
  }

  // ============================================================================
  // Gerenciamento de Configurações e Modo Escuro
  // ============================================================================
  loadSettings() {
    this.themePreference = localStorage.getItem("learn_app_theme") || "system";
    this.isSoundEnabled = localStorage.getItem("learn_app_sound") !== "false";
    this.isVibrationEnabled = localStorage.getItem("learn_app_vibration") !== "false";
  }

  saveSettings() {
    localStorage.setItem("learn_app_theme", this.themePreference);
    localStorage.setItem("learn_app_sound", this.isSoundEnabled ? "true" : "false");
    localStorage.setItem("learn_app_vibration", this.isVibrationEnabled ? "true" : "false");
  }

  applyTheme(theme) {
    this.themePreference = theme;
    this.saveSettings();

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    if (theme === "system") {
      const isSystemDark = mediaQuery.matches;
      document.documentElement.setAttribute("data-theme", isSystemDark ? "dark" : "light");
    } else {
      document.documentElement.setAttribute("data-theme", theme);
    }

    // Atualiza classes ativas dos botões de tema
    document.querySelectorAll(".theme-option-btn").forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-theme") === theme);
    });

    // Se estiver no Android nativo, atualiza cor da barra de status se disponível
    if (window.AndroidBridge && typeof window.AndroidBridge.setDarkTheme === "function") {
      try {
        const isDark = document.documentElement.getAttribute("data-theme") === "dark";
        window.AndroidBridge.setDarkTheme(isDark);
      } catch (e) {}
    }
  }

  // Vibração tátil no Android nativo (Kotlin) ou Web API
  vibrate(ms = 40) {
    if (!this.isVibrationEnabled) return;
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
    const CURRENT_DATA_VERSION = "1.5.0";
    const savedVersion = localStorage.getItem("learn_app_data_version");
    const savedCourses = localStorage.getItem("learn_app_courses");

    if (savedCourses && savedVersion === CURRENT_DATA_VERSION) {
      try {
        this.coursesData = JSON.parse(savedCourses);
      } catch (e) {
        this.coursesData = initialCoursesData;
      }
    } else {
      // Migra ou carrega nova versão com suporte a passos longos e desafios práticos de código
      this.coursesData = this.mergeWithInitialData(savedCourses ? JSON.parse(savedCourses) : null);
      localStorage.setItem("learn_app_data_version", CURRENT_DATA_VERSION);
      this.saveState();
    }

    this.xp = parseInt(localStorage.getItem("learn_app_xp") || "120", 10);
    this.streak = parseInt(localStorage.getItem("learn_app_streak") || "1", 10);
  }

  // Preserva o status (completed/current) das lições ao atualizar para a nova versão de conteúdo
  mergeWithInitialData(savedData) {
    if (!savedData || !savedData.topics) return initialCoursesData;
    const completedMap = new Map();
    try {
      savedData.topics.forEach(t => {
        t.subtopics.forEach(s => {
          this.getSubtopicLessons(s).forEach(l => {
            if (l.status === "completed" || l.status === "current") {
              completedMap.set(l.id, l.status);
            }
          });
        });
      });

      // Aplica aos novos dados
      initialCoursesData.topics.forEach(t => {
        t.subtopics.forEach(s => {
          this.getSubtopicLessons(s).forEach(l => {
            if (completedMap.has(l.id)) {
              l.status = completedMap.get(l.id);
            }
          });
        });
      });
    } catch (e) {
      console.warn("Erro ao mesclar dados de versão anterior:", e);
    }
    return initialCoursesData;
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
    this.btnOpenSettings = document.getElementById("btn-open-settings");

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

    this.settingsModal = document.getElementById("settings-modal");
    this.closeSettingsModalBtn = document.getElementById("close-settings-modal");
    this.settingSound = document.getElementById("setting-sound");
    this.settingVibration = document.getElementById("setting-vibration");
    this.btnResetProgress = document.getElementById("btn-reset-progress");

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

    // Sincroniza switches de configurações
    if (this.settingSound) this.settingSound.checked = this.isSoundEnabled;
    if (this.settingVibration) this.settingVibration.checked = this.isVibrationEnabled;
  }

  bindEvents() {
    this.topicSelectorBtn.addEventListener("click", () => this.openTopicModal());
    this.closeTopicModalBtn.addEventListener("click", () => this.closeTopicModal());

    this.btnOpenSettings.addEventListener("click", () => this.openSettingsModal());
    this.closeSettingsModalBtn.addEventListener("click", () => this.closeSettingsModal());

    // Seletor de Tema
    document.querySelectorAll(".theme-option-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const theme = btn.getAttribute("data-theme");
        this.applyTheme(theme);
      });
    });

    // Escuta mudanças de tema no sistema operacional do celular em tempo real
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
      if (this.themePreference === "system") {
        this.applyTheme("system");
      }
    });

    // Toggles de Som e Vibração
    if (this.settingSound) {
      this.settingSound.addEventListener("change", (e) => {
        this.isSoundEnabled = e.target.checked;
        this.saveSettings();
      });
    }

    if (this.settingVibration) {
      this.settingVibration.addEventListener("change", (e) => {
        this.isVibrationEnabled = e.target.checked;
        this.saveSettings();
        if (this.isVibrationEnabled) this.vibrate(50);
      });
    }

    // Resetar progresso
    if (this.btnResetProgress) {
      this.btnResetProgress.addEventListener("click", () => {
        if (confirm("Deseja realmente redefinir seu progresso? Todas as aulas voltarão ao estado inicial.")) {
          localStorage.removeItem("learn_app_courses");
          localStorage.removeItem("learn_app_xp");
          localStorage.removeItem("learn_app_streak");
          this.loadState();
          this.renderHeader();
          this.renderPath();
          this.closeSettingsModal();
          alert("Progresso redefinido com sucesso!");
        }
      });
    }

    if (this.btnSimulateDaily) {
      this.btnSimulateDaily.addEventListener("click", () => this.openGeneratorModal());
    }
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
          this.closeSettingsModal();
        }
      }
    });
  }

  getSubtopicLessons(subtopic) {
    if (!subtopic) return [];
    if (subtopic.sections && Array.isArray(subtopic.sections)) {
      return subtopic.sections.flatMap(sec => sec.lessons || []);
    }
    return subtopic.lessons || [];
  }

  renderHeader() {
    const topic = this.coursesData.topics.find(t => t.id === this.currentTopicId);
    const subtopic = this.getCurrentSubtopic();

    if (topic && subtopic) {
      if (this.currentCategoryEl) this.currentCategoryEl.textContent = topic.name;
      if (this.currentSubtopicEl) this.currentSubtopicEl.textContent = subtopic.name;
      if (this.heroTitleEl) this.heroTitleEl.textContent = subtopic.heroTitle || subtopic.name;
      if (this.heroDescEl) this.heroDescEl.textContent = subtopic.description;
    }

    if (this.streakCountEl) this.streakCountEl.textContent = this.streak;
    if (this.xpCountEl) this.xpCountEl.textContent = this.xp;
  }

  // ============================================================================
  // Renderização da Trilha em Partes / Graus de Dificuldade (Estilo Duolingo)
  // ============================================================================
  renderPath() {
    const subtopic = this.getCurrentSubtopic();
    if (!subtopic) return;

    this.nodesList.innerHTML = "";

    const sections = subtopic.sections || [
      {
        id: "default_sec",
        number: 1,
        difficulty: "Completo",
        title: subtopic.heroTitle || subtopic.name,
        description: subtopic.description,
        gradientClass: "gradient-blue",
        lessons: subtopic.lessons || []
      }
    ];

    let globalIndex = 0;

    sections.forEach(section => {
      // 1. Cria o Card da Seção (Grau de Dificuldade)
      const sectionCard = document.createElement("div");
      sectionCard.className = `section-card ${section.gradientClass || "gradient-blue"}`;
      sectionCard.innerHTML = `
        <div class="section-badge">Parte ${section.number} • ${section.difficulty}</div>
        <h2 class="section-title">${section.title}</h2>
        <p class="section-desc">${section.description}</p>
      `;
      this.nodesList.appendChild(sectionCard);

      // 2. Cria os nós das lições pertencentes a esta seção
      (section.lessons || []).forEach(lesson => {
        const offset = Math.round(Math.sin(globalIndex * 1.1) * 72);

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
          titleBadge.textContent = `${globalIndex + 1}. ${lesson.title}`;
        }

        nodeWrapper.appendChild(circleBtn);
        nodeWrapper.appendChild(titleBadge);
        this.nodesList.appendChild(nodeWrapper);

        globalIndex++;
      });
    });

    // Conectar nós com curvas SVG após renderizar o DOM
    setTimeout(() => this.drawConnectingPath(), 80);
  }

  // Rola até a lição atual para o usuário começar no lugar certo
  scrollToActiveLesson() {
    const currentWrapper = this.nodesList.querySelector(".node-wrapper.current") || this.nodesList.querySelector(".node-wrapper");
    if (currentWrapper) {
      currentWrapper.scrollIntoView({ behavior: "smooth", block: "center" });
    }
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

    // Como .nodes-list tem column-reverse, wrappers[0] é a lição 1 (embaixo)
    // Conectamos de wrappers[0] subindo até wrappers[length - 1]
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

    const pathLineColor = document.documentElement.getAttribute("data-theme") === "dark" ? "#2b313f" : "#e5e5e5";

    this.pathSvg.innerHTML = `
      <path d="${pathD}" fill="none" stroke="${pathLineColor}" stroke-width="12" stroke-linecap="round" stroke-dasharray="8 12" />
    `;
  }

  // ============================================================================
  // Modal de Configurações
  // ============================================================================
  openSettingsModal() {
    this.vibrate(25);
    this.settingsModal.classList.remove("hidden");
  }

  closeSettingsModal() {
    this.settingsModal.classList.add("hidden");
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

        const allSubLessons = this.getSubtopicLessons(sub);
        const partsCount = (sub.sections && sub.sections.length) || 1;

        item.innerHTML = `
          <div class="subtopic-left">
            <span class="subtopic-icon">${sub.icon}</span>
            <div>
              <div class="subtopic-title-text">${sub.name}</div>
              <div class="subtopic-lessons-count">${allSubLessons.length} aulas • ${partsCount} partes</div>
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
          setTimeout(() => this.scrollToActiveLesson(), 300);
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

    const subtopic = this.getCurrentSubtopic();
    const allLessons = this.getSubtopicLessons(subtopic);
    const existingTitles = new Set(allLessons.map(l => l.title));
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

    allLessons.forEach(l => {
      if (l.status === "current") l.status = "completed";
    });

    if (subtopic.sections && subtopic.sections.length > 0) {
      subtopic.sections[subtopic.sections.length - 1].lessons.push(newLesson);
    } else {
      if (!subtopic.lessons) subtopic.lessons = [];
      subtopic.lessons.push(newLesson);
    }
    this.saveState();

    this.sounds.playVictory();
    this.vibrate([100, 50, 100]);
    this.closeGeneratorModal();
    this.renderPath();

    setTimeout(() => {
      // Rola para o topo onde a nova aula surgiu
      const latestNode = this.nodesList.querySelector(".node-wrapper:last-child");
      if (latestNode) latestNode.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 200);

    alert(`🎉 Nova aula criada com sucesso na trilha!\n"${newLesson.title}" foi pesquisada e adicionada à sua trilha de C++!`);
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
    } else if (step.type === "code_challenge") {
      const container = document.createElement("div");
      container.className = "code-challenge-container";

      // Banner da Missão Prática
      const missionBox = document.createElement("div");
      missionBox.className = "mission-banner";
      missionBox.innerHTML = `
        <span class="mission-icon">🎯</span>
        <div class="mission-text">
          <strong>MISSÃO PRÁTICA:</strong>
          <span>${step.instructions}</span>
        </div>
      `;
      container.appendChild(missionBox);

      // Caixa do Editor de Código C++
      const editorBox = document.createElement("div");
      editorBox.className = "code-editor-box";

      const windowBar = document.createElement("div");
      windowBar.className = "editor-window-bar";
      windowBar.innerHTML = `
        <div class="editor-dots">
          <span class="editor-dot red"></span>
          <span class="editor-dot yellow"></span>
          <span class="editor-dot green"></span>
        </div>
        <span class="editor-filename">main.cpp</span>
      `;
      editorBox.appendChild(windowBar);

      if (step.prefixCode) {
        const prefix = document.createElement("div");
        prefix.className = "code-prefix";
        prefix.textContent = step.prefixCode;
        editorBox.appendChild(prefix);
      }

      const textarea = document.createElement("textarea");
      textarea.className = "code-editor-input";
      textarea.id = "player-code-input";
      textarea.rows = 3;
      textarea.spellcheck = false;
      textarea.autocapitalize = "none";
      textarea.autocomplete = "off";
      textarea.placeholder = step.placeholder || "Escreva o comando aqui...";
      textarea.value = step.initialCode || "";
      editorBox.appendChild(textarea);

      if (step.suffixCode) {
        const suffix = document.createElement("div");
        suffix.className = "code-suffix";
        suffix.textContent = step.suffixCode;
        editorBox.appendChild(suffix);
      }

      container.appendChild(editorBox);

      // Barra de Chips Táteis Rápidos (Atalhos C++ para Mobile / Android)
      const chipsWrapper = document.createElement("div");
      chipsWrapper.className = "quick-chips-wrapper";
      chipsWrapper.innerHTML = `<span class="quick-chips-label">Atalhos rápidos para o código:</span>`;

      const chipsScroll = document.createElement("div");
      chipsScroll.className = "quick-chips-scroll";

      const chipsList = step.quickChips || ["std::cout", "<<", "\"Ola, Mundo!\"", "std::endl;", ";"];
      chipsList.forEach(chipText => {
        const chipBtn = document.createElement("button");
        chipBtn.className = "chip-btn";
        chipBtn.type = "button";
        chipBtn.textContent = chipText;
        chipBtn.addEventListener("click", () => {
          this.vibrate(15);
          this.insertCodeSnippet(textarea, chipText);
        });
        chipsScroll.appendChild(chipBtn);
      });

      chipsWrapper.appendChild(chipsScroll);
      container.appendChild(chipsWrapper);

      // Console Terminal Simulado
      const termBox = document.createElement("div");
      termBox.className = "terminal-simulator";
      termBox.innerHTML = `
        <div class="terminal-header">
          <span class="term-title">terminal — bash</span>
          <span style="font-size: 0.72rem; color: #4ade80;">● online</span>
        </div>
        <pre class="term-output" id="player-terminal-output">$ g++ -std=c++20 main.cpp -o app\nAguardando compilação... Clique em "COMPILAR & EXECUTAR" abaixo.</pre>
      `;
      container.appendChild(termBox);

      this.playerStepContent.appendChild(container);
      this.btnPlayerAction.textContent = "COMPILAR & EXECUTAR";
      this.btnPlayerAction.disabled = false;
    }
  }

  // Inserção inteligente de código na posição do cursor
  insertCodeSnippet(textarea, snippet) {
    const start = textarea.selectionStart || 0;
    const end = textarea.selectionEnd || 0;
    const text = textarea.value;
    textarea.value = text.substring(0, start) + snippet + text.substring(end);
    textarea.focus();
    const newPos = start + snippet.length;
    textarea.setSelectionRange(newPos, newPos);
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

    if (step.type === "code_challenge" && !this.isStepAnswered) {
      const inputEl = document.getElementById("player-code-input");
      const termEl = document.getElementById("player-terminal-output");
      const userCode = inputEl ? inputEl.value.trim() : "";

      const validation = step.validation || {};
      const expectedTokens = validation.expectedTokens || [];

      // Verifica se todos os tokens esperados estão presentes no código
      const isCorrect = expectedTokens.every(tok => userCode.includes(tok));

      if (isCorrect) {
        this.isStepAnswered = true;
        this.sounds.playCorrect();
        this.vibrate([40, 40, 80]);

        if (termEl) {
          termEl.className = "term-output success";
          termEl.textContent = `$ g++ -std=c++20 main.cpp -o app\n$ ./app\n${validation.expectedOutput || "Executado com sucesso!\n[Processo finalizado com código 0]"}`;
        }

        this.feedbackBanner.className = "feedback-banner correct";
        this.feedbackIcon.textContent = "✓";
        this.feedbackTitle.textContent = "Compilado com Sucesso! 🚀";
        this.feedbackMessage.textContent = "Excelente! Você escreveu o código corretamente e cumpriu a missão inicial desta aula!";
        this.feedbackBanner.classList.remove("hidden");

        this.btnPlayerAction.textContent = "CONTINUAR";
      } else {
        this.sounds.playWrong();
        this.vibrate(150);

        if (termEl) {
          termEl.className = "term-output error";
          termEl.textContent = `$ g++ -std=c++20 main.cpp -o app\nmain.cpp: erro: instrução incompleta ou sintaxe incorreta.\n> ${validation.hint || "Revise se incluiu todos os comandos pedidos."}`;
        }

        this.feedbackBanner.className = "feedback-banner wrong";
        this.feedbackIcon.textContent = "✕";
        this.feedbackTitle.textContent = "Erro na Compilação";
        this.feedbackMessage.textContent = validation.hint || "Revise o código digitado e clique em COMPILAR & EXECUTAR novamente.";
        this.feedbackBanner.classList.remove("hidden");
      }
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
    const allLessons = this.getSubtopicLessons(subtopic);
    const currIdx = allLessons.findIndex(l => l.id === this.activeLesson.id);
    if (currIdx !== -1 && currIdx + 1 < allLessons.length) {
      if (allLessons[currIdx + 1].status === "locked") {
        allLessons[currIdx + 1].status = "current";
      }
    }

    this.saveState();
    this.renderHeader();

    this.playerStepContent.innerHTML = `
      <div class="victory-screen">
        <div class="victory-trophy">🏆</div>
        <h2 class="victory-title">Lição Concluída!</h2>
        <p style="font-size: 1.15rem; color: var(--text-secondary);">Você deu mais um passo rumo ao topo em <strong>${subtopic.name}</strong>!</p>
        
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
