const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./db');
const User = require('./models/User');
const Novel = require('./models/Novel');
const Chapter = require('./models/Chapter');
const Award = require('./models/Award');
const Vote = require('./models/Vote');
const storiesPool = require('./storiesPool');

dotenv.config();

const GENRES = [
  'Romance',
  'Fantasy',
  'Science Fiction',
  'Mystery',
  'Thriller',
  'Horror',
  'Adventure',
  'Drama',
  'Historical Fiction',
  'Crime',
  'Comedy',
  'Young Adult',
];

// Diverse author accounts to ensure exist
const AUTHORS_SEED = [
  {
    name: 'Jane Sterling',
    username: 'janesterling',
    email: 'jane@example.com',
    password: 'password123',
    role: 'user',
  },
  {
    name: 'Arthur Vance',
    username: 'arthurvance',
    email: 'arthur@example.com',
    password: 'password123',
    role: 'user',
  },
  {
    name: 'Elena Rostova',
    username: 'elena_rostova',
    email: 'elena.rostova@writeup.io',
    password: 'password123',
    role: 'user',
  },
  {
    name: 'Tariq Al-Mansoor',
    username: 'tariq_mansoor',
    email: 'tariq@writeup.io',
    password: 'password123',
    role: 'user',
  },
  {
    name: 'Sophia Chen',
    username: 'sophia_chen',
    email: 'sophia@writeup.io',
    password: 'password123',
    role: 'user',
  },
  {
    name: 'Marcus Sterling',
    username: 'marcus_sterling',
    email: 'marcus@writeup.io',
    password: 'password123',
    role: 'user',
  },
  {
    name: 'Amara Okafor',
    username: 'amara_okafor',
    email: 'amara@writeup.io',
    password: 'password123',
    role: 'user',
  },
  {
    name: 'Liam O\'Connor',
    username: 'liam_oconnor',
    email: 'liam@writeup.io',
    password: 'password123',
    role: 'user',
  },
  {
    name: 'Priya Patel',
    username: 'priya_patel',
    email: 'priya@writeup.io',
    password: 'password123',
    role: 'user',
  },
  {
    name: 'Hiroshi Tanaka',
    username: 'hiroshi_tanaka',
    email: 'hiroshi@writeup.io',
    password: 'password123',
    role: 'user',
  },
  {
    name: 'Isabella Rossi',
    username: 'isabella_rossi',
    email: 'isabella@writeup.io',
    password: 'password123',
    role: 'user',
  },
  {
    name: 'Chloe Dupont',
    username: 'chloe_dupont',
    email: 'chloe@writeup.io',
    password: 'password123',
    role: 'user',
  },
  {
    name: 'David Morales',
    username: 'david_morales',
    email: 'david@writeup.io',
    password: 'password123',
    role: 'user',
  },
  {
    name: 'Zane Thorne',
    username: 'zane_thorne',
    email: 'zane@writeup.io',
    password: 'password123',
    role: 'user',
  },
];

// Helper to generate engaging continuation chapters if a story needs 2 or 3 chapters
function generateContinuationChapter(novelTitle, genre, chapterNumber) {
  const chapterTitlesByGenre = {
    Romance: [
      'Unspoken Longings',
      'The Midnight Conversation',
      'When the Rain Cleared',
      'A Promise in the Shadows',
    ],
    Fantasy: [
      'The Shattered Keystone',
      'Rites of the Moonlit Grove',
      'Echoes of the High Spire',
      'The Dragon\'s Awakening',
    ],
    'Science Fiction': [
      'Signal in the Static',
      'The Quantum Anomaly',
      'Sub-Orbital Drift',
      'The Ghost in the Core',
    ],
    Mystery: [
      'The Second Cipher',
      'Footsteps in the Fog',
      'The Alibi Unravels',
      'A Locked Room Revelation',
    ],
    Thriller: [
      'The Forty-Minute Countdown',
      'Pursuit on the Viaduct',
      'The Compromised Safehouse',
      'Point of No Return',
    ],
    Horror: [
      'The Whispers Behind the Walls',
      'Midnight at the Threshold',
      'What Stirs in the Cellar',
      'The Eyes in the Mire',
    ],
    Adventure: [
      'The Treacherous Traverse',
      'Across the Abyssal Chasm',
      'The Hidden Sanctuary',
      'The Golden Crest',
    ],
    Drama: [
      'The Shattered Accord',
      'Confessions at Twilight',
      'The Price of Ambition',
      'The Long Road Home',
    ],
    'Historical Fiction': [
      'The Courier\'s Dilemma',
      'Under the Shadow of the Citadel',
      'Letters from the Frontier',
      'The Masquerade Cloak',
    ],
    Crime: [
      'The Midnight Drop',
      'The Interrogation Room',
      'Smoke and Revolver Rounds',
      'The Alibi Collapses',
    ],
    Comedy: [
      'A Catastrophic Misunderstanding',
      'The Great Boardroom Debacle',
      'When the Smoke Cleared',
      'All\'s Well That Ends in Chaos',
    ],
    'Young Adult': [
      'Rooftops and Secrets',
      'The Night Everything Changed',
      'Stolen Moments',
      'Beyond the Neon Glow',
    ],
  };

  const titles = chapterTitlesByGenre[genre] || ['The Journey Deepens', 'Unfolding Fates'];
  const title = titles[(chapterNumber - 2) % titles.length];

  const content = `The tension surrounding "${novelTitle}" reached an inevitable turning point as the hours slipped away into dusk. Every choice made up to this moment seemed to narrow the path ahead, leaving little room for doubt or retreat.\n\nFrom across the room, the faint flickering lamplight cast long, trembling shadows across the floorboards. A quiet breath broke the stillness, signaling that the truth could no longer be postponed. The documents lay open upon the table, their implications clear to anyone courageous enough to read between the lines.\n\n"We knew from the beginning that this wouldn't be easy," came the quiet reminder, words spoken with steady resolve against the rising tide of uncertainty. With determination rekindled, the next step was taken, setting into motion events that would alter everything that followed.`;

  return {
    chapterNumber,
    title,
    content,
  };
}

async function ensureUsers() {
  console.log('👤 Ensuring diverse authors and demo accounts exist...');

  // Ensure Admin
  let admin = await User.findOne({ email: 'admin@writeup.com' });
  if (!admin) {
    admin = await User.create({
      name: 'WriteUp Admin',
      username: 'admin',
      email: 'admin@writeup.com',
      password: 'admin123',
      role: 'admin',
    });
  }

  // Ensure Reader Maya
  let reader = await User.findOne({ email: 'maya@example.com' });
  if (!reader) {
    reader = await User.create({
      name: 'Maya Lin',
      username: 'mayalin',
      email: 'maya@example.com',
      password: 'password123',
      role: 'user',
    });
  }

  // Ensure Authors
  const authors = [];
  for (const authorData of AUTHORS_SEED) {
    let author = await User.findOne({ email: authorData.email });
    if (!author) {
      author = await User.create(authorData);
    }
    authors.push(author);
  }

  console.log(`✅ Loaded ${authors.length} authors and verified admin & reader accounts.`);
  return { admin, reader, authors };
}

async function importStories() {
  console.log('==================================================');
  console.log('🚀 Starting WriteUp MongoDB Atlas Story Importer');
  console.log('==================================================');

  await connectDB();

  const { admin, reader, authors } = await ensureUsers();

  console.log('\n🧹 Clearing existing Novel, Chapter, and Vote collections...');
  await Chapter.deleteMany({});
  await Novel.deleteMany({});
  await Vote.deleteMany({});
  console.log('✅ Collections reset for clean, balanced genre population.');

  const genreSummary = {};
  const allCreatedNovels = [];
  const novelsByGenre = {};

  // Global pending targets: exactly 2 or 3 across all genres for admin review demo
  const pendingQueue = ['Fantasy', 'Thriller', 'Crime'];
  let pendingAssignedCount = 0;

  for (const genre of GENRES) {
    // Requirement: Random number of stories between 6 and 10 (inclusive)
    const targetCount = Math.floor(Math.random() * (10 - 6 + 1)) + 6; // 6, 7, 8, 9, or 10
    const pool = storiesPool[genre] || [];

    // Shuffle pool stories
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const selectedStories = shuffled.slice(0, targetCount);

    novelsByGenre[genre] = [];
    genreSummary[genre] = {
      total: targetCount,
      approved: 0,
      pending: 0,
      chaptersCount: 0,
    };

    console.log(`\n📚 Importing genre: ${genre} (Target count: ${targetCount} stories)...`);

    for (let i = 0; i < selectedStories.length; i++) {
      const story = selectedStories[i];
      const author = authors[Math.floor(Math.random() * authors.length)];

      // Determine approvalStatus
      let approvalStatus = 'approved';
      if (pendingQueue.includes(genre) && pendingAssignedCount < 3 && i === 0) {
        approvalStatus = 'pending';
        pendingAssignedCount++;
        genreSummary[genre].pending++;
      } else {
        genreSummary[genre].approved++;
      }

      // Natural reader engagement
      const likes = approvalStatus === 'approved' ? Math.floor(Math.random() * 95) + 20 : 0;
      const wishlistCount = approvalStatus === 'approved' ? Math.floor(Math.random() * 60) + 12 : 0;
      const status = story.status || (Math.random() > 0.4 ? 'ongoing' : 'completed');

      // Create Novel first
      const novel = await Novel.create({
        title: story.title,
        description: story.description,
        author: author._id,
        genre: genre,
        coverImage: story.coverImage,
        status: status,
        approvalStatus: approvalStatus,
        likes: likes,
        wishlistCount: wishlistCount,
        chapters: [],
      });

      // Prepare chapters (1 to 3 chapters per novel)
      const numChapters = story.chapters && story.chapters.length >= 2
        ? story.chapters.length
        : Math.floor(Math.random() * 3) + 1; // 1, 2, or 3

      const chapterIds = [];
      const baseChapters = story.chapters || [];

      for (let chNum = 1; chNum <= numChapters; chNum++) {
        let chData;
        if (baseChapters[chNum - 1]) {
          chData = baseChapters[chNum - 1];
        } else {
          chData = generateContinuationChapter(story.title, genre, chNum);
        }

        const chapter = await Chapter.create({
          novel: novel._id,
          chapterNumber: chNum,
          title: chData.title,
          content: chData.content,
        });

        chapterIds.push(chapter._id);
        genreSummary[genre].chaptersCount++;
      }

      novel.chapters = chapterIds;
      await novel.save();

      allCreatedNovels.push(novel);
      novelsByGenre[genre].push(novel);
    }
  }

  // Update Awards and Votes with the new approved novels
  console.log('\n🏆 Updating Awards and Voting contests with newly imported novels...');
  await Award.deleteMany({});

  const romanceNovels = (novelsByGenre['Romance'] || []).filter((n) => n.approvalStatus === 'approved');
  const fantasyNovels = (novelsByGenre['Fantasy'] || []).filter((n) => n.approvalStatus === 'approved');
  const sciFiNovels = (novelsByGenre['Science Fiction'] || []).filter((n) => n.approvalStatus === 'approved');
  const mysteryNovels = (novelsByGenre['Mystery'] || []).filter((n) => n.approvalStatus === 'approved');
  const adventureNovels = (novelsByGenre['Adventure'] || []).filter((n) => n.approvalStatus === 'approved');

  const romanceAward = await Award.create({
    title: 'Annual Romance Writing Awards',
    genre: 'Romance',
    description: 'Celebrating the most heartwarming, captivating, and emotional romantic novels written this year on WriteUp.',
    novels: romanceNovels.slice(0, 3).map((n) => n._id),
    status: 'open',
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
  });

  const fantasyAward = await Award.create({
    title: 'Grand Fantasy Championship',
    genre: 'Fantasy',
    description: 'Honoring exceptional world-building, mythological depth, and unforgettable epic adventures in the realm of high and dark fantasy.',
    novels: fantasyNovels.slice(0, 3).map((n) => n._id),
    status: 'open',
    startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
  });

  const sciFiAward = await Award.create({
    title: 'Nebula Visionaries: Sci-Fi Awards',
    genre: 'Science Fiction',
    description: 'Recognizing visionary storytelling that pushes the boundaries of future technology, interstellar exploration, and artificial minds.',
    novels: sciFiNovels.slice(0, 2).map((n) => n._id),
    status: 'winner_declared',
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    winner: sciFiNovels[0] ? sciFiNovels[0]._id : null,
  });

  await Award.create({
    title: 'Mystery & Noir Guild Awards',
    genre: 'Mystery',
    description: 'The finest whodunits, investigative thrillers, and detective chronicles competing for the golden magnifying glass.',
    novels: mysteryNovels.slice(0, 2).map((n) => n._id),
    status: 'upcoming',
    startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
  });

  await Award.create({
    title: 'High Adventure Expedition Prize',
    genre: 'Adventure',
    description: 'Recognizing breathtaking expeditions, survival sagas, and uncharted discoveries across the globe.',
    novels: adventureNovels.slice(0, 3).map((n) => n._id),
    status: 'open',
    startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
  });

  // Assign reader wishlist and votes
  if (romanceNovels[0] && reader) {
    await Vote.create({ user: reader._id, award: romanceAward._id, novel: romanceNovels[0]._id });
    if (fantasyNovels[0]) {
      await Vote.create({ user: reader._id, award: fantasyAward._id, novel: fantasyNovels[0]._id });
    }
    reader.wishlist = [
      romanceNovels[0]._id,
      fantasyNovels[0]?._id,
      sciFiNovels[0]?._id,
      adventureNovels[0]?._id,
    ].filter(Boolean);
    reader.likedNovels = [
      romanceNovels[0]._id,
      fantasyNovels[0]?._id,
    ].filter(Boolean);
    await reader.save();
  }

  // Final verification from MongoDB Atlas database
  console.log('\n🔍 Verifying counts directly from MongoDB Atlas...');
  const totalUsersInDB = await User.countDocuments();
  const totalNovelsInDB = await Novel.countDocuments();
  const totalChaptersInDB = await Chapter.countDocuments();

  const genreAggregation = await Novel.aggregate([
    {
      $group: {
        _id: '$genre',
        total: { $sum: 1 },
        approved: {
          $sum: {
            $cond: [{ $eq: ['$approvalStatus', 'approved'] }, 1, 0],
          },
        },
        pending: {
          $sum: {
            $cond: [{ $eq: ['$approvalStatus', 'pending'] }, 1, 0],
          },
        },
        ongoing: {
          $sum: {
            $cond: [{ $eq: ['$status', 'ongoing'] }, 1, 0],
          },
        },
        completed: {
          $sum: {
            $cond: [{ $eq: ['$status', 'completed'] }, 1, 0],
          },
        },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  console.log('\n========================================================================');
  console.log('📊 FINAL MONGODB ATLAS STORY BREAKDOWN ACROSS ALL 12 GENRES');
  console.log('========================================================================');
  console.table(
    genreAggregation.map((g) => ({
      Genre: g._id,
      'Total Stories': g.total,
      Approved: g.approved,
      Pending: g.pending,
      Ongoing: g.ongoing,
      Completed: g.completed,
      'Meets (6-10) Requirement': g.total >= 6 && g.total <= 10 ? '✅ YES' : '❌ NO',
    }))
  );

  console.log(`\n📈 Summary Statistics:`);
  console.log(`  - Total Genres Populated: ${genreAggregation.length} / 12`);
  console.log(`  - Total Novels in Atlas:   ${totalNovelsInDB}`);
  console.log(`  - Total Chapters in Atlas: ${totalChaptersInDB}`);
  console.log(`  - Total Users in Atlas:    ${totalUsersInDB}`);
  console.log('========================================================================\n');

  return {
    genreAggregation,
    totalNovelsInDB,
    totalChaptersInDB,
    totalUsersInDB,
  };
}

if (require.main === module) {
  importStories()
    .then(() => {
      console.log('🎉 Story import process completed successfully!');
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ Import error:', err);
      process.exit(1);
    });
}

module.exports = importStories;
