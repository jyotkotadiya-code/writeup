const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./db');
const Novel = require('./models/Novel');
const Chapter = require('./models/Chapter');

dotenv.config();

// Words and patterns to refine across descriptions and chapters
const humanizeText = (text) => {
  if (!text) return text;

  let res = text;

  const patterns = [
    // Melodramatic cliches -> grounded reality
    [/\bIn a world where\b/gi, 'In an era when'],
    [/\bdeep in the heart of\b/gi, 'tucked away in'],
    [/\bmust navigate a dangerous web of\b/gi, 'has to sort through months of'],
    [/\bunravel a dark conspiracy\b/gi, 'figure out who altered the records'],
    [/\bunravel a web of lies\b/gi, 'uncover what the family kept hidden'],
    [/\bplunges headfirst into a\b/gi, 'finds herself caught in an uneasy'],
    [/\bforces beyond their control\b/gi, 'decisions they made before they knew better'],
    [/\ba sinister plot\b/gi, 'a quiet takeover'],
    [/\bthe fate of the kingdom hangs in the balance\b/gi, 'the peace between the provinces is fraying by the day'],
    [/\bignites a fiery romance\b/gi, 'sparks an unexpected, quiet comfort between them'],
    [/\bsparking an undeniable chemistry\b/gi, 'giving way to a surprising mutual understanding'],
    [/\bthe ultimate sacrifice\b/gi, 'the hardest choice of his life'],
    [/\bsecrets threaten to tear apart\b/gi, 'old truths risk unsettling'],
    [/\blabyrinth of deceit\b/gi, 'tangle of conflicting stories'],
    [/\bcould change everything\b/gi, 'might just change how they see each other'],
    [/\bhurls them into\b/gi, 'brings them face-to-face with'],
    [/\bperilous journey\b/gi, 'arduous trek'],
    [/\bdeadly countdown\b/gi, 'narrow window of time'],
    [/\bshattering the quiet\b/gi, 'breaking the silence'],
    [/\brunning out of time\b/gi, 'with only days left to decide'],
    [/\ban impossible choice\b/gi, 'a choice neither of them wants to make'],
  ];

  for (const [regex, replacement] of patterns) {
    res = res.replace(regex, replacement);
  }

  return res;
};

const run = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB Atlas. Updating existing novels and chapters with humanized prose...');

    const novels = await Novel.find({});
    console.log(`Found ${novels.length} novels to humanize in database.`);

    let updatedNovels = 0;
    for (const novel of novels) {
      const origDesc = novel.description;
      const newDesc = humanizeText(origDesc);
      if (origDesc !== newDesc) {
        novel.description = newDesc;
        await novel.save();
        updatedNovels++;
      }
    }

    const chapters = await Chapter.find({});
    console.log(`Found ${chapters.length} chapters to humanize in database.`);

    let updatedChapters = 0;
    for (const chapter of chapters) {
      const origContent = chapter.content;
      const newContent = humanizeText(origContent);
      if (origContent !== newContent) {
        chapter.content = newContent;
        await chapter.save();
        updatedChapters++;
      }
    }

    console.log(`🎉 Humanization complete:`);
    console.log(`  - Updated ${updatedNovels} novel descriptions in Atlas`);
    console.log(`  - Updated ${updatedChapters} chapter texts in Atlas`);
    process.exit(0);
  } catch (err) {
    console.error('Error humanizing data:', err);
    process.exit(1);
  }
};

run();
