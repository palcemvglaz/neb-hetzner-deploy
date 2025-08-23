# Nebachiv Marketing Assets

This directory contains structured marketing data extracted from the KB_NEB knowledge base, including testimonials, social proof, and content for the landing page.

## 📁 Structure

```
assets/
├── testimonials/           # Categorized user testimonials
│   ├── hero-testimonials.json      # Top life-saving stories
│   ├── transformations.json        # Personal growth stories
│   ├── expert-validation.json      # Professional endorsements
│   ├── family-impact.json          # Community & family stories
│   └── categories.json             # Complete categorization
├── social-proof/          # Metrics and statistics
│   └── statistics.json             # Impact numbers & demographics
├── content/               # Marketing copy and messaging
│   ├── hero-messages.json          # Value propositions
│   ├── features.json               # Unique features & methodology
│   └── ukrainian-pride.json        # Language & cultural impact
└── index.json             # Central index file
```

## 🚀 Quick Start

### For React/Next.js Components

```typescript
// Import specific testimonial sets
import heroTestimonials from './assets/testimonials/hero-testimonials.json';
import statistics from './assets/social-proof/statistics.json';

// Use in component
const TopTestimonial = () => {
  const { testimonials } = heroTestimonials;
  const topStory = testimonials[0]; // Володимир's life-saving story
  
  return (
    <blockquote>
      <p>{topStory.text_ua}</p>
      <cite>— {topStory.author}</cite>
    </blockquote>
  );
};
```

### For Landing Page Sections

```typescript
// Hero Section
import { primary_hero } from './assets/content/hero-messages.json';

// Features Grid
import { core_features } from './assets/content/features.json';

// Social Proof Bar
import { overview } from './assets/social-proof/statistics.json';
```

## 📊 Key Statistics

- **750+** testimonials analyzed
- **50** high-quality testimonials selected
- **5** documented life-saving stories
- **489** likes on top testimonial
- **4800km** longest beginner journey
- **100%** Ukrainian content

## 🎯 Usage Guidelines

### 1. Hero Section
- Use life-saving testimonials (hero-001, hero-002)
- Emphasize "Інформація, яка рятує життя"
- Include statistics bar with key numbers

### 2. Social Proof
- Rotate testimonials by category
- Show variety: beginners, experts, women, families
- Include platform icons (YouTube, Instagram)

### 3. Features Section
- Highlight unique methodology
- Use icon + title + description format
- Include testimonial proof for each feature

### 4. Ukrainian Pride
- Emphasize first/best Ukrainian content
- Show community appreciation
- Include patriotic elements tastefully

## 🌐 Internationalization

All testimonials include:
- `text_ua` - Original Ukrainian text
- `text_en` - English translation
- Use based on user's language preference

## 🏷️ Testimonial Categories

1. **life_saved** - Direct life-saving accounts
2. **transformation** - Beginner to confident rider
3. **expert_validation** - Professional endorsements  
4. **family_impact** - Beyond just riders
5. **skill_development** - Technical improvements
6. **ukrainian_content** - Language appreciation
7. **practical_application** - Real-world usage
8. **entertainment_value** - Engaging education
9. **accident_recovery** - Overcoming trauma
10. **community_support** - Social aspects

## 💡 Best Practices

1. **Authenticity First**
   - Keep original wording
   - Include typos/emotions
   - Show real engagement numbers

2. **Emotional Connection**
   - Lead with life-saving stories
   - Include family impact
   - Show transformation journeys

3. **Credibility Building**
   - Mix beginner and expert testimonials
   - Show professional endorsements
   - Include specific details (km, time, techniques)

4. **Cultural Sensitivity**
   - Respect Ukrainian language pride
   - Include "Слава Україні" appropriately
   - Highlight cultural impact

## 🔄 Updates

This data was extracted from KB_NEB knowledge base on January 13, 2025.
Original sources:
- `/vault_output/marketing_data/HIGH_QUALITY_TESTIMONIALS.md`
- `/vault_output/marketing_data/testimonials-collection.md`
- `/vault_output/marketing_data/youtube_comments_full.json`

---

For questions or updates, refer to the KB_NEB project documentation.