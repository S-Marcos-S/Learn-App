// Base de dados inicial dos Cursos
const initialCoursesData = {
  "topics": [
    {
      "id": "programacao",
      "name": "Programação",
      "icon": "💻",
      "subtopics": [
        {
          "id": "cpp",
          "name": "C++",
          "icon": "⚡",
          "description": "Domine a linguagem de alta performance dividida em partes por dificuldade.",
          "sections": [
            {
              "id": "cpp_sec_1",
              "number": 1,
              "difficulty": "Iniciante",
              "title": "C++ Fundamentos & Sintaxe",
              "description": "Dê os primeiros passos com sintaxe básica, tipos primitivos e comandos de entrada e saída.",
              "gradientClass": "gradient-blue",
              "lessons": [
                {
                  "id": "cpp_1",
                  "title": "Olá, Mundo!",
                  "icon": "🚀",
                  "status": "completed",
                  "isDailyAi": false,
                  "steps": [
                    {
                      "type": "explanation",
                      "heading": "🎯 Missão Inicial: Seu Primeiro Programa",
                      "text": "Sua missão de hoje é programar uma saudação no terminal que imprima exatamente a mensagem 'Ola, Mundo!' e pule uma linha. Vamos aprender os blocos necessários passo a passo até você escrever todo o código no final desta aula!"
                    },
                    {
                      "type": "explanation",
                      "heading": "Como o C++ enxerga o mundo?",
                      "text": "Um programa é uma sequência ordenada de instruções. Em C++, todo programa começa obrigatoriamente dentro de uma função principal chamada 'main()'. Quando ela termina com 'return 0;', o computador sabe que a execução teve sucesso.",
                      "code": "int main() {\n    // O computador começa aqui!\n    return 0;\n}"
                    },
                    {
                      "type": "explanation",
                      "heading": "O Canal de Saída: std::cout",
                      "text": "Para enviar mensagens à tela usamos 'std::cout' (Character Output). Usamos o operador '<<' que empurra o texto para a tela, e 'std::endl' para finalizar a linha.",
                      "code": "#include <iostream>\n\nint main() {\n    std::cout << \"Ola, Mundo!\" << std::endl;\n    return 0;\n}"
                    },
                    {
                      "type": "keypoint",
                      "heading": "Atenção ao Ponto-e-Vírgula!",
                      "text": "Quase todas as instruções em C++ devem terminar obrigatoriamente com ponto-e-vírgula ';'. Esquecê-lo é o erro mais clássico de iniciantes!"
                    },
                    {
                      "type": "quiz",
                      "heading": "Teste de Fixação",
                      "question": "Qual comando é usado em C++ para imprimir informações na tela?",
                      "options": ["std::cin", "std::cout", "print()", "System.out"],
                      "correctIndex": 1,
                      "explanation": "std::cout é o fluxo padrão de saída do C++ na biblioteca <iostream>!"
                    },
                    {
                      "type": "code_challenge",
                      "heading": "Hora de Codificar: Missão Olá Mundo",
                      "instructions": "Agora é sua vez de cumprir a missão inicial! Complete a linha abaixo imprimindo 'Ola, Mundo!' usando std::cout e finalizando com << std::endl;",
                      "prefixCode": "#include <iostream>\n\nint main() {\n    ",
                      "placeholder": "std::cout << \"Ola, Mundo!\" << std::endl;",
                      "initialCode": "std::cout << ",
                      "suffixCode": "\n    return 0;\n}",
                      "quickChips": ["std::cout", "<<", "\"Ola, Mundo!\"", "<< std::endl;", ";"],
                      "validation": {
                        "expectedTokens": ["std::cout", "<<", "\"Ola, Mundo!\"", ";"],
                        "expectedOutput": "Ola, Mundo!\n\n[Processo finalizado com código 0 - Sucesso!]",
                        "hint": "Complete a instrução: std::cout << \"Ola, Mundo!\" << std::endl;"
                      }
                    }
                  ]
                },
                {
                  "id": "cpp_2",
                  "title": "Variáveis & Tipos",
                  "icon": "📦",
                  "status": "current",
                  "isDailyAi": false,
                  "steps": [
                    {
                      "type": "explanation",
                      "heading": "🎯 Missão Inicial: Pontuação do Jogador",
                      "text": "Sua missão é criar uma variável para guardar a pontuação inicial de um jogador (100 pontos) e imprimi-la na tela. Ao final da aula, você escreverá essa declaração no editor!"
                    },
                    {
                      "type": "explanation",
                      "heading": "O que são Variáveis?",
                      "text": "Imagine gavetas com etiquetas. Cada gaveta guarda um tipo específico de dado. No C++, você precisa dizer com antecedência que tipo de dado aquela gaveta aceita.",
                      "code": "int pontos = 100;     // Gaveta de número inteiro\ndouble preco = 19.99; // Gaveta com casas decimais"
                    },
                    {
                      "type": "explanation",
                      "heading": "Tipos Primitivos Comuns",
                      "text": "Os 4 tipos fundamentais são: 'int' para inteiros, 'double' para números com ponto flutuante, 'char' para um único caractere (entre aspas simples 'A'), e 'bool' para verdadeiro (true) ou falso (false).",
                      "code": "int vidas = 3;\ndouble velocidade = 95.5;\nchar categoria = 'S';\nbool vivo = true;"
                    },
                    {
                      "type": "keypoint",
                      "heading": "Dica de Ouro",
                      "text": "Sempre inicialize suas variáveis com um valor inicial (como 0 ou 100). Variáveis não inicializadas em C++ contêm lixo de memória aleatório!"
                    },
                    {
                      "type": "quiz",
                      "heading": "Desafio Rápido",
                      "question": "Qual tipo de dado é o ideal para armazenar o valor inteiro 42?",
                      "options": ["char", "double", "int", "bool"],
                      "correctIndex": 2,
                      "explanation": "'int' é o tipo padrão de alta performance para números inteiros!"
                    },
                    {
                      "type": "code_challenge",
                      "heading": "Hora de Codificar: Declarando Pontos",
                      "instructions": "Cumpra a missão: declare uma variável inteira chamada 'pontos' com o valor 100 e termine com ponto-e-vírgula ';'",
                      "prefixCode": "#include <iostream>\n\nint main() {\n    ",
                      "placeholder": "int pontos = 100;",
                      "initialCode": "int ",
                      "suffixCode": "\n    std::cout << \"Pontos: \" << pontos << std::endl;\n    return 0;\n}",
                      "quickChips": ["int", "pontos", "= 100;", "pontos = 100;", ";"],
                      "validation": {
                        "expectedTokens": ["int", "pontos", "100", ";"],
                        "expectedOutput": "Pontos: 100\n\n[Processo finalizado com código 0 - Sucesso!]",
                        "hint": "Escreva: int pontos = 100;"
                      }
                    }
                  ]
                },
                {
                  "id": "cpp_3",
                  "title": "Entrada com cin",
                  "icon": "⌨️",
                  "status": "locked",
                  "isDailyAi": false,
                  "steps": [
                    {
                      "type": "explanation",
                      "heading": "🎯 Missão Inicial: Lendo do Teclado",
                      "text": "Sua missão é fazer o computador perguntar a idade do usuário e ler o número digitado pelo teclado, guardando-o na variável 'idade'."
                    },
                    {
                      "type": "explanation",
                      "heading": "O que é Entrada de Dados?",
                      "text": "Até agora, seu programa só falava. Para ele ouvir, usamos o fluxo de entrada 'std::cin' (Character Input). Ele pausa o programa e espera o usuário digitar e apertar Enter."
                    },
                    {
                      "type": "explanation",
                      "heading": "O Operador >>",
                      "text": "Repare no sentido da seta: enquanto 'cout <<' empurra para fora, 'cin >>' empurra os dados do teclado para DENTRO da variável!",
                      "code": "int idade;\nstd::cout << \"Qual sua idade? \";\nstd::cin >> idade;"
                    },
                    {
                      "type": "keypoint",
                      "heading": "Diferença Visual Importante",
                      "text": "cout usa '<<' (saída). cin usa '>>' (entrada). Lembrar da ponta das setas evita 90% dos erros de sintaxe!"
                    },
                    {
                      "type": "quiz",
                      "heading": "Quiz de Fixação",
                      "question": "Qual operador deve ser usado junto com std::cin para ler dados?",
                      "options": ["<<", ">>", "==", "->"],
                      "correctIndex": 1,
                      "explanation": "O operador '>>' direciona o fluxo do teclado para a variável de destino!"
                    },
                    {
                      "type": "code_challenge",
                      "heading": "Hora de Codificar: Leitura com cin",
                      "instructions": "Cumpra a missão: leia a variável 'idade' usando std::cin e o operador >>",
                      "prefixCode": "#include <iostream>\n\nint main() {\n    int idade = 0;\n    std::cout << \"Digite sua idade: \";\n    ",
                      "placeholder": "std::cin >> idade;",
                      "initialCode": "std::cin >> ",
                      "suffixCode": "\n    std::cout << \"Idade registrada: \" << idade << std::endl;\n    return 0;\n}",
                      "quickChips": ["std::cin >>", "idade;", "idade", ">>", ";"],
                      "validation": {
                        "expectedTokens": ["std::cin", ">>", "idade", ";"],
                        "expectedOutput": "Digite sua idade: 25\nIdade registrada: 25\n\n[Processo finalizado com código 0 - Sucesso!]",
                        "hint": "Escreva: std::cin >> idade;"
                      }
                    }
                  ]
                }
              ]
            },
            {
              "id": "cpp_sec_2",
              "number": 2,
              "difficulty": "Intermediário",
              "title": "Lógica & Controle de Fluxo",
              "description": "Domine tomada de decisões lógicas, laços de repetição e criação de funções modulares.",
              "gradientClass": "gradient-green",
              "lessons": [
                {
                  "id": "cpp_4",
                  "title": "Decisões com if",
                  "icon": "🔀",
                  "status": "locked",
                  "isDailyAi": false,
                  "steps": [
                    {
                      "type": "explanation",
                      "heading": "🎯 Missão Inicial: Teste de Game Over",
                      "text": "Sua missão é criar uma verificação lógica: se a vida do personagem for menor ou igual a 0, imprima na tela a mensagem 'Game Over!'."
                    },
                    {
                      "type": "explanation",
                      "heading": "Tomando Decisões Lógicas",
                      "text": "Programas inteligentes não seguem uma única linha reta. Eles tomam decisões com base em perguntas do tipo 'sim ou não' usando a instrução 'if'."
                    },
                    {
                      "type": "explanation",
                      "heading": "Sintaxe do if e else",
                      "text": "Colocamos a condição entre parênteses '( )' e os comandos que só rodam caso seja verdadeiro entre chaves '{ }'. O 'else' é o plano B caso seja falso.",
                      "code": "if (vida <= 0) {\n    std::cout << \"Game Over!\" << std::endl;\n} else {\n    std::cout << \"Continue jogando!\" << std::endl;\n}"
                    },
                    {
                      "type": "keypoint",
                      "heading": "Cuidado com o Sinal de Igual",
                      "text": "Para comparar se dois valores são iguais, use dois sinais '=='. Um único '=' altera o valor da variável!"
                    },
                    {
                      "type": "quiz",
                      "heading": "Quiz de Condições",
                      "question": "Qual bloco é acionado caso a condição testada no 'if' resulte em falso?",
                      "options": ["then", "else", "otherwise", "case"],
                      "correctIndex": 1,
                      "explanation": "O bloco 'else' define o caminho alternativo quando a condição do if não é atendida."
                    },
                    {
                      "type": "code_challenge",
                      "heading": "Hora de Codificar: Condição de Game Over",
                      "instructions": "Cumpra a missão: escreva a verificação if (vida <= 0) que imprime 'Game Over!' no terminal.",
                      "prefixCode": "#include <iostream>\n\nint main() {\n    int vida = 0;\n    ",
                      "placeholder": "if (vida <= 0) std::cout << \"Game Over!\";",
                      "initialCode": "if (vida <= 0) ",
                      "suffixCode": "\n    return 0;\n}",
                      "quickChips": ["if (vida <= 0)", "std::cout <<", "\"Game Over!\";", "<< std::endl;", ";"],
                      "validation": {
                        "expectedTokens": ["if", "vida", "<=", "0", "std::cout", "\"Game Over!\"", ";"],
                        "expectedOutput": "Game Over!\n\n[Processo finalizado com código 0 - Sucesso!]",
                        "hint": "Escreva: if (vida <= 0) std::cout << \"Game Over!\";"
                      }
                    }
                  ]
                },
                {
                  "id": "cpp_5",
                  "title": "Laço for & Loops",
                  "icon": "🔁",
                  "status": "locked",
                  "isDailyAi": false,
                  "steps": [
                    {
                      "type": "explanation",
                      "heading": "🎯 Missão Inicial: Contagem Automática",
                      "text": "Sua missão é escrever um laço 'for' que repita uma ação exatamente 3 vezes (de 0 até 2), imprimindo o valor do contador."
                    },
                    {
                      "type": "explanation",
                      "heading": "Por que usamos laços de repetição?",
                      "text": "Computadores são incrivelmente rápidos em fazer a mesma coisa milhares de vezes. Em vez de escrever 3 comandos repetidos, usamos um loop."
                    },
                    {
                      "type": "explanation",
                      "heading": "A Anatomia do for em C++",
                      "text": "O laço for possui 3 partes separadas por ponto-e-vírgula: 1. Início do contador (int i = 0); 2. Condição de continuidade (i < 3); 3. Passo (i++).",
                      "code": "for (int i = 0; i < 3; i++) {\n    std::cout << \"Volta: \" << i << std::endl;\n}"
                    },
                    {
                      "type": "keypoint",
                      "heading": "Contagem Começa em Zero",
                      "text": "Na imensa maioria das linguagens, a contagem de repetições e índices sempre começa no 0 e vai até N-1."
                    },
                    {
                      "type": "quiz",
                      "heading": "Quiz de Repetição",
                      "question": "Quantas vezes o laço 'for (int i = 0; i < 4; i++)' será executado?",
                      "options": ["3 vezes", "4 vezes", "5 vezes", "Infinitas vezes"],
                      "correctIndex": 1,
                      "explanation": "Executa com i = 0, 1, 2 e 3, totalizando 4 execuções completas!"
                    },
                    {
                      "type": "code_challenge",
                      "heading": "Hora de Codificar: Escreva o Laço for",
                      "instructions": "Cumpra a missão: escreva o cabeçalho do laço 'for (int i = 0; i < 3; i++)'",
                      "prefixCode": "#include <iostream>\n\nint main() {\n    ",
                      "placeholder": "for (int i = 0; i < 3; i++)",
                      "initialCode": "for (",
                      "suffixCode": " {\n        std::cout << \"Contador: \" << i << std::endl;\n    }\n    return 0;\n}",
                      "quickChips": ["int i = 0;", "i < 3;", "i++)", "for (int i = 0; i < 3; i++)"],
                      "validation": {
                        "expectedTokens": ["for", "int i = 0", "i < 3", "i++"],
                        "expectedOutput": "Contador: 0\nContador: 1\nContador: 2\n\n[Processo finalizado com código 0 - Sucesso!]",
                        "hint": "Escreva: for (int i = 0; i < 3; i++)"
                      }
                    }
                  ]
                },
                {
                  "id": "cpp_6",
                  "title": "Funções Modulares",
                  "icon": "🧩",
                  "status": "locked",
                  "isDailyAi": false,
                  "steps": [
                    {
                      "type": "explanation",
                      "heading": "🎯 Missão Inicial: Função de Soma",
                      "text": "Sua missão é completar o corpo de uma função que recebe dois números inteiros (a e b) e retorna a soma deles usando o comando 'return'."
                    },
                    {
                      "type": "explanation",
                      "heading": "Dividir para Conquistar",
                      "text": "Funções funcionam como pequenas máquinas ou fábricas independentes. Você entrega os ingredientes (parâmetros) e ela entrega o produto pronto (retorno)."
                    },
                    {
                      "type": "explanation",
                      "heading": "Estrutura de uma Função",
                      "text": "Definimos o tipo que ela devolve ('int'), o nome da função ('somar'), a lista de parâmetros entre parênteses, e a devolução com 'return'.",
                      "code": "int somar(int a, int b) {\n    return a + b;\n}"
                    },
                    {
                      "type": "keypoint",
                      "heading": "Funções do tipo void",
                      "text": "Quando uma função apenas faz algo na tela e não precisa devolver nenhum número ou resultado, usamos o tipo de retorno 'void'."
                    },
                    {
                      "type": "quiz",
                      "heading": "Quiz de Funções",
                      "question": "Qual palavra-chave indica que uma função não retorna nenhum valor?",
                      "options": ["empty", "null", "void", "none"],
                      "correctIndex": 2,
                      "explanation": "'void' declara formalmente que a função não possui valor de retorno."
                    },
                    {
                      "type": "code_challenge",
                      "heading": "Hora de Codificar: Retorno da Função",
                      "instructions": "Cumpra a missão: dentro da função somar, retorne a soma de a com b usando 'return a + b;'",
                      "prefixCode": "#include <iostream>\n\nint somar(int a, int b) {\n    ",
                      "placeholder": "return a + b;",
                      "initialCode": "return ",
                      "suffixCode": "\n}\n\nint main() {\n    std::cout << \"Resultado: \" << somar(5, 3) << std::endl;\n    return 0;\n}",
                      "quickChips": ["return a + b;", "a + b;", "return", ";"],
                      "validation": {
                        "expectedTokens": ["return", "a", "+", "b", ";"],
                        "expectedOutput": "Resultado: 8\n\n[Processo finalizado com código 0 - Sucesso!]",
                        "hint": "Escreva: return a + b;"
                      }
                    }
                  ]
                }
              ]
            },
            {
              "id": "cpp_sec_3",
              "number": 3,
              "difficulty": "Avançado",
              "title": "Coleções, Memória & Desafios IA",
              "description": "Domine coleções dinâmicas da STL, ponteiros e receba novas aulas diárias pesquisadas por IA.",
              "gradientClass": "gradient-purple",
              "lessons": [
                {
                  "id": "cpp_7",
                  "title": "Vetores (std::vector)",
                  "icon": "📚",
                  "status": "locked",
                  "isDailyAi": false,
                  "steps": [
                    {
                      "type": "explanation",
                      "heading": "🎯 Missão Inicial: Adicionando Itens ao Vetor",
                      "text": "Sua missão é adicionar a nota 10 ao final de um vetor dinâmico em C++ usando o método 'push_back()'."
                    },
                    {
                      "type": "explanation",
                      "heading": "O que é um std::vector?",
                      "text": "Arrays normais em C têm tamanho fixo. O 'std::vector' é uma lista flexível da biblioteca padrão que cresce ou encolhe na memória automaticamente!"
                    },
                    {
                      "type": "explanation",
                      "heading": "Inserindo com push_back",
                      "text": "Para adicionar um item ao final da fila do vetor, chamamos o método '.push_back(valor)'. É uma das operações mais eficientes e usadas no C++ moderno.",
                      "code": "#include <vector>\n\nstd::vector<int> notas;\nnotas.push_back(10);\nnotas.push_back(9);"
                    },
                    {
                      "type": "keypoint",
                      "heading": "Tamanho Dinâmico",
                      "text": "Para saber quantos elementos o vetor tem no momento, basta chamar 'notas.size()'."
                    },
                    {
                      "type": "quiz",
                      "heading": "Quiz de Coleções",
                      "question": "Qual método do std::vector é usado para inserir um item no final da coleção?",
                      "options": ["add()", "push_back()", "append()", "insert_end()"],
                      "correctIndex": 1,
                      "explanation": "push_back() é o método padrão da STL para empurrar um novo elemento para o final do vetor!"
                    },
                    {
                      "type": "code_challenge",
                      "heading": "Hora de Codificar: Inserindo no Vetor",
                      "instructions": "Cumpra a missão: adicione o valor 10 ao vetor 'notas' usando o comando 'notas.push_back(10);'",
                      "prefixCode": "#include <iostream>\n#include <vector>\n\nint main() {\n    std::vector<int> notas;\n    ",
                      "placeholder": "notas.push_back(10);",
                      "initialCode": "notas.",
                      "suffixCode": "\n    std::cout << \"Total de notas: \" << notas.size() << std::endl;\n    return 0;\n}",
                      "quickChips": ["push_back(10);", "notas.push_back(10);", "push_back", ";"],
                      "validation": {
                        "expectedTokens": ["notas", "push_back", "10", ";"],
                        "expectedOutput": "Total de notas: 1\n\n[Processo finalizado com código 0 - Sucesso!]",
                        "hint": "Escreva: notas.push_back(10);"
                      }
                    }
                  ]
                },
                {
                  "id": "cpp_8",
                  "title": "Ponteiros & Endereços",
                  "icon": "🎯",
                  "status": "locked",
                  "isDailyAi": false,
                  "steps": [
                    {
                      "type": "explanation",
                      "heading": "🎯 Missão Inicial: Apontando para a Memória",
                      "text": "Sua missão é criar um ponteiro 'int* ptr' e guardar nele o endereço de memória da variável 'numero' usando o operador de endereço '&'."
                    },
                    {
                      "type": "explanation",
                      "heading": "O que é um Ponteiro?",
                      "text": "A memória RAM é como uma rua com milhões de casas numeradas. Um ponteiro é simplesmente uma variável que anota o número do endereço de outra casa."
                    },
                    {
                      "type": "explanation",
                      "heading": "Os Operadores & e *",
                      "text": "O operador '&' (address-of) pega o endereço onde a variável mora. O operador '*' declara o ponteiro ou acessa o valor lá dentro.",
                      "code": "int valor = 42;\nint* ptr = &valor; // ptr guarda o endereco de memoria\nstd::cout << *ptr; // *ptr acessa o valor 42"
                    },
                    {
                      "type": "keypoint",
                      "heading": "Cuidado com Ponteiros Nulos",
                      "text": "Nunca tente ler ou escrever através de um ponteiro que não aponta para nenhum lugar válido, pois isso causa falha de segmentação (crash)!"
                    },
                    {
                      "type": "quiz",
                      "heading": "Quiz de Memória",
                      "question": "Qual operador é usado para obter o endereço de memória de uma variável?",
                      "options": ["*", "&", "#", "->"],
                      "correctIndex": 1,
                      "explanation": "O operador '&' (e comercial) é o operador 'address-of' que revela onde a variável está na RAM!"
                    },
                    {
                      "type": "code_challenge",
                      "heading": "Hora de Codificar: Criando o Ponteiro",
                      "instructions": "Cumpra a missão: aponte o ponteiro 'ptr' para a variável 'numero' escrevendo 'int* ptr = &numero;'",
                      "prefixCode": "#include <iostream>\n\nint main() {\n    int numero = 42;\n    ",
                      "placeholder": "int* ptr = &numero;",
                      "initialCode": "int* ptr = ",
                      "suffixCode": "\n    std::cout << \"Valor apontado: \" << *ptr << std::endl;\n    return 0;\n}",
                      "quickChips": ["&numero;", "int* ptr = &numero;", "&numero", ";"],
                      "validation": {
                        "expectedTokens": ["int*", "ptr", "&numero", ";"],
                        "expectedOutput": "Valor apontado: 42\n\n[Processo finalizado com código 0 - Sucesso!]",
                        "hint": "Escreva: int* ptr = &numero;"
                      }
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "id": "python",
          "name": "Python",
          "icon": "🐍",
          "description": "Aprenda sintaxe limpa e automação estruturada por dificuldade.",
          "sections": [
            {
              "id": "py_sec_1",
              "number": 1,
              "difficulty": "Iniciante",
              "title": "Python Fundamentos",
              "description": "Sintaxe limpa, variáveis dinâmicas e primeiros programas.",
              "gradientClass": "gradient-blue",
              "lessons": [
                {
                  "id": "py_1",
                  "title": "Primeiros Passos",
                  "icon": "🚀",
                  "status": "current",
                  "isDailyAi": false,
                  "steps": [
                    {
                      "type": "explanation",
                      "heading": "🎯 Missão Inicial: Olá Python",
                      "text": "Sua missão é escrever seu primeiro comando em Python para imprimir na tela a mensagem 'Ola do Python!'."
                    },
                    {
                      "type": "explanation",
                      "heading": "Bem-vindo ao Python",
                      "text": "Python é famoso por sua simplicidade. Ao contrário de C++, você não precisa de ponto-e-vírgula ou declarar funções principais para tarefas simples.",
                      "code": "print(\"Ola do Python!\")"
                    },
                    {
                      "type": "keypoint",
                      "heading": "Sem Ponto-e-Vírgula",
                      "text": "Em Python, o fim da linha já indica o fim da instrução. Nada de ponto-e-vírgula obrigatório!"
                    },
                    {
                      "type": "quiz",
                      "heading": "Quiz Inicial",
                      "question": "Qual função nativa imprime dados na tela em Python?",
                      "options": ["echo()", "console.log()", "print()", "write()"],
                      "correctIndex": 2,
                      "explanation": "print() é a função universal embutida do Python para saída de dados!"
                    },
                    {
                      "type": "code_challenge",
                      "heading": "Hora de Codificar: Imprimindo em Python",
                      "instructions": "Cumpra a missão: escreva o comando print(\"Ola do Python!\")",
                      "placeholder": "print(\"Ola do Python!\")",
                      "initialCode": "print(",
                      "suffixCode": "",
                      "quickChips": ["\"Ola do Python!\")", "print(\"Ola do Python!\")", "\")"],
                      "validation": {
                        "expectedTokens": ["print", "\"Ola do Python!\""],
                        "expectedOutput": "Ola do Python!\n\n[Processo finalizado com código 0 - Sucesso!]",
                        "hint": "Escreva: print(\"Ola do Python!\")"
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
;

const dailyLessonPool = [];
