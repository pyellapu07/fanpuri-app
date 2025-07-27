const { db } = require('./firebase-config');

async function cleanupArtists() {
  try {
    console.log('Cleaning up duplicate artists...');
    
    // Get all artists
    const snapshot = await db.collection('artists').get();
    const artists = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    console.log(`Found ${artists.length} artists`);
    
    // Group by username to find duplicates
    const artistGroups = {};
    artists.forEach(artist => {
      const username = artist.username;
      if (!artistGroups[username]) {
        artistGroups[username] = [];
      }
      artistGroups[username].push(artist);
    });
    
    // Delete duplicates (keep the first one)
    let deletedCount = 0;
    for (const [username, group] of Object.entries(artistGroups)) {
      if (group.length > 1) {
        console.log(`Found ${group.length} duplicates for ${username}`);
        
        // Keep the first one, delete the rest
        for (let i = 1; i < group.length; i++) {
          await db.collection('artists').doc(group[i].id).delete();
          deletedCount++;
          console.log(`Deleted duplicate artist: ${group[i].name}`);
        }
      }
    }
    
    console.log(`Cleanup complete! Deleted ${deletedCount} duplicate artists`);
    
    // Show remaining artists
    const remainingSnapshot = await db.collection('artists').get();
    const remainingArtists = remainingSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    console.log('\nRemaining artists:');
    remainingArtists.forEach(artist => {
      console.log(`- ${artist.name} (${artist.username})`);
    });
    
  } catch (error) {
    console.error('Error cleaning up artists:', error);
  }
}

cleanupArtists(); 