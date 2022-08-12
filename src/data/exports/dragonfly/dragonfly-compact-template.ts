import Handlebars from 'handlebars/runtime';

const dragonflyCompactSource = `


{{test}}



`;

export const dragonflyCompactTemplate = Handlebars.compile(
  dragonflyCompactSource
);
