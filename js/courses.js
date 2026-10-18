// Base de dados inicial dos Cursos, Tópicos e Subtópicos
const initialCoursesData = {
  topics: [
    {
      id: "programacao",
      name: "Programação",
      icon: "💻",
      subtopics: [
        {
          id: "cpp",
          name: "C++",
          icon: "⚡",
          description: "Domine a linguagem de alta performance, ponteiros, POO e recursos modernos.",
          heroTitle: "C++ Moderno & Fundamentos",
          lessons: [
            {
              id: "cpp_1",
              title: "Olá, Mundo!",
              icon: "🚀",
              status: "completed",
              isDailyAi: false,
              steps: [
                {
                  type: "explanation",
                  heading: "Seu primeiro código em C++",
                  text: "C++ é uma das linguagens mais rápidas e usadas no mundo em motores de jogos, navegadores e sistemas operacionais.",
                  code: '#include <iostream>\n\nint main() {\n    std::cout << "Ola, Mundo!" << std::endl;\n    return 0;\n}'
                },
                {
                  type: "keypoint",
                  heading: "Ponto-Chave",
                  text: "O comando 'std::cout' envia texto para a tela, e o 'std::endl' pula uma linha."
                },
                {
                  type: "quiz",
                  heading: "Teste Rápido",
                  question: "Qual comando é usado em C++ para imprimir informações na tela?",
                  options: ["std::cin", "std::cout", "print()", "System.out"],
                  correctIndex: 1,
                  explanation: "std::cout (character output) é o fluxo padrão de saída em C++!"
                }
              ]
            },
            {
              id: "cpp_2",
              title: "Variáveis & Tipos",
              icon: "📦",
              status: "current",
              isDailyAi: false,
              steps: [
                {
                  type: "explanation",
                  heading: "Guardando Dados na Memória",
                  text: "Em C++, você precisa declarar o tipo de cada variável antes de usá-la. Os tipos primitivos mais comuns são int, double, char e bool.",
                  code: 'int idade = 20;             // Numero inteiro\ndouble preco = 19.99;       // Numero com ponto decimal\nchar inicial = \'M\';         // Um unico caractere\nbool ativo = true;          // Verdadeiro ou falso'
                },
                {
                  type: "keypoint",
                  heading: "Dica de Ouro",
                  text: "Use 'double' em vez de 'float' na maioria dos casos para obter maior precisão com números decimais."
                },
                {
                  type: "quiz",
                  heading: "Desafio de Fixação",
                  question: "Qual tipo de dado você deve usar para armazenar o valor 42?",
                  options: ["char", "double", "int", "bool"],
                  correctIndex: 2,
                  explanation: "'int' é o tipo utilizado para armazenar números inteiros!"
                }
              ]
            },
            {
              id: "cpp_3",
              title: "Entrada com cin",
              icon: "⌨️",
              status: "locked",
              isDailyAi: false,
              steps: [
                {
                  type: "explanation",
                  heading: "Lendo Dados do Teclado",
                  text: "Para receber dados que o usuário digita no terminal, usamos 'std::cin' com o operador '>>'.",
                  code: 'int idade;\nstd::cout << "Digite sua idade: ";\nstd::cin >> idade;'
                },
                {
                  type: "quiz",
                  heading: "Pergunta",
                  question: "Qual operador é utilizado junto com std::cin para ler dados?",
                  options: ["<<", ">>", "==", "->"],
                  correctIndex: 1,
                  explanation: "O operador '>>' direciona os dados digitados no teclado para dentro da variável!"
                }
              ]
            },
            {
              id: "cpp_4",
              title: "Decisões com if",
              icon: "🔀",
              status: "locked",
              isDailyAi: false,
              steps: [
                {
                  type: "explanation",
                  heading: "Tomando Decisões",
                  text: "A estrutura if/else permite que o seu programa escolha caminhos diferentes com base em condições lógicas.",
                  code: 'if (nota >= 7) {\n    std::cout << "Aprovado!";\n} else {\n    std::cout << "Recuperacao";\n}'
                },
                {
                  type: "quiz",
                  heading: "Quiz",
                  question: "Qual palavra-chave executa um bloco alternativo caso o 'if' seja falso?",
                  options: ["then", "else", "otherwise", "switch"],
                  correctIndex: 1,
                  explanation: "'else' é o bloco executado quando a condição inicial do 'if' não é atendida."
                }
              ]
            }
          ]
        },
        {
          id: "python",
          name: "Python",
          icon: "🐍",
          description: "Aprenda sintaxe limpa, automação, análise de dados e inteligência artificial.",
          heroTitle: "Python do Zero",
          lessons: [
            {
              id: "py_1",
              title: "Primeiros Passos",
              icon: "🚀",
              status: "current",
              isDailyAi: false,
              steps: [
                {
                  type: "explanation",
                  heading: "Bem-vindo ao Python",
                  text: "Python é conhecido por sua sintaxe simples e legível, perfeita para iniciantes e especialistas.",
                  code: 'print("Ola do Python!")'
                },
                {
                  type: "quiz",
                  heading: "Quiz Inicial",
                  question: "Qual função imprime texto na tela em Python?",
                  options: ["echo()", "console.log()", "print()", "write()"],
                  correctIndex: 2,
                  explanation: "A função print() é o comando padrão de saída em Python."
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "idiomas",
      name: "Idiomas",
      icon: "🌍",
      subtopics: [
        {
          id: "ingles",
          name: "Inglês",
          icon: "🇬🇧",
          description: "Pratique conversação diária, vocabulário e expressões comuns.",
          heroTitle: "Inglês Prático Diário",
          lessons: [
            {
              id: "eng_1",
              title: "Saudações",
              icon: "👋",
              status: "current",
              isDailyAi: false,
              steps: [
                {
                  type: "explanation",
                  heading: "Greetings in English",
                  text: "Para cumprimentar pessoas em inglês, usamos saudações comuns do dia a dia como Hello, Good Morning e How are you?",
                  code: 'A: Good morning! How are you?\nB: I am fine, thank you!'
                },
                {
                  type: "quiz",
                  heading: "Desafio",
                  question: "Como se diz 'Bom dia' em inglês?",
                  options: ["Good night", "Good evening", "Good morning", "Goodbye"],
                  correctIndex: 2,
                  explanation: "'Good morning' é a saudação adequada pela manhã!"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

// Banco de tópicos de C++ para o Robô Gerador Diário pesquisar e adicionar automaticamente
const dailyLessonPool = [
  {
    title: "Laços com for",
    icon: "🔁",
    steps: [
      {
        type: "explanation",
        heading: "Repetindo Códigos com for",
        text: "Pesquisa na web: O laço 'for' em C++ é ideal quando você sabe exatamente quantas vezes deseja repetir uma instrução.",
        code: 'for (int i = 0; i < 5; i++) {\n    std::cout << "Contador: " << i << std::endl;\n}'
      },
      {
        type: "keypoint",
        heading: "Ponto-Chave da IA",
        text: "O operador 'i++' incrementa a variável de controle em +1 a cada volta do laço."
      },
      {
        type: "quiz",
        heading: "Pergunta Gerada pela IA",
        question: "Quantas vezes o laço 'for(int i = 0; i < 3; i++)' será executado?",
        options: ["2 vezes", "3 vezes", "4 vezes", "Infinitas vezes"],
        correctIndex: 1,
        explanation: "Os valores de i serão 0, 1 e 2, totalizando exatamente 3 repetições!"
      }
    ]
  },
  {
    title: "Vetores (std::vector)",
    icon: "📚",
    steps: [
      {
        type: "explanation",
        heading: "Listas Dinâmicas em C++",
        text: "Pesquisa na web: Diferente de arrays fixos, o 'std::vector' pode crescer e diminuir de tamanho dinamicamente na memória.",
        code: '#include <vector>\n\nstd::vector<int> numeros = {10, 20, 30};\nnumeros.push_back(40); // Adiciona o 40 no final'
      },
      {
        type: "keypoint",
        heading: "Ponto-Chave da IA",
        text: "O método 'push_back()' insere um novo item no final do vetor de forma automática."
      },
      {
        type: "quiz",
        heading: "Quiz de Fixação",
        question: "Qual método do std::vector adiciona um elemento no fim da coleção?",
        options: ["add()", "push_back()", "append()", "insert_end()"],
        correctIndex: 1,
        explanation: "push_back() é o método padrão da STL de C++ para inserir no final do vetor!"
      }
    ]
  },
  {
    title: "Funções em C++",
    icon: "🧩",
    steps: [
      {
        type: "explanation",
        heading: "Modularizando seu Código",
        text: "Funções dividem seu programa em blocos reutilizáveis com entrada (parâmetros) e saída (retorno).",
        code: 'int somar(int a, int b) {\n    return a + b;\n}\n\nint resultado = somar(5, 7); // resultado sera 12'
      },
      {
        type: "quiz",
        heading: "Desafio da Função",
        question: "Qual palavra-chave indica que uma função NÃO retorna nenhum valor?",
        options: ["null", "empty", "void", "none"],
        correctIndex: 2,
        explanation: "O tipo 'void' significa que a função executa uma tarefa sem produzir valor de retorno."
      }
    ]
  }
];
