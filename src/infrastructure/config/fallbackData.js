/**
 * @typedef {import('../../domain/entities/play.js').PlayData} PlayData
 */

/**
 * Fallback play data used when play.json cannot be loaded.
 * @type {PlayData}
 */
export const FALLBACK_PLAY = {
  playId: "besos-bella-durmiente",
  title: "Besos para la Bella Durmiente",
  author: "J. Luis Alonso de Santos",
  description: "Una adaptaci\u00f3n breve para ensayar parlamentos clave con soporte visual y auditivo.",
  characters: [
    { id: "aurora", name: "Aurora" },
    { id: "tomas", name: "Tom\u00e1s" },
    { id: "narrator", name: "Narrador" },
    { id: "abuela", name: "Abuela" },
    { id: "guardian", name: "Guardi\u00e1n" },
    { id: "cocinero", name: "Cocinero" },
    { id: "paje", name: "Paje" },
    { id: "reina", name: "Reina" },
    { id: "rey", name: "Rey" },
    { id: "bufon", name: "Buf\u00f3n" },
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
      text: "No soy pr\u00edncipe, pero traigo el valor que faltaba."
    },
    {
      characterIds: ["abuela"],
      text: "Los cuentos crecen con nosotros, ni\u00f1o. Respira hondo."
    },
    {
      characterIds: ["guardian"],
      text: "Nadie pasa sin dejar atr\u00e1s la duda."
    },
    {
      characterIds: ["hada"],
      text: "Le regal\u00e9 un sue\u00f1o, ahora necesitan devolverle la risa."
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
      text: "Yo sostendr\u00e9 la puerta para que nadie aparte la mirada."
    },
    {
      characterIds: ["bufon", "multitud"],
      text: "Si la magia falla, que al menos queden carcajadas."
    },
    {
      characterIds: ["aurora"],
      text: "\u00bfQui\u00e9n me llama desde tan lejos? Siento calor en los labios."
    },
    {
      characterIds: ["tomas"],
      text: "Besos para la Bella Durmiente, y para el miedo, silencio."
    }
  ]
};
