import os
import re
import json
import random
import time
from datetime import datetime, timezone
import requests

# 1. Paths & Configuration
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TOPICS_FILE = os.path.join(BASE_DIR, "topics.txt")
USED_TOPICS_FILE = os.path.join(BASE_DIR, "used_topics.txt")
USED_IMAGES_FILE = os.path.join(BASE_DIR, "used_images.json")
APP_JS_FILE = os.path.join(BASE_DIR, "app.js")
BLOG_HTML_FILE = os.path.join(BASE_DIR, "blog.html")
SITEMAP_FILE = os.path.join(BASE_DIR, "sitemap.xml")

GH_TOKEN = os.environ.get("GH_TOKEN") or os.environ.get("GITHUB_TOKEN", "")

# 2. Rich Categorized Image Library (Diverse, High-Quality Chegaga Images)
IMAGE_CATEGORIES = {
    "camel": [
        "images/trek-caravan-dunes.jpg",
        "images/hero-caravan-sunset.jpg",
        "images/activity-camel.jpg",
        "images/hero-caravan.jpg",
        "images/hero-caravan-dunes.jpg",
        "garoly/activity-camel.jpg",
        "garoly/photo_caravan_dunes.jpg"
    ],
    "camp": [
        "images/camp-luxury.jpg",
        "images/camp-panoramic.jpg",
        "images/camp-tents.jpg",
        "images/camp-breakfast.jpg",
        "images/hero-camp-feast.jpg",
        "images/slider-milkyway-camp.jpg",
        "images/trek-tent-night.jpg",
        "images/WhatsApp Image 2026-08-12 at 21.23.04.jpeg"
    ],
    "quad": [
        "images/activity-quad-rider.jpg",
        "images/activity-quad.jpg",
        "garoly/activity-quad.jpg"
    ],
    "safari": [
        "images/activity-4x4.jpg",
        "images/tour-lake-iriqui.jpg",
        "images/tour-foum-zguid.jpg",
        "images/tour-jbel-bani.jpg"
    ],
    "stars": [
        "images/stargazing-night.jpg",
        "images/hero-milkyway.jpg",
        "images/hero-stars.jpg",
        "images/slider-milkyway-night.jpg",
        "images/camp-night.jpg"
    ],
    "sandboard": [
        "images/sandboarding-dunes.jpg",
        "images/activity-sandboard.jpg",
        "garoly/activity-sandboard.jpg"
    ],
    "culture": [
        "images/blog-tea.jpg",
        "garoly/photo_5902144165997383483_y.jpg",
        "garoly/photo_5902144165997383494_y.jpg",
        "garoly/photo_5902144165997383487_x.jpg",
        "images/activity-campfire.jpg",
        "images/trek-campfire-night.jpg",
        "garoly/activity-campfire.jpg"
    ],
    "marrakech": [
        "images/tour-ait-ben-haddou.jpg",
        "images/tour-ait-ben-haddou-clean.jpg",
        "images/tour-ouarzazate.jpg",
        "images/kasbah-om-hanch.jpg"
    ],
    "general": [
        "images/hero-dunes.jpg",
        "images/gallery-dunes.jpg",
        "images/about-chegaga.jpg",
        "images/blog-sunrise.jpg",
        "images/slider-desert-jump.jpg",
        "garoly/photo_5902144165997383478_y.jpg"
    ]
}

def load_used_images():
    if os.path.exists(USED_IMAGES_FILE):
        try:
            with open(USED_IMAGES_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return []
    return []

def save_used_images(used):
    with open(USED_IMAGES_FILE, "w", encoding="utf-8") as f:
        json.dump(used, f, indent=2, ensure_ascii=False)

def select_best_image(topic):
    """Selects the most thematic image while preventing repetition."""
    topic_lower = topic.lower()
    cat = "general"
    
    if any(k in topic_lower for k in ["dromadaire", "méharée", "meharee", "chameau", "caravane"]):
        cat = "camel"
    elif any(k in topic_lower for k in ["bivouac", "camp", "tente", "lune de miel", "dormir", "nuit"]):
        cat = "camp"
    elif any(k in topic_lower for k in ["quad", "buggy", "sensations"]):
        cat = "quad"
    elif any(k in topic_lower for k in ["4x4", "safari", "paris-dakar", "iriki", "piste", "foum zguid"]):
        cat = "safari"
    elif any(k in topic_lower for k in ["étoile", "etoile", "voie lactée", "ciel", "astronomie", "bortle"]):
        cat = "stars"
    elif any(k in topic_lower for k in ["sandboard", "surf", "glisse"]):
        cat = "sandboard"
    elif any(k in topic_lower for k in ["thé", "pain", "taguella", "nomade", "feu", "musique", "hospitalité", "chèche"]):
        cat = "culture"
    elif any(k in topic_lower for k in ["marrakech", "ouarzazate", "kasbah", "ait ben haddou", "tichka"]):
        cat = "marrakech"
        
    candidates = IMAGE_CATEGORIES.get(cat, IMAGE_CATEGORIES["general"])
    used_images = load_used_images()
    
    # Pick candidate used least recently or not at all
    available = [img for img in candidates if img not in used_images[-10:]]
    if not available:
        available = candidates
        
    chosen = random.choice(available)
    used_images.append(chosen)
    # Keep last 30 used images in history
    save_used_images(used_images[-30:])
    return chosen

def slugify(text):
    text = text.lower()
    text = text.replace("œ", "oe").replace("æ", "ae")
    text = re.sub(r"[àáâãäå]", "a", text)
    text = re.sub(r"[èéêë]", "e", text)
    text = re.sub(r"[ìíîï]", "i", text)
    text = re.sub(r"[òóôõö]", "o", text)
    text = re.sub(r"[ùúûü]", "u", text)
    text = re.sub(r"[ç]", "c", text)
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-")[:60]

# 3. Read Next Topic
if not os.path.exists(TOPICS_FILE):
    print("Error: topics.txt not found.")
    exit(1)

with open(TOPICS_FILE, "r", encoding="utf-8") as f:
    raw_topics = [line.strip() for line in f if line.strip() and not line.strip().startswith("#")]

if not raw_topics:
    print("No remaining topics in topics.txt! All topics have been published.")
    exit(0)

selected_topic = raw_topics[0]
print(f"\n==========================================")
print(f"Next SEO Topic: {selected_topic}")
print(f"Language: Français (Erg Chegaga Sahara Tours)")
print(f"==========================================\n")

# 4. Prompt Engineering for Deep-Dive French SEO
system_prompt = (
    "Tu es le guide nomade expert et rédacteur SEO principal pour 'Erg Chegaga Desert Tours' (https://ergchegaga.com), "
    "la référence locale du tourisme authentique dans le grand erg du Sud marocain (M'hamid El Ghizlane, Zagora, Foum Zguid, Lac Iriki).\n\n"
    "Consignes de rédaction indispensables :\n"
    "1. Rédige un article de blog complet, captivant et très approfondi de 1 000 à 1 300 mots STRICTEMENT EN FRANÇAIS.\n"
    "2. Le ton doit être immersif, chaleureux, expert et authentique (l'âme nomade, le silence majestueux, le thé au coin du feu, les 300 m de dunes).\n"
    "3. Mets en valeur Erg Chegaga par rapport aux zones commerciales comme Merzouga : Chegaga est resté 100% sauvage, sans pylônes ni béton, accessible uniquement en 4x4.\n"
    "4. NE MENTIONNE AUCUN PRIX FIXE en euros ou dirhams. Précise que les tarifs sont personnalisés et 'Sur Demande' en contactant l'équipe directement sur WhatsApp.\n"
    "5. Structure de l'article :\n"
    "   - Une accroche captivante de 2 phrases contenant le mot-clé principal dans les 100 premiers mots.\n"
    "   - 4 à 5 sous-titres bien formulés avec <h4>1. ...</h4>, <h4>2. ...</h4>, etc.\n"
    "   - Des paragraphes riches avec <p class=\"mb-4\">, des listes à puces <ul class=\"list-disc pl-5 mb-4 space-y-2 text-desert-stone/85\"> et <strong> pour les termes clés.\n"
    "6. Retourne UNIQUEMENT un objet JSON valide sans balises markdown markdown/json, avec cette structure exacte :\n"
    "{\n"
    "  \"title\": \"Titre percutant et accrocheur\",\n"
    "  \"tag\": \"Catégorie (ex: Bivouac de Luxe, Aventure 4x4, Guide Nomade, Astronomie, Histoire du Sahara)\",\n"
    "  \"snippet\": \"Une description de 2 phrases (150-160 caractères) optimisée pour Google Meta Description\",\n"
    "  \"content\": \"Le contenu HTML de l'article formaté avec <p>, <h4>, <ul>, <li>, <strong>\"\n"
    "}"
)

user_prompt = f"Rédige l'article complet et détaillé sur le sujet : '{selected_topic}'."

# 5. Multi-Provider AI Inference Pipeline (100% Free)
article_data = None

# Attempt 1: GitHub Models Inference API (uses standard GITHUB_TOKEN inside GitHub Actions)
if GH_TOKEN:
    print("Attempting generation with GitHub Models (gpt-4o-mini)...")
    for model in ["gpt-4o-mini", "gpt-4o"]:
        try:
            resp = requests.post(
                "https://models.inference.ai.azure.com/chat/completions",
                headers={
                    "Authorization": f"Bearer {GH_TOKEN}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": model,
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    "temperature": 0.7,
                    "response_format": {"type": "json_object"}
                },
                timeout=90
            )
            if resp.status_code == 200:
                raw_json = resp.json()["choices"][0]["message"]["content"].strip()
                article_data = json.loads(raw_json)
                print(f"GitHub Models ({model}) generation successful!")
                break
            else:
                print(f"GitHub Models ({model}) status: {resp.status_code} - {resp.text[:120]}")
        except Exception as e:
            print(f"GitHub Models ({model}) error: {e}")

# Attempt 2: Pollinations AI (100% Free, No token required)
if not article_data:
    print("Attempting generation with Pollinations AI (100% Free, No Token)...")
    try:
        poll_res = requests.post(
            "https://text.pollinations.ai/openai",
            headers={"Content-Type": "application/json"},
            json={
                "model": "openai",
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                "temperature": 0.7,
                "jsonMode": True
            },
            timeout=90
        )
        if poll_res.status_code == 200:
            content_str = poll_res.json()["choices"][0]["message"]["content"].strip()
            # Clean markdown formatting if present
            content_str = re.sub(r"^```json\s*", "", content_str)
            content_str = re.sub(r"^```\s*", "", content_str)
            content_str = re.sub(r"\s*```$", "", content_str).strip()
            article_data = json.loads(content_str)
            print("Pollinations AI generation successful!")
    except Exception as e:
        print(f"Pollinations AI error: {e}")

if not article_data or not article_data.get("content"):
    print("Error: Failed to generate article from all free AI providers.")
    exit(1)

# 6. Assemble Final Article
article_title = article_data.get("title", selected_topic).strip()
article_tag = article_data.get("tag", "Guide du Désert").strip()
article_snippet = article_data.get("snippet", "").strip()
article_content = article_data.get("content", "").strip()
article_slug = slugify(article_title)
article_image = select_best_image(selected_topic)

# Format Date: "Nov 2026"
months_fr = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"]
now = datetime.now(timezone.utc)
article_date = f"{months_fr[now.month - 1]} {now.year}"

# Append Call To Action Block at the end of article content
cta_block = f"""
      <div class="mt-8 p-6 bg-desert-sand/30 rounded-2xl border border-desert-sand/70 space-y-3">
        <h5 class="font-heading font-extrabold text-lg text-desert-stone">Envie de Vivre l'Expérience d'Erg Chegaga ?</h5>
        <p class="text-xs sm:text-sm text-desert-stone/80">Nos guides nomades locaux organisent votre aventure sur-mesure au départ de M'hamid, Zagora, Ouarzazate ou Marrakech. Bivouac de luxe, méharée et traversée 4x4.</p>
        <div class="flex flex-wrap gap-3 pt-2">
          <a href="tours.html" class="px-5 py-2.5 bg-desert-terracotta hover:bg-desert-ochre text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors">
            Voir Nos Circuits 4x4
          </a>
          <a href="camp.html" class="px-5 py-2.5 bg-desert-stone hover:bg-desert-terracotta text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors">
            Découvrir le Bivouac
          </a>
          <a href="https://wa.me/212615396800?text=Bonjour%20!%20J'ai%20lu%20votre%20article%20'{article_title}'%20et%20je%20souhaite%20obtenir%20un%20devis." target="_blank" class="px-5 py-2.5 bg-desert-whatsapp hover:bg-green-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors flex items-center gap-1.5">
            <i class="fab fa-whatsapp"></i> Réserver sur WhatsApp
          </a>
        </div>
      </div>
"""

final_content = article_content + cta_block

# 7. Inject into app.js
if not os.path.exists(APP_JS_FILE):
    print("Error: app.js not found.")
    exit(1)

with open(APP_JS_FILE, "r", encoding="utf-8") as f:
    app_js_text = f.read()

# Build the JS object representation
clean_title_js = article_title.replace('"', '\\"')
clean_tag_js = article_tag.replace('"', '\\"')
clean_snippet_js = article_snippet.replace('"', '\\"')
# Escape backticks in content
escaped_content = final_content.replace('`', '\\`').replace('${', '\\${')

article_js_snippet = f"""  {{
    id: "{article_slug}",
    title: "{clean_title_js}",
    tag: "{clean_tag_js}",
    date: "{article_date}",
    image: "{article_image}",
    snippet: "{clean_snippet_js}",
    content: `
{escaped_content}
    `
  }},
"""

# Insert immediately after `const blogArticles = [\n`
target_marker = "const blogArticles = ["
if target_marker in app_js_text:
    idx = app_js_text.find(target_marker) + len(target_marker)
    # Check if newline follows
    if app_js_text[idx:idx+1] == "\n":
        idx += 1
    new_app_js = app_js_text[:idx] + article_js_snippet + app_js_text[idx:]
    with open(APP_JS_FILE, "w", encoding="utf-8") as f:
        f.write(new_app_js)
    print(f"Successfully added '{article_title}' to app.js (ID: {article_slug})!")
else:
    print("Error: Could not find 'const blogArticles = [' in app.js")
    exit(1)

# 8. Update blog.html Schema & sitemap.xml
if os.path.exists(BLOG_HTML_FILE):
    try:
        today_iso = now.strftime("%Y-%m-%d")
        with open(BLOG_HTML_FILE, "r", encoding="utf-8") as f:
            blog_html_text = f.read()
        
        schema_marker = '"blogPost": ['
        if schema_marker in blog_html_text:
            schema_entry = f"""
          {{
            "@type": "BlogPosting",
            "headline": "{clean_title_js}",
            "description": "{clean_snippet_js}",
            "image": "https://ergchegaga.com/{article_image}",
            "datePublished": "{today_iso}",
            "author": {{
              "@type": "Organization",
              "name": "Erg Chegaga Desert Tours"
            }}
          }},"""
            idx = blog_html_text.find(schema_marker) + len(schema_marker)
            new_blog_html = blog_html_text[:idx] + schema_entry + blog_html_text[idx:]
            with open(BLOG_HTML_FILE, "w", encoding="utf-8") as f:
                f.write(new_blog_html)
            print("Updated blog.html Schema.org blogPost list!")
    except Exception as e:
        print(f"blog.html update note: {e}")

if os.path.exists(SITEMAP_FILE):
    try:
        today_iso = now.strftime("%Y-%m-%d")
        with open(SITEMAP_FILE, "r", encoding="utf-8") as f:
            sitemap_content = f.read()
        
        # Update blog.html lastmod
        sitemap_content = re.sub(
            r"(<loc>https://ergchegaga\.com/blog\.html</loc>\s*<lastmod>)[^<]+(</lastmod>)",
            rf"\g<1>{today_iso}\g<2>",
            sitemap_content
        )
        with open(SITEMAP_FILE, "w", encoding="utf-8") as f:
            f.write(sitemap_content)
        print("Updated sitemap.xml with today's date!")
    except Exception as e:
        print(f"Sitemap update warning: {e}")

# 9. Update Topics Queue
with open(TOPICS_FILE, "w", encoding="utf-8") as f:
    f.write("\n".join(raw_topics[1:]) + "\n")

with open(USED_TOPICS_FILE, "a", encoding="utf-8") as f:
    f.write(selected_topic + "\n")

print(f"\n==========================================")
print(f"Article Published Successfully!")
print(f"Title: {article_title}")
print(f"Slug: {article_slug}")
print(f"Category: {article_tag}")
print(f"Image: {article_image}")
print(f"Remaining Topics: {len(raw_topics) - 1}")
print(f"==========================================\n")
