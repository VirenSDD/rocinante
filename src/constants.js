/** @type {Record<string, string>} */
export const LANGUAGE_LABELS = {
  es: "Español",
  en: "Inglés",
  fr: "Francés",
  pt: "Portugués",
  it: "Italiano",
  de: "Alemán"
};

export const FALLBACK_PLAY = {
  playId: "besos-bella-durmiente",
  title: "Besos para la Bella Durmiente",
  author: "J. Luis Alonso de Santos",
  description: "Una adaptación breve para ensayar parlamentos clave con soporte visual y auditivo.",
  characters: [
    { id: "aurora", name: "Aurora" },
    { id: "tomas", name: "Tomás" },
    { id: "narrator", name: "Narrador" },
    { id: "abuela", name: "Abuela" },
    { id: "guardian", name: "Guardián" },
    { id: "cocinero", name: "Cocinero" },
    { id: "paje", name: "Paje" },
    { id: "reina", name: "Reina" },
    { id: "rey", name: "Rey" },
    { id: "bufon", name: "Bufón" },
    { id: "hada", name: "Hada" },
    { id: "mensajero", name: "Mensajero" },
    { id: "multitud", name: "Multitud" }
  ],
  lines: [
    {
      characterIds: ["narrator"],
      text: "La corte contiene el aliento. Se acerca la noche donde todo puede despertar."
    },
    {
      characterIds: ["aurora"],
      text: "Aun con los ojos cerrados siento las manos que me buscan."
    },
    {
      characterIds: ["reina", "rey"],
      text: "Si despierta, que sea entre besos y sin miedo."
    },
    {
      characterIds: ["tomas"],
      text: "No soy príncipe, pero traigo el valor que faltaba."
    },
    {
      characterIds: ["abuela"],
      text: "Los cuentos crecen con nosotros, niño. Respira hondo."
    },
    {
      characterIds: ["guardian"],
      text: "Nadie pasa sin dejar atrás la duda."
    },
    {
      characterIds: ["hada"],
      text: "Le regalé un sueño, ahora necesitan devolverle la risa."
    },
    {
      characterIds: ["cocinero"],
      text: "La cocina no duerme cuando hierven las esperanzas."
    },
    {
      characterIds: ["mensajero"],
      text: "Traigo palabras urgentes: el tiempo corre como un potro loco."
    },
    {
      characterIds: ["paje"],
      text: "Yo sostendré la puerta para que nadie aparte la mirada."
    },
    {
      characterIds: ["bufon", "multitud"],
      text: "Si la magia falla, que al menos queden carcajadas."
    },
    {
      characterIds: ["aurora"],
      text: "¿Quién me llama desde tan lejos? Siento calor en los labios."
    },
    {
      characterIds: ["tomas"],
      text: "Besos para la Bella Durmiente, y para el miedo, silencio."
    }
  ]
};
