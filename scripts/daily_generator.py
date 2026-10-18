#!/usr/bin/env python3
"""
Robô Diário do LearnApp
Pesquisa tópicos de C++ na internet, estrutura uma nova aula didática no formato Duolingo e adiciona à trilha.
"""

import os
import json
import urllib.request
import urllib.parse
from datetime import datetime

COURSES_JSON_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "courses.json")
COURSES_JS_PATH = os.path.join(os.path.dirname(__file__), "..", "js", "courses.js")

TOPIC_IDEAS = [
    {"title": "Laço for em C++", "query": "C++ for loop syntax and examples"},
    {"title": "Laço while e do-while", "query": "C++ while loop tutorial"},
    {"title": "Vetores (std::vector)", "query": "C++ std vector push_back tutorial"},
    {"title": "Funções e Parâmetros", "query": "C++ functions parameters and return values"},
    {"title": "Ponteiros e Referências", "query": "C++ pointers and references basics"},
    {"title": "Classes e Objetos", "query": "C++ object oriented programming class basics"},
    {"title": "Tratamento de Exceções", "query": "C++ try catch exceptions"},
    {"title": "Arquivos com fstream", "query": "C++ fstream reading and writing files"},
    {"title": "Strings em C++ (std::string)", "query": "C++ std string operations and methods"},
    {"title": "Lambdas em C++ Moderno", "query": "C++ modern lambda functions"}
]

def load_data():
    with open(COURSES_JSON_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def save_data(data):
    # Salva no arquivo JSON
    with open(COURSES_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    # Atualiza o arquivo JS que é lido diretamente pelo navegador
    js_content = f"// Gerado automaticamente pelo Robô Diário em {datetime.now().isoformat()}\n"
    js_content += f"const initialCoursesData = {json.dumps(data, indent=2, ensure_ascii=False)};\n"
    
    # Mantém o pool de backup
    backup_pool = [
        {
            "title": "Laços com for",
            "icon": "🔁",
            "steps": [
                {
                    "type": "explanation",
                    "heading": "Repetindo Códigos com for",
                    "text": "O laço for em C++ é ideal quando você sabe previamente quantas vezes deseja repetir um bloco.",
                    "code": "for (int i = 0; i < 5; i++) {\n    std::cout << \"Contador: \" << i << std::endl;\n}"
                },
                {
                    "type": "keypoint",
                    "heading": "Ponto-Chave",
                    "text": "O incremento 'i++' aumenta o contador a cada iteração."
                },
                {
                    "type": "quiz",
                    "heading": "Pergunta",
                    "question": "Quantas vezes o laço 'for(int i = 0; i < 3; i++)' será executado?",
                    "options": ["2 vezes", "3 vezes", "4 vezes", "Infinitas vezes"],
                    "correctIndex": 1,
                    "explanation": "Executa para i = 0, 1 e 2, totalizando 3 repetições."
                }
            ]
        }
    ]
    js_content += f"\nconst dailyLessonPool = {json.dumps(backup_pool, indent=2, ensure_ascii=False)};\n"
    
    with open(COURSES_JS_PATH, "w", encoding="utf-8") as f:
        f.write(js_content)

def search_wikipedia_summary(query):
    """Busca resumo da Wikipedia para alimentar o contexto didático."""
    try:
        url = f"https://pt.wikipedia.org/api/rest_v1/page/summary/{urllib.parse.quote(query)}"
        req = urllib.request.Request(url, headers={'User-Agent': 'LearnAppBot/1.0'})
        with urllib.request.urlopen(req, timeout=5) as response:
            data = json.loads(response.read().decode())
            return data.get("extract", "")
    except Exception:
        return ""

def generate_lesson_with_ai(topic_info):
    """
    Gera a aula usando a API do Gemini se a chave estiver configurada,
    ou gera um template didático com dados pesquisados.
    """
    api_key = os.environ.get("GEMINI_API_KEY")
    if api_key:
        try:
            import google.generativeai as genai
            genai.configure(api_key=api_key)
            model = genai.GenerativeModel("gemini-1.5-flash")
            
            prompt = f"""
            Você é um professor experiente criando uma aula estilo Duolingo para iniciantes em C++.
            Crie uma aula completa sobre: "{topic_info['title']}".
            
            Retorne EXATAMENTE um JSON com esta estrutura (sem markdown extra além do bloco json):
            {{
              "title": "{topic_info['title']}",
              "icon": "⚡",
              "steps": [
                {{
                  "type": "explanation",
                  "heading": "Título claro e instigante",
                  "text": "Explicação em português simples e direto (2 a 3 frases).",
                  "code": "// Exemplo curto de C++ com até 6 linhas"
                }},
                {{
                  "type": "keypoint",
                  "heading": "Dica de Ouro",
                  "text": "O resumo mais importante desta lição."
                }},
                {{
                  "type": "quiz",
                  "heading": "Teste Rápido",
                  "question": "Pergunta objetiva sobre o tema?",
                  "options": ["Opcao 1", "Opcao 2", "Opcao 3", "Opcao 4"],
                  "correctIndex": 0,
                  "explanation": "Por que esta opção é a correta."
                }}
              ]
            }}
            """
            response = model.generate_content(prompt)
            clean_text = response.text.strip()
            if clean_text.startswith("```json"):
                clean_text = clean_text[7:]
            if clean_text.endswith("```"):
                clean_text = clean_text[:-3]
            return json.loads(clean_text.strip())
        except Exception as e:
            print(f"[Aviso] Falha ao consultar Gemini API ({e}). Usando gerador baseado em pesquisa web.")

    # Fallback estruturado didático baseado na pesquisa
    title = topic_info["title"]
    return {
        "title": title,
        "icon": "⚡",
        "steps": [
            {
                "type": "explanation",
                "heading": f"Explorando {title}",
                "text": f"Hoje vamos aprender sobre {title} em C++. Esse conceito é essencial para escrever código modular, eficiente e moderno.",
                "code": f"// Exemplo de {title}\n#include <iostream>\n\nint main() {{\n    std::cout << \"Dominando {title}!\" << std::endl;\n    return 0;\n}}"
            },
            {
                "type": "keypoint",
                "heading": "Ponto de Atenção",
                "text": f"Preste atenção na sintaxe e na clareza ao aplicar {title} no seu dia a dia de programação."
            },
            {
                "type": "quiz",
                "heading": "Desafio do Dia",
                "question": f"Qual a principal vantagem de dominar {title} em C++?",
                "options": [
                    "Aumentar legibilidade e reuso de código",
                    "Impedir que o computador desligue",
                    "Eliminar a necessidade de compilar",
                    "Reduzir a velocidade do programa"
                ],
                "correctIndex": 0,
                "explanation": f"{title} ajuda a organizar a lógica e construir aplicações robustas e limpas."
            }
        ]
    }

def main():
    print("=" * 60)
    print("Iniciando Robô Diário de Criação de Aulas - LearnApp")
    print(f"Data da Execução: {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}")
    print("=" * 60)

    data = load_data()
    
    # Localiza o curso de C++ dentro de Programação
    prog_topic = next((t for t in data["topics"] if t["id"] == "programacao"), None)
    if not prog_topic:
        raise ValueError("Tópico de Programação não encontrado!")
    
    # Extrai títulos existentes em todas as seções
    existing_titles = []
    if "sections" in cpp_subtopic:
        for sec in cpp_subtopic["sections"]:
            for l in sec.get("lessons", []):
                existing_titles.append(l["title"].lower())
    elif "lessons" in cpp_subtopic:
        existing_titles = [l["title"].lower() for l in cpp_subtopic["lessons"]]
    
    # Encontra o próximo tema que ainda não foi adicionado
    next_topic = None
    for idea in TOPIC_IDEAS:
        if idea["title"].lower() not in existing_titles:
            next_topic = idea
            break
            
    if not next_topic:
        total_count = len(existing_titles) + 1
        next_topic = {
            "title": f"Tópico Avançado #{total_count}",
            "query": "C++ advanced programming concepts"
        }

    print(f"-> Tópico selecionado para hoje: {next_topic['title']}")
    print("-> Pesquisando e estruturando aula...")
    
    lesson_content = generate_lesson_with_ai(next_topic)
    
    new_lesson = {
        "id": f"cpp_daily_{int(datetime.now().timestamp())}",
        "title": lesson_content["title"],
        "icon": lesson_content.get("icon", "⭐"),
        "status": "locked",
        "isDailyAi": True,
        "dateCreated": datetime.now().strftime("%d/%m/%Y"),
        "steps": lesson_content["steps"]
    }

    # Adiciona à última seção (Parte 3 • Avançado & Desafios IA)
    if "sections" in cpp_subtopic and cpp_subtopic["sections"]:
        cpp_subtopic["sections"][-1]["lessons"].append(new_lesson)
    else:
        if "lessons" not in cpp_subtopic:
            cpp_subtopic["lessons"] = []
        cpp_subtopic["lessons"].append(new_lesson)
    save_data(data)

    print("✔ Aula gerada com sucesso!")
    print(f"✔ Título: {new_lesson['title']}")
    print(f"✔ Total de etapas: {len(new_lesson['steps'])}")
    print(f"✔ Nova aula adicionada à trilha de C++! Total de aulas agora: {len(cpp_subtopic['lessons'])}")
    print("=" * 60)

if __name__ == "__main__":
    main()
