import { createParticles } from './animations.js';
import { createNavigation } from './navigation.js';
import { createInteractions } from './interactions.js';

createParticles(document.getElementById('particles'));
const interactions = createInteractions();
const navigation = createNavigation({
  content: document.getElementById('scene-content'),
  art: document.getElementById('scene-art'),
  list: document.getElementById('chapter-list'),
  announcer: document.getElementById('announcer'),
  onLeave: interactions.cleanup,
});
interactions.bind(navigation);
