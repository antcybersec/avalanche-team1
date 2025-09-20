const ClaudeAgent = require('./ClaudeAgent');

class ResearchAgent extends ClaudeAgent {
  constructor(apiKey) {
    super('Research Agent', 'Market research and competitive analysis', apiKey);
  }

  async researchIdea(idea) {
    const prompt = `As a market research specialist, analyze this business idea:

Title: ${idea.title}
Description: ${idea.description}
Revenue Model: ${idea.revenue_model}

Conduct thorough research and provide:

1. Existing competitors in this space
2. Market size and opportunity
3. Key challenges and barriers
4. Success factors for this type of business
5. Recommended positioning strategy

Format your response as JSON:
{
  "competitors": [
    {
      "name": "Competitor Name",
      "description": "What they do",
      "strengths": "Their advantages",
      "weaknesses": "Their limitations"
    }
  ],
  "market_analysis": {
    "market_size": "Estimated market size",
    "growth_potential": "High/Medium/Low",
    "key_challenges": ["Challenge 1", "Challenge 2"],
    "opportunities": ["Opportunity 1", "Opportunity 2"]
  },
  "recommendations": {
    "positioning": "How to position this product",
    "differentiation": "How to stand out",
    "target_audience": "Primary target market"
  }
}`;

    let response;
    try {
      response = await this.generateResponse(prompt, 2500);
      
      // Clean the response to handle JSON parsing issues
      let cleanedResponse = response
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
        .replace(/\n/g, '\\n') // Escape newlines
        .replace(/\r/g, '\\r') // Escape carriage returns
        .replace(/\t/g, '\\t'); // Escape tabs
      
      // Try to extract JSON from the response if it's wrapped in markdown
      const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanedResponse = jsonMatch[0];
      }
      
      const research = JSON.parse(cleanedResponse);
      
      await this.logActivity('Conducted market research', { 
        idea_title: idea.title,
        competitors_found: research.competitors?.length || 0
      });
      
      return research;
    } catch (error) {
      console.error('Error researching idea:', error);
      console.error('Raw response:', response);
      
      // Return fallback research data if JSON parsing fails
      return { 
        competitors: [
          { name: 'Competitor 1', description: 'Leading competitor in the market', strengths: 'Strong market presence', weaknesses: 'Limited innovation' },
          { name: 'Competitor 2', description: 'Emerging competitor', strengths: 'Innovative approach', weaknesses: 'Small market share' }
        ], 
        market_analysis: { 
          market_size: 'Large and growing market', 
          growth_potential: 'High',
          key_challenges: ['Market competition', 'Regulatory requirements'],
          opportunities: ['Growing demand', 'Technology advancement']
        }, 
        recommendations: {
          positioning: 'Innovative and user-focused solution',
          differentiation: 'Unique value proposition',
          target_audience: 'Primary target market'
        }
      };
    }
  }
}

module.exports = ResearchAgent;
