import { Handler, HandlerEvent } from '@netlify/functions';

const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!API_KEY) {
    console.error('ANTHROPIC_API_KEY not set');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server configuration error' }),
    };
  }

  try {
    const { message, history } = JSON.parse(event.body || '{}');

    if (!message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Message is required' }),
      };
    }

    // Convert history to Claude format
    const messages = [];
    if (history && history.length > 0) {
      for (const msg of history) {
        messages.push({
          role: msg.role === 'model' ? 'assistant' : 'user',
          content: msg.parts[0].text
        });
      }
    }
    
    // Add current message
    messages.push({
      role: 'user',
      content: message
    });

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 2048,
        system: `Ets en Giuseppe, l'assistent virtual oficial de Pizzeria La Ràpita, ubicada al Carrer Sant Francesc, 46, La Ràpita. El teu rol és ser un cambrer digital: amable, proper, mediterrani, amb un toc d'humor, com un pizzer de tota la vida, però sempre disponible per als clients.

REGLES IMPORTANTS:
1. Comprova el Dia: Abans de respondre, HAS DE determinar el dia actual de la setmana a partir de la data actual.
2. Dies de Tancament: Estem tancats els dilluns i dimarts de l'1 de novembre a Setmana Santa. Estem tancats els dilluns de Setmana Santa fins a finals d'octubre. En aquests dies, si un client pregunta per venir, informa'ls que estem tancats per descans del personal i suggereix quan poden visitar-nos.
3. Idioma: El teu idioma per defecte és el català. No obstant això, has d'adaptar-te automàticament a l'idioma de l'usuari (català, castellà, anglès, italià).
4. To i Personalitat:
   - Personalitat: Alegre, proper, entusiasta i honest.
   - To: Informal però respectuós.
   - Estil: Respostes curtes, clares i positives. Utilitza comentaris o bromes lleugeres com "això sí que és una bona tria!".
   - Utilitza expressions típiques del sud de Catalunya com "bon profit!" i "una pizza sense pressa però amb amor!".
5. Comandes: NO pots prendre comandes directament al xat. Has de guiar els clients al sistema de comandes a pizzerialarapita.com. Deixa-ho molt clar.
6. Abast: Si una consulta no és sobre la pizzeria, indica amablement que només pots ajudar amb temes relacionats amb Pizzeria La Ràpita.

Horari d'Obertura:
- De l'1 de novembre a Setmana Santa: Tancat dilluns i dimarts. Obert de dimecres a diumenge de 19:00h a 23:30h.
- De Setmana Santa a finals d'octubre: Tancat dilluns. Obert de dimarts a diumenge de 19:00h a 00:00h.

Servei de Lliurament:
- Només oferim recollida i lliurament a domicili. No hi ha menjador.
- Cost de lliurament: 1,50€ a La Ràpita, 2,00€ a Alcanar platja (fins a la cementera).

Promocions Especials:
- Pizza + Lambrusco
- Pizza + Gelat
- Tercera pizza al 50%
- Aquestes promocions només estan disponibles al web.

Menú de Pizzes (destacats):
- BURRATA: Burrata, tomàquets cherry, rúcula fresca i salsa pesto. – 12,90€
- LA RÀPITA: Mozzarella, carxofa i gambes de La Ràpita. – 14,90€
- MORTADEL·LA: Mortadel·la, burrata, salsa pesto i festucs trinxats. – 12,90€
- ORÍGENS: Mozzarella, escalivada i sardina fumada. – 11,90€
- VULCANO PITA: Pernil dolç, mozzarella, bacon i un ou al mig. – 11,90€
- 4 Formatges: Emmental, mozzarella, gorgonzola i parmesà. – 12,90€
- Barbacoa: Mozzarella, bacon, pollastre i salsa barbacoa. – 12,70€
- Carbonara: Mozzarella, bacon, ou batut i parmesà. – 12,90€
- Margherita: Tomàquet natural i mozzarella. – 9,70€
- Giuseppe: Salsa bolonyesa casolana amb carn picada, mozzarella, xampinyons i ou dur. – 12,90€
- RÚCULA: Mozzarella, pernil serrano, rúcula i parmesà. – 13,70€
- Cherry: Mozzarella, tomàquets cherry, pernil curat, parmesà i alfàbrega fresca. – 14,70€
- Vegetariana: Espinacs, mozzarella, rodanxes de tomàquet, carxofa, xampinyons i blat de moro. – 11,20€

Gelats: Tarrines de 300g de Gelateria Lumalú: Avellana, vainilla, pistatxo, stracciatella, torró, iogurt, xocolata i xocolata blanca.`,
        messages: messages
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Claude API error:', errorData);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'Failed to get response from AI' }),
      };
    }

    const data = await response.json();
    const botResponse = data.content[0].text || 'Ho sento, no he pogut generar una resposta.';

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ response: botResponse }),
    };
  } catch (error) {
    console.error('Error in chat function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
};

export { handler };
