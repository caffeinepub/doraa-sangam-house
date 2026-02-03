// Rule-based response engine for RaaHi bot
// Provides friendly, helpful responses without external AI/LLM integration

interface ResponseRule {
  keywords: string[];
  responses: string[];
}

const responseRules: ResponseRule[] = [
  {
    keywords: ['hello', 'hi', 'hey', 'greetings'],
    responses: [
      "Hello! Welcome to DoRaa Sangam House. How can I help you today?",
      "Hi there! I'm here to help you find something special. What are you looking for?",
      "Hey! Great to see you. Let me know if you need any assistance!",
    ],
  },
  {
    keywords: ['product', 'item', 'buy', 'purchase', 'shop'],
    responses: [
      "We have a beautiful collection of curated products! Browse our Collections section to see all available items. Each product is carefully selected for quality and craftsmanship.",
      "Looking for something specific? Our collection features premium items with detailed descriptions. Feel free to explore and add items to your cart!",
      "All our products are handpicked for excellence. Check out the Collections section to discover items that match your style and needs.",
    ],
  },
  {
    keywords: ['recommend', 'suggestion', 'help choose', 'what should'],
    responses: [
      "I'd love to help! Our collection features items that blend traditional craftsmanship with modern design. What type of product interests you most?",
      "Great question! Each item in our collection tells a unique story. Browse through our Collections to find pieces that resonate with you.",
      "For personalized recommendations, explore our Collections section where you'll find detailed descriptions and images of each product.",
    ],
  },
  {
    keywords: ['price', 'cost', 'expensive', 'cheap', 'affordable'],
    responses: [
      "Our products are priced to reflect their quality and craftsmanship. You'll find the price clearly displayed on each product card in our Collections section.",
      "We offer a range of premium products at various price points. Check out individual product details for specific pricing information.",
      "Quality and value are important to us. Each product's price reflects its craftsmanship, materials, and the story behind it.",
    ],
  },
  {
    keywords: ['shipping', 'delivery', 'ship', 'deliver'],
    responses: [
      "We offer fast and secure delivery! Check our FAQ section for detailed shipping information, including delivery times and tracking options.",
      "Shipping details vary by location. Visit our FAQ section to learn more about delivery times, costs, and our packaging standards.",
      "We ensure your items arrive safely with premium packaging. For specific shipping questions, please see our FAQ section.",
    ],
  },
  {
    keywords: ['return', 'refund', 'exchange'],
    responses: [
      "We want you to be completely satisfied! Our return policy is detailed in the FAQ section. We accept returns within a specified period for most items.",
      "Returns and exchanges are handled with care. Please visit our FAQ section for our complete return policy and process.",
      "Your satisfaction matters to us. Check our FAQ section for information about returns, exchanges, and our quality guarantee.",
    ],
  },
  {
    keywords: ['authentic', 'genuine', 'real', 'quality'],
    responses: [
      "Authenticity is our promise! Every product is carefully verified and comes with our quality guarantee. We work directly with trusted artisans and suppliers.",
      "We stand behind the authenticity of every item. Each product is sourced from verified suppliers and meets our strict quality standards.",
      "Quality and authenticity are non-negotiable for us. Learn more about our commitment to excellence in the About section.",
    ],
  },
  {
    keywords: ['about', 'story', 'who are you', 'company'],
    responses: [
      "DoRaa Sangam House represents the confluence of tradition and modernity. Visit our About section to learn more about our story and values!",
      "We're passionate about curating exceptional products that honor craftsmanship and heritage. Check out our About section to learn our story.",
      "At DoRaa Sangam House, we believe in the perfect harmony of quality, authenticity, and design. Discover more in our About section!",
    ],
  },
  {
    keywords: ['contact', 'support', 'help', 'question'],
    responses: [
      "I'm here to help! For detailed information, check our FAQ section. For specific inquiries, you can reach our support team through the contact details in the FAQ.",
      "Need assistance? Our FAQ section covers most common questions. For personalized support, contact information is available there too.",
      "Happy to assist! Browse our FAQ section for answers to common questions, or reach out to our support team for personalized help.",
    ],
  },
  {
    keywords: ['thank', 'thanks', 'appreciate'],
    responses: [
      "You're very welcome! Let me know if there's anything else I can help you with.",
      "My pleasure! Feel free to ask if you have any other questions.",
      "Happy to help! Enjoy exploring our collection!",
    ],
  },
];

const fallbackResponses = [
  "That's a great question! For detailed information, I recommend checking our FAQ section or browsing through our Collections.",
  "I'm here to help guide you through DoRaa Sangam House! Feel free to explore our Collections, Product details, or FAQ sections for more information.",
  "Thanks for asking! While I can provide general guidance, you'll find comprehensive details in our Collections and FAQ sections.",
  "I'd love to help! Our website has detailed information in the Collections, About, and FAQ sections. What specific area interests you?",
];

export function generateRaaHiResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();

  // Check each rule for keyword matches
  for (const rule of responseRules) {
    for (const keyword of rule.keywords) {
      if (lowerMessage.includes(keyword)) {
        // Return a random response from matching rule
        const randomIndex = Math.floor(Math.random() * rule.responses.length);
        return rule.responses[randomIndex];
      }
    }
  }

  // Return random fallback response if no keywords match
  const randomIndex = Math.floor(Math.random() * fallbackResponses.length);
  return fallbackResponses[randomIndex];
}
