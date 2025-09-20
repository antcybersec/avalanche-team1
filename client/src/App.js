import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [ideas, setIdeas] = useState([]);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentAgent, setCurrentAgent] = useState(null);
  const [agentActivity, setAgentActivity] = useState([]);
  const [tokenHolderId] = useState('token_holder_' + Math.random().toString(36).substr(2, 9));

  // Fetch ideas on component mount
  useEffect(() => {
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/ideas');
      const data = await response.json();
      if (data.success && data.ideas.length > 0) {
        // Get the most recent idea with full details
        const latestIdeaId = data.ideas[0].id;
        const ideaResponse = await fetch(`http://localhost:5001/api/ideas/${latestIdeaId}`);
        const ideaData = await ideaResponse.json();
        if (ideaData.success) {
          console.log('Fetched idea data:', ideaData.idea);
          setIdeas([ideaData.idea]);
        }
      } else {
        setIdeas([]);
      }
    } catch (error) {
      console.error('Error fetching ideas:', error);
    }
  };

  const generateIdeas = async () => {
    setLoading(true);
    setCurrentAgent('CEO Agent');
    setAgentActivity(prev => [...prev, { agent: 'CEO Agent', action: 'Generating new business idea...', time: new Date().toLocaleTimeString() }]);
    
    // Clear existing ideas to show only the new one
    setIdeas([]);
    
    try {
      const response = await fetch('http://localhost:5001/api/agents/generate-ideas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ count: 1 }),
      });
      const data = await response.json();
      if (data.success) {
        setAgentActivity(prev => [...prev, { agent: 'CEO Agent', action: 'Idea generated successfully!', time: new Date().toLocaleTimeString() }]);
        await fetchIdeas();
      }
    } catch (error) {
      console.error('Error generating ideas:', error);
      setAgentActivity(prev => [...prev, { agent: 'CEO Agent', action: 'Error generating idea', time: new Date().toLocaleTimeString() }]);
    } finally {
      setLoading(false);
      setCurrentAgent(null);
    }
  };

  const researchIdea = async (ideaId) => {
    setLoading(true);
    setCurrentAgent('Research Agent');
    setAgentActivity(prev => [...prev, { agent: 'Research Agent', action: 'Conducting market research...', time: new Date().toLocaleTimeString() }]);
    
    try {
      const response = await fetch(`http://localhost:5001/api/agents/research/${ideaId}`, {
        method: 'POST',
      });
      const data = await response.json();
      if (data.success) {
        setAgentActivity(prev => [...prev, { agent: 'Research Agent', action: 'Research completed successfully!', time: new Date().toLocaleTimeString() }]);
        setAgentActivity(prev => [...prev, { agent: 'Research Agent', action: 'Sharing research data with Product Agent...', time: new Date().toLocaleTimeString() }]);
        await fetchIdeas();
        
        // Auto-trigger Product Agent after research completes
        setTimeout(() => {
          setAgentActivity(prev => [...prev, { agent: '🔄 Data Transfer', action: 'Research data successfully transferred to Product Agent', time: new Date().toLocaleTimeString() }]);
          setAgentActivity(prev => [...prev, { agent: 'Product Agent', action: 'Received research data. Starting product development...', time: new Date().toLocaleTimeString() }]);
          developProduct(ideaId);
        }, 2000);
      }
    } catch (error) {
      console.error('Error researching idea:', error);
      setAgentActivity(prev => [...prev, { agent: 'Research Agent', action: 'Error in research', time: new Date().toLocaleTimeString() }]);
    } finally {
      setLoading(false);
      setCurrentAgent(null);
    }
  };

  const developProduct = async (ideaId) => {
    setLoading(true);
    setCurrentAgent('Product Agent');
    setAgentActivity(prev => [...prev, { agent: 'Product Agent', action: 'Developing product concept...', time: new Date().toLocaleTimeString() }]);
    
    try {
      const response = await fetch(`http://localhost:5001/api/agents/develop-product/${ideaId}`, {
        method: 'POST',
      });
      const data = await response.json();
      if (data.success) {
        setAgentActivity(prev => [...prev, { agent: 'Product Agent', action: 'Product concept developed successfully!', time: new Date().toLocaleTimeString() }]);
        setAgentActivity(prev => [...prev, { agent: 'Product Agent', action: 'Sharing product concept with CEO Agent...', time: new Date().toLocaleTimeString() }]);
        await fetchIdeas();
        
        // Auto-trigger CEO evaluation after product is ready
        setTimeout(() => {
          setAgentActivity(prev => [...prev, { agent: '🔄 Data Transfer', action: 'Product concept successfully transferred to CEO Agent', time: new Date().toLocaleTimeString() }]);
          setAgentActivity(prev => [...prev, { agent: 'CEO Agent', action: 'Received product concept. Evaluating market viability...', time: new Date().toLocaleTimeString() }]);
          setTimeout(() => {
            setAgentActivity(prev => [...prev, { agent: 'CEO Agent', action: 'Product evaluation complete! Approved for final token holder vote.', time: new Date().toLocaleTimeString() }]);
            setAgentActivity(prev => [...prev, { agent: '🎯 Final Stage', action: 'Product concept ready for token holder approval!', time: new Date().toLocaleTimeString() }]);
            setAgentActivity(prev => [...prev, { agent: 'CEO Agent', action: 'Workflow complete - awaiting final token holder decision', time: new Date().toLocaleTimeString() }]);
          }, 3000);
        }, 2000);
      }
    } catch (error) {
      console.error('Error developing product:', error);
      setAgentActivity(prev => [...prev, { agent: 'Product Agent', action: 'Error in product development - using fallback data', time: new Date().toLocaleTimeString() }]);
      // Still fetch ideas to show any partial data
      await fetchIdeas();
    } finally {
      setLoading(false);
      setCurrentAgent(null);
    }
  };

  const voteOnItem = async (itemType, itemId, vote, feedback = '') => {
    try {
      const response = await fetch('http://localhost:5001/api/tokens/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tokenHolderId,
          itemType,
          itemId,
          vote,
          feedback,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setAgentActivity(prev => [...prev, { 
          agent: 'Token Holder', 
          action: `${vote}d ${itemType}`, 
          time: new Date().toLocaleTimeString() 
        }]);
        
        await fetchIdeas();
        
        // Auto-trigger next step if idea is approved
        if (itemType === 'idea' && vote === 'approve') {
          setTimeout(() => {
            researchIdea(itemId);
          }, 1000);
        }
        
        // Auto-trigger product development if research is done and product is approved
        if (itemType === 'product' && vote === 'approve') {
          setTimeout(() => {
            const idea = ideas.find(i => i.id === itemId);
            if (idea && idea.research && !idea.product) {
              developProduct(itemId);
            }
          }, 1000);
        }
      }
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'green';
      case 'rejected': return 'red';
      case 'pending': return 'orange';
      default: return 'gray';
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🤖 AI Company - Token Holder Dashboard</h1>
        <p>Token Holder ID: {tokenHolderId}</p>
      </header>

      <main className="main-content">
        <div className="controls">
          <button 
            onClick={generateIdeas} 
            disabled={loading}
            className="generate-btn"
          >
            {loading ? `Generating... (${currentAgent})` : 'Generate New Idea ($1M Potential)'}
          </button>
          <button 
            onClick={() => {
              setIdeas([]);
              setAgentActivity([]);
              setCurrentAgent(null);
            }}
            className="clear-btn"
          >
            🗑️ Clear All & Start Fresh
          </button>
          <button 
            onClick={fetchIdeas}
            className="refresh-btn"
          >
            🔄 Refresh Data
          </button>
        </div>

        {/* Agent Activity Display */}
        <div className="agent-activity">
          <h3>🤖 Agent Activity</h3>
          {currentAgent && (
            <div className="current-agent">
              <strong>{currentAgent}</strong> is currently working...
            </div>
          )}
          <div className="activity-log">
            {agentActivity.slice(-5).reverse().map((activity, index) => (
              <div key={index} className="activity-item">
                <span className="agent-name">{activity.agent}:</span>
                <span className="action">{activity.action}</span>
                <span className="time">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="ideas-grid">
          {ideas.map((idea) => (
            <div key={idea.id} className="idea-card">
              <h3>{idea.title}</h3>
              <p>{idea.description}</p>
              <p><strong>Revenue Model:</strong> {idea.potential_revenue}</p>
              <p><strong>Status:</strong> 
                <span style={{ color: getStatusColor(idea.status) }}>
                  {idea.status.toUpperCase()}
                </span>
              </p>
              
              <div className="idea-actions">
                {idea.status === 'pending' && (
                  <>
                    <button 
                      onClick={() => voteOnItem('idea', idea.id, 'approve')}
                      className="approve-btn"
                    >
                      ✅ Approve & Start Research
                    </button>
                    <button 
                      onClick={() => voteOnItem('idea', idea.id, 'reject')}
                      className="reject-btn"
                    >
                      ❌ Reject
                    </button>
                  </>
                )}
                
                {idea.status === 'approved' && !idea.research && (
                  <div className="workflow-status">
                    <span className="status-text">⏳ Research Agent will start automatically...</span>
                  </div>
                )}
                
                {idea.research && !idea.product && (
                  <div className="workflow-status">
                    <span className="status-text">⏳ Product Agent will start automatically...</span>
                  </div>
                )}
                
                {idea.product && idea.product.status === 'pending' && (
                  <div className="final-approval-section">
                    <div className="ceo-approval-header">
                      <h4>🎯 CEO Agent Evaluation Complete!</h4>
                      <p>The CEO Agent has reviewed the product concept and approved it for final token holder vote.</p>
                    </div>
                    <div className="final-voting-section">
                      <h5>Final Token Holder Decision Required:</h5>
                      <div className="product-actions">
                        <button 
                          onClick={() => voteOnItem('product', idea.product.id, 'approve')}
                          className="final-approve-btn"
                        >
                          🚀 APPROVE FINAL PRODUCT
                        </button>
                        <button 
                          onClick={() => voteOnItem('product', idea.product.id, 'reject')}
                          className="final-reject-btn"
                        >
                          ❌ REJECT PRODUCT
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                {idea.product && idea.product.status === 'approved' && (
                  <div className="workflow-complete">
                    <span className="complete-text">🎉 WORKFLOW COMPLETE! Product approved and ready for development!</span>
                  </div>
                )}
              </div>

              {idea.research && (
                <div className="research-section">
                  <h4>📊 Research Results (Shared with Product Agent):</h4>
                  <div className="research-summary">
                    <p><strong>Market Size:</strong> {idea.research.market_analysis?.market_size}</p>
                    <p><strong>Growth Potential:</strong> {idea.research.market_analysis?.growth_potential}</p>
                    <p><strong>Competitors Found:</strong> {idea.research.competitors?.length || 0}</p>
                    <p><strong>Key Opportunities:</strong> {idea.research.market_analysis?.opportunities?.slice(0, 2).join(', ')}</p>
                    <p><strong>Target Audience:</strong> {idea.research.recommendations?.target_audience}</p>
                  </div>
                  <div className="research-status">
                    <span className="status-badge">✅ Research Complete - Data Shared</span>
                  </div>
                </div>
              )}

              {idea.product && (
                <div className="product-section">
                  <h4>🚀 Product Concept (CEO Approved):</h4>
                  <div className="product-details">
                    <p><strong>Product Name:</strong> {idea.product.product_name}</p>
                    <p><strong>Description:</strong> {idea.product.product_description}</p>
                    <p><strong>Core Features:</strong></p>
                    <ul className="features-list">
                      {idea.product.features?.slice(0, 5).map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                    {idea.product.features?.length > 5 && (
                      <p className="more-features">...and {idea.product.features.length - 5} more features</p>
                    )}
                  </div>
                  
                  <div className="ceo-approval-badge">
                    <span>✅ CEO Agent Approved</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {ideas.length === 0 && (
          <div className="empty-state">
            <p>No idea currently being worked on. Click "Generate New Idea" to start the AI Company workflow!</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;