const express = require('express');
const router = express.Router();
const CEOAgent = require('../agents/CEOAgent');
const ResearchAgent = require('../agents/ResearchAgent');
const ProductAgent = require('../agents/ProductAgent');
const db = require('../database/setup');

// Initialize agents
const ceoAgent = new CEOAgent(process.env.CLAUDE_API_KEY);
const researchAgent = new ResearchAgent(process.env.CLAUDE_API_KEY);
const productAgent = new ProductAgent(process.env.CLAUDE_API_KEY);

// Generate ideas
router.post('/generate-ideas', async (req, res) => {
  try {
    const { count = 3 } = req.body;
    const ideas = await ceoAgent.generateIdeas(count);
    
    // Save ideas to database
    for (const idea of ideas) {
      db.run(
        'INSERT INTO ideas (title, description, potential_revenue) VALUES (?, ?, ?)',
        [idea.title, idea.description, idea.revenue_model],
        function(err) {
          if (err) console.error('Error saving idea:', err);
        }
      );
    }
    
    res.json({ success: true, ideas });
  } catch (error) {
    console.error('Error generating ideas:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Research an idea
router.post('/research/:ideaId', async (req, res) => {
  try {
    const { ideaId } = req.params;
    
    // Get idea from database
    db.get('SELECT * FROM ideas WHERE id = ?', [ideaId], async (err, idea) => {
      if (err) {
        return res.status(500).json({ success: false, error: err.message });
      }
      
      if (!idea) {
        return res.status(404).json({ success: false, error: 'Idea not found' });
      }
      
      const research = await researchAgent.researchIdea(idea);
      
      // Save research to database
      db.run(
        'INSERT INTO research (idea_id, research_data, competitor_analysis, market_opportunity) VALUES (?, ?, ?, ?)',
        [ideaId, JSON.stringify(research), JSON.stringify(research.competitors), JSON.stringify(research.market_analysis)],
        function(err) {
          if (err) console.error('Error saving research:', err);
        }
      );
      
      res.json({ success: true, research });
    });
  } catch (error) {
    console.error('Error researching idea:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Develop product
router.post('/develop-product/:ideaId', async (req, res) => {
  try {
    const { ideaId } = req.params;
    
    // Get idea and research
    db.get('SELECT * FROM ideas WHERE id = ?', [ideaId], async (err, idea) => {
      if (err) {
        return res.status(500).json({ success: false, error: err.message });
      }
      
      db.get('SELECT * FROM research WHERE idea_id = ? ORDER BY created_at DESC LIMIT 1', [ideaId], async (err, research) => {
        if (err) {
          return res.status(500).json({ success: false, error: err.message });
        }
        
        const researchData = research ? JSON.parse(research.research_data) : {};
        const product = await productAgent.developProduct(idea, researchData);
        
        // Save product to database
        db.run(
          'INSERT INTO products (idea_id, product_name, product_description, features, target_market) VALUES (?, ?, ?, ?, ?)',
          [ideaId, product.product_name, product.product_description, JSON.stringify(product.core_features), JSON.stringify(product.target_market)],
          function(err) {
            if (err) console.error('Error saving product:', err);
          }
        );
        
        res.json({ success: true, product });
      });
    });
  } catch (error) {
    console.error('Error developing product:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get agent activities
router.get('/activities', (req, res) => {
  db.all('SELECT * FROM agent_activities ORDER BY created_at DESC LIMIT 50', (err, activities) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    res.json({ success: true, activities });
  });
});

module.exports = router;
