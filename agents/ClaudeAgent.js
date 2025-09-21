const axios = require('axios');

class ClaudeAgent {
  constructor(name, role, apiKey) {
    this.name = name;
    this.role = role;
    this.apiKey = apiKey;
    this.model = process.env.CLAUDE_MODEL || 'claude-3-haiku-20240307';
  }

  async generateResponse(prompt, maxTokens = 1000) {
    try {
      const response = await axios.post('https://api.anthropic.com/v1/messages', {
        model: this.model,
        max_tokens: maxTokens,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      }, {
        headers: {
          'x-api-key': this.apiKey,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01'
        }
      });

      return response.data.content[0].text;
    } catch (error) {
      console.error(`Error in ${this.name}:`, error.response?.data || error.message);
      throw new Error(`Claude API error: ${error.message}`);
    }
  }

  async logActivity(activity, data = {}) {
    // This would typically log to database
    console.log(`[${this.name}] ${activity}:`, data);
  }
}

module.exports = ClaudeAgent;
