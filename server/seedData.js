const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Novel = require('./models/Novel');
const Chapter = require('./models/Chapter');
const Award = require('./models/Award');
const Vote = require('./models/Vote');

const seedData = async () => {
  console.log('Seeding initial dataset...');
  await User.deleteMany({});
  await Novel.deleteMany({});
  await Chapter.deleteMany({});
  await Award.deleteMany({});
  await Vote.deleteMany({});

  const admin = await User.create({
    name: 'WriteUp Admin',
    username: 'admin',
    email: 'admin@writeup.com',
    password: 'admin123',
    role: 'admin',
  });

  const writerJane = await User.create({
    name: 'Jane Sterling',
    username: 'janesterling',
    email: 'jane@example.com',
    password: 'password123',
    role: 'user',
  });

  const writerArthur = await User.create({
    name: 'Arthur Vance',
    username: 'arthurvance',
    email: 'arthur@example.com',
    password: 'password123',
    role: 'user',
  });

  const readerMaya = await User.create({
    name: 'Maya Lin',
    username: 'mayalin',
    email: 'maya@example.com',
    password: 'password123',
    role: 'user',
  });

  // 1. Whispers of the Heart (Romance)
  const novel1 = await Novel.create({
    title: 'Whispers of the Heart',
    description: 'In a quiet coastal town in Maine, an antique book conservator discovers a hidden bundle of unsent wartime letters that lead her across continents—and straight into the life of an elusive architect carrying his own quiet sorrows.',
    author: writerJane._id,
    genre: 'Romance',
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80',
    status: 'ongoing',
    approvalStatus: 'approved',
    likes: 42,
    wishlistCount: 28,
  });

  // 2. The Obsidian Crown (Fantasy)
  const novel2 = await Novel.create({
    title: 'The Obsidian Crown',
    description: 'When the ancient ward stones of Solaria shatter, an exiled apprentice cartographer must navigate treacherous mountain realms and court betrayals to bind a forgotten crown before eternal dusk consumes the kingdom.',
    author: writerArthur._id,
    genre: 'Fantasy',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    status: 'ongoing',
    approvalStatus: 'approved',
    likes: 58,
    wishlistCount: 45,
  });

  // 3. Neon Constellations (Science Fiction)
  const novel3 = await Novel.create({
    title: 'Neon Constellations',
    description: 'Set aboard the subterranean ring-city of Kepler-9, a cybernetic archivist recovers a fragment of humanity’s lost terrestrial memories—only to find that powerful orbital syndicates will burn entire sectors to keep it buried.',
    author: writerJane._id,
    genre: 'Science Fiction',
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
    status: 'completed',
    approvalStatus: 'approved',
    likes: 35,
    wishlistCount: 19,
  });

  // 4. The Clockwork Murders (Mystery)
  const novel4 = await Novel.create({
    title: 'The Clockwork Murders',
    description: 'Victorian London, 1888. A series of impossible murders leaves the victims clutching intricate brass clockwork mechanisms. Inspector Thomas Thorne teams up with an eccentric horologist to decipher the deadly countdown.',
    author: writerArthur._id,
    genre: 'Mystery',
    coverImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
    status: 'completed',
    approvalStatus: 'approved',
    likes: 47,
    wishlistCount: 31,
  });

  // 5. Letters in Autumn (Romance)
  const novel5 = await Novel.create({
    title: 'Letters in Autumn',
    description: 'Two rival coffee shop owners in Edinburgh accidentally exchange personal journals left on a shared park bench during crisp October afternoons. Without knowing each other’s true names, their words begin to mend old wounds.',
    author: writerJane._id,
    genre: 'Romance',
    coverImage: 'https://images.unsplash.com/photo-1476820865390-c52aeebb9891?w=800&auto=format&fit=crop&q=80',
    status: 'ongoing',
    approvalStatus: 'approved',
    likes: 29,
    wishlistCount: 18,
  });

  // 6. Echoes of the Void (Science Fiction)
  const novel6 = await Novel.create({
    title: 'Echoes of the Void',
    description: 'A deep space telemetry station picks up an irregular rhythmic pulse from the Kuiper belt. As communications officer Jax Miller filters out stellar interference, he realizes the transmission is calling him by his childhood name.',
    author: writerArthur._id,
    genre: 'Science Fiction',
    coverImage: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&auto=format&fit=crop&q=80',
    status: 'ongoing',
    approvalStatus: 'approved',
    likes: 24,
    wishlistCount: 15,
  });

  // 7. The Haunting of Blackwood Manor (Horror)
  const novel7 = await Novel.create({
    title: 'The Haunting of Blackwood Manor',
    description: 'Inheriting an ancestral estate deep in the Scottish Highlands sounded like a blessing to novelist Clara Bell. But behind the tapestries and ivy-choked corridors lies a secret that only wakes when the grandfather clock strikes three.',
    author: writerJane._id,
    genre: 'Horror',
    coverImage: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=800&auto=format&fit=crop&q=80',
    status: 'ongoing',
    approvalStatus: 'approved',
    likes: 38,
    wishlistCount: 22,
  });

  // 8. Pending Novel 1 (for Admin Review demo)
  const pending1 = await Novel.create({
    title: 'The Velvet Alchemist',
    description: 'In an alternate Renaissance Venice where dyes possess magical properties, a young dyer apprentice discovers the secret formula for creating living illusions in textile patterns.',
    author: writerJane._id,
    genre: 'Fantasy',
    coverImage: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80',
    status: 'ongoing',
    approvalStatus: 'pending',
    likes: 0,
    wishlistCount: 0,
  });

  // 9. Pending Novel 2 (for Admin Review demo)
  const pending2 = await Novel.create({
    title: 'Cipher of the Silent Sea',
    description: 'A marine biologist decoding whale songs accidentally intercepts an encrypted broadcast originating from an underwater research facility that officially sank forty years ago.',
    author: writerArthur._id,
    genre: 'Thriller',
    coverImage: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&auto=format&fit=crop&q=80',
    status: 'ongoing',
    approvalStatus: 'pending',
    likes: 0,
    wishlistCount: 0,
  });

  // Chapters
  const ch1_1 = await Chapter.create({
    novel: novel1._id,
    chapterNumber: 1,
    title: 'Dust and Parchment',
    content: `The afternoon sun slanted through the tall, mullioned windows of St. Jude's Archive, catching millions of dancing dust motes in suspended animation. Eleanor tapped the horsehair brush against the lip of her ceramic cleaning dish and paused.

Underneath the damp buckram cover of an 18th-century parish ledger lay something entirely out of place: a slender bundle tied with weathered blue silk ribbon. The ink on the uppermost envelope had faded to the color of dried lavender, yet the handwriting was distinct, slanted, and unmistakably urgent.

"To whoever holds this after the guns fall silent," the inscription read.

Eleanor's heart thumped against her ribs with an unfamiliar rhythm. In six years of archival restoration, she had trained herself to treat every relic with dispassionate reverence. But there was something intimate about the warmth lingering in the folded edges—as though the breath of the person who sealed it had been trapped beneath the wax, waiting sixty summers for someone to break the silence.

She glanced toward the front counter where Mr. Abernathy was dozing behind a stack of local trade gazettes. The grandfather clock in the vestibule ticked steadily. With steady fingers and a pocket bone folder, Eleanor gently lifted the ribbon.`,
  });

  const ch1_2 = await Chapter.create({
    novel: novel1._id,
    chapterNumber: 2,
    title: 'The Unsent Address',
    content: `The letter inside was dated October 14, 1944. It was written on lightweight airmail stationary that felt crisp as dragonfly wings under Eleanor’s fingertips.

"My dearest Clara," it began. "If you are reading this in St. Andrews, it means the sea fog has finally settled over the harbor and our little garden has put on its coat of frost. We leave for the northern crossing at midnight. I have hidden the architect’s sketches inside the hollow base of the cedar sundial at Blackwood Cove. Whatever happens, do not let them tear down the conservatory..."

Eleanor read the words three times until they etched themselves into her memory. The signature at the bottom was signed simply: "Julian."

Blackwood Cove was barely twelve miles south along the craggy coastline, past the abandoned salt marshes and the old granite quarry. When Eleanor closed the ledger that evening, the blue ribbon remained tucked safely in the breast pocket of her wool coat.`,
  });

  novel1.chapters = [ch1_1._id, ch1_2._id];
  await novel1.save();

  const ch2_1 = await Chapter.create({
    novel: novel2._id,
    chapterNumber: 1,
    title: 'The Cartographer’s Compass',
    content: `Vaelen stood on the precipice of the Cloudveil Crags, ink-stained fingers clutching a brass navigational sextant that spun without anchor. Below him, the great valleys of Solaria were shrouded in a roiling violet haze. The ward stones had failed at sunrise.

"It's true then," whispered Kaelen, his companion, checking the straps of his heavy crossbow. "The Crown has awakened."

"Not awakened," Vaelen corrected, adjusting the magnification lens until the distant silhouette of Mount Morren resolved into focus. "It is hungry. There is a vast difference."

According to the forbidden map tucked inside Vaelen’s oilskin tunic, the Obsidian Crown had been forged during the First Age by monarchs who bargained with shadows. For three hundred years, the mountain priests kept it bound in salt and silver wire. But someone had broken the seal from the inside.

A sudden gust of freezing wind tore through the pass, carrying with it the scent of scorched pine and ozone. The brass compass in Vaelen's hand clicked violently, its needle pointing not toward the magnetic north, but straight down into the abyssal rift of the Hollow Vale.`,
  });

  const ch2_2 = await Chapter.create({
    novel: novel2._id,
    chapterNumber: 2,
    title: 'Shadows in the Mist',
    content: `Descending into the Hollow Vale was like entering the mouth of a sleeping leviathan. The mist dampened all sound; even the crunch of their snowshoes against the frosted slate seemed muffled.

"Keep your torch low," Vaelen murmured. "The creatures of the fracture are drawn to light, but their vision is bound to heat."

They found the outer shrine an hour before twilight. The heavy oak gates had been splintered into matchwood. Deep gouges ran along the granite lintel, five inches deep, weeping a sticky, black sap that smelled faintly of cloves.

Inside, resting on a pedestal carved from a single block of volcanic glass, was not the Crown itself, but a single black feather bound to an obsidian token. Vaelen bent down, his breath catching in his throat.

"We are too late," he said softly. "The Raven Queen already has the second fragment."`,
  });

  novel2.chapters = [ch2_1._id, ch2_2._id];
  await novel2.save();

  const ch3_1 = await Chapter.create({
    novel: novel3._id,
    chapterNumber: 1,
    title: 'Sector 7 Static',
    content: `Rain in Kepler-9 was artificial, acidic, and tasted of recycled copper. Kira stood on the rusted catwalk of Sector 7, watching the magnetic maglev trains slice through neon billows of holographic advertisements.

Her optical implant flickered with an incoming encrypted packet. The sender had no IP, no neural signature, and bypassed three layers of civic firewalls as if they were made of tissue paper.

"Archivist Kira Thorne," a synthetic voice decoded directly into her auditory cortex. "The terraforming vault on Level Zero was never decommissioned. The seeds are still alive. Meet me at the sub-turbine before the night cycle ends."

Kira adjusted the collar of her thermal jacket. Level Zero had been condemned eighty cycles ago after the Great Breaching. No one went down there unless they were looking to erase their existence. Which was precisely why she started descending the emergency ladders.`,
  });

  novel3.chapters = [ch3_1._id];
  await novel3.save();

  const ch4_1 = await Chapter.create({
    novel: novel4._id,
    chapterNumber: 1,
    title: 'The Ticking Heart',
    content: `The fog over the River Thames was thick enough to chew, smelling of coal smoke and rotting timber. Inspector Thomas Thorne stepped carefully over the wet cobblestones beneath Blackfriars Bridge.

The victim was seated upright upon an iron bollard, top hat neatly placed beside him. In his stiff, gloved hands, he held a mahogany music box whose brass gears clicked and whirred with uncanny precision, chiming a nursery rhyme that echoed hollowly off the stone arches.

"Doctor?" Thorne asked, tipping his bowler hat to the police surgeon kneeling on the stones.

"Cause of death isn't drowning, Thorne," Dr. Watson replied grimly, shining a bullseye lantern onto the victim's chest. "Open his waistcoat. Look for yourself."

Thorne carefully peeled back the velvet lapel. Where the gentleman's pocket watch should have rested, an intricate assembly of interlocking brass gears had been surgically sewn directly into the flesh. With every passing second, the escapement wheel clicked against his sternum.`,
  });

  novel4.chapters = [ch4_1._id];
  await novel4.save();

  // Reader wishlist and likes
  readerMaya.wishlist = [novel1._id, novel2._id, novel4._id];
  readerMaya.likedNovels = [novel1._id, novel2._id];
  await readerMaya.save();

  // Awards
  const romanceAward = await Award.create({
    title: 'Annual Romance Writing Awards',
    genre: 'Romance',
    description: 'Celebrating the most heartwarming, captivating, and emotional romantic novels written this year on WriteUp. Cast your vote for your favorite romance author!',
    novels: [novel1._id, novel5._id],
    status: 'open',
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
  });

  const fantasyAward = await Award.create({
    title: 'Grand Fantasy Championship',
    genre: 'Fantasy',
    description: 'Honoring exceptional world-building, mythological depth, and unforgettable epic adventures in the realm of high and dark fantasy.',
    novels: [novel2._id],
    status: 'open',
    startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
  });

  const sciFiAward = await Award.create({
    title: 'Nebula Visionaries: Sci-Fi Awards',
    genre: 'Science Fiction',
    description: 'Recognizing visionary storytelling that pushes the boundaries of future technology, interstellar exploration, and artificial minds.',
    novels: [novel3._id, novel6._id],
    status: 'winner_declared',
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    winner: novel3._id,
  });

  await Award.create({
    title: 'Mystery & Noir Guild Awards',
    genre: 'Mystery',
    description: 'Coming soon: The best whodunits, investigative thrillers, and detective chronicles will compete for the golden magnifying glass.',
    novels: [novel4._id],
    status: 'upcoming',
    startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
  });

  // Votes
  await Vote.create({ user: readerMaya._id, award: romanceAward._id, novel: novel1._id });
  await Vote.create({ user: writerArthur._id, award: romanceAward._id, novel: novel1._id });
  await Vote.create({ user: writerJane._id, award: romanceAward._id, novel: novel5._id });
  await Vote.create({ user: readerMaya._id, award: sciFiAward._id, novel: novel3._id });

  console.log('✅ Seeding completed.');
};

module.exports = seedData;
