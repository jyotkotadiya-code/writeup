const fs = require('fs');
const path = require('path');

const storiesPoolPath = path.join(__dirname, 'storiesPool.js');
let content = fs.readFileSync(storiesPoolPath, 'utf8');

// Replacements for common robotic AI clichés with natural human phrasing
const replacements = [
  {
    from: /challenging everything they thought they understood about duty, longing, and forgiveness\./g,
    to: "forcing both of them to reckon with the quiet compromises they made to survive their twenties.",
  },
  {
    from: /they must decide whether the voice on paper is worth risking everything in real life\./g,
    to: "they realize that admitting who they are on paper might mean losing the one place they felt understood.",
  },
  {
    from: /between caramelized figs and midnight macarons, they discover that sweet confections can mend the bitterest of old family wounds\./g,
    to: "working shoulder to shoulder through long night bakes, they find a rhythm that feels less like rivalry and more like coming home.",
  },
  {
    from: /The journey leads straight into the fiery heart of the Hollow Vale\./g,
    to: "The deeper they climb into the crags, the clearer it becomes that the old stories left out the people who had to pay for them.",
  },
  {
    from: /Every stitch woven into the loom changes the destiny of the lagoon republic\./g,
    to: "In a city built on water and silence, having something worth saying is the most dangerous crime of all.",
  },
  {
    from: /Armed with only a hammer, ancient glyphs, and a loyal snow-lynx, she braves blizzards and sorcery\./g,
    to: "She knows the ice doesn't forgive hesitation, and her father's hands aren't steady enough to hold the chisel anymore.",
  },
  {
    from: /Together, they must navigate the demanding expectations of the Paris Philharmonic and the free-spirited rhythm of the Seine\./g,
    to: "For the first time in years, playing music stops feeling like an audition and starts feeling like breathing again.",
  },
  {
    from: /Can two people who hurt each other in their youth learn to love the mature strangers they have become\?/g,
    to: "They spent ten years pretending the past didn't sting, only to discover how quickly familiar laughter can disarm an old defense.",
  },
  {
    from: /unravel a dark conspiracy/gi,
    to: "piece together why the family ledgers were altered",
  },
  {
    from: /must navigate a treacherous web of/gi,
    to: "finds herself untangling months of",
  },
  {
    from: /plunges into a perilous/gi,
    to: "is drawn into an uneasy",
  },
  {
    from: /delve into the shadows of/gi,
    to: "walk the back streets of",
  },
  {
    from: /a sinister plot threatens to/gi,
    to: "quiet moves behind closed doors threaten to",
  },
  {
    from: /sparking an undeniable chemistry/gi,
    to: "giving way to an unexpected, quiet comfort between them",
  },
  {
    from: /thrust into a dangerous world/gi,
    to: "pulled into circumstances neither of them asked for",
  },
  {
    from: /unbeknownst to them/gi,
    to: "without either of them noticing at first",
  },
  {
    from: /in an ancient realm where/gi,
    to: "along the northern border provinces, where",
  },
];

let replacedCount = 0;
for (const { from, to } of replacements) {
  const matches = content.match(from);
  if (matches) {
    replacedCount += matches.length;
    content = content.replace(from, to);
  }
}

fs.writeFileSync(storiesPoolPath, content, 'utf8');
console.log(`✅ Applied ${replacedCount} stylistic humanizations to storiesPool.js`);
