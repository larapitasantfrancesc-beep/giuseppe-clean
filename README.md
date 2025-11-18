# 🍕 Giuseppe - Pizzeria La Ràpita Chatbot

Chatbot intel·ligent per a Pizzeria La Ràpita amb Claude (Anthropic).

## 🚀 Instal·lació a GitHub i Netlify

### Pas 1: Crea un nou repositori a GitHub

1. Ves a [github.com/new](https://github.com/new)
2. Nom del repositori: `giuseppe` (o el que vulguis)
3. **Deixa-lo PRIVAT** si vols
4. **NO** afegeixis README, .gitignore ni llicència
5. Fes clic a **Create repository**

### Pas 2: Puja els arxius

**Opció A: Des de la terminal (si tens Git instal·lat)**

```bash
cd /path/to/giuseppe-clean
git init
git add .
git commit -m "Initial commit - Giuseppe chatbot"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/giuseppe.git
git push -u origin main
```

**Opció B: Des de GitHub (més fàcil)**

1. A la pàgina del nou repositori, fes clic a **uploading an existing file**
2. Arrossega TOTS els arxius i carpetes de `giuseppe-clean`
3. Escriu "Initial commit" al missatge
4. Fes clic a **Commit changes**

### Pas 3: Connecta a Netlify

1. Ves a [app.netlify.com](https://app.netlify.com)
2. Fes clic a **Add new site** → **Import an existing project**
3. Selecciona **GitHub**
4. Busca el repositori `giuseppe`
5. Configuració:
   - **Branch to deploy:** `main`
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
6. Fes clic a **Deploy site**

### Pas 4: Configura la variable d'entorn

1. A Netlify, ves al teu site → **Site settings** → **Environment variables**
2. Fes clic a **Add a variable**
3. **Key:** `ANTHROPIC_API_KEY`
4. **Value:** La teva API key d'Anthropic (`sk-ant-...`)
5. **Scopes:** All scopes
6. Fes clic a **Save**

### Pas 5: Redesplega

1. Ves a **Deploys**
2. Fes clic a **Trigger deploy** → **Deploy site**
3. Espera 1-2 minuts

### Pas 6: Prova Giuseppe! 🎉

Ves a la URL del teu site (algo com `https://nome-del-site.netlify.app`) i prova el chatbot!

## ✅ Què inclou aquest projecte

- ✅ Frontend React + TypeScript + Tailwind CSS
- ✅ Netlify Function amb Claude API (Anthropic)
- ✅ Interfície responsive i moderna
- ✅ Historial de conversa
- ✅ Personalitat de Giuseppe configurada
- ✅ Sistema de prompts en català

## 🔧 Desenvolupament local

```bash
npm install
npm run dev
```

Obre http://localhost:5173

**Nota:** Les funcions de Netlify no funcionaran en local sense configuració addicional. Per provar-ho complet, desplega a Netlify.

## 🎨 Personalitzar Giuseppe

Per canviar la personalitat o informació:
- Edita `netlify/functions/chat.ts` (la secció `system:`)

Per canviar l'estil visual:
- Edita els components a `src/components/`

## 📝 Notes importants

- La API key d'Anthropic està protegida al servidor (Netlify Functions)
- Mai pujar l'API key al repositori
- El projecte usa Tailwind CSS des de CDN (fàcil, però en producció es pot optimitzar)

---

**Fet amb ❤️ per a Pizzeria La Ràpita**
