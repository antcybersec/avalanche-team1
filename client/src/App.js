import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [ideas, setIdeas] = useState([]);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentAgent, setCurrentAgent] = useState(null);
  const [agentActivity, setAgentActivity] = useState([]);
  const [marketingStrategy, setMarketingStrategy] = useState(null);
  const [boltPrompt, setBoltPrompt] = useState(null);
  const [showBoltModal, setShowBoltModal] = useState(false);
  const [tokenHolderId] = useState('token_holder_' + Math.random().toString(36).substr(2, 9));
  const boltWindowRef = useRef(null);

  // Helper function to safely format target market segments
  const formatSegment = (val) => {
    if (!val) return 'N/A';
    if (typeof val === 'string') return val;
    if (Array.isArray(val)) return val.join(', ');
    if (typeof val === 'object') {
      if (val.segment) return val.segment;
      if (val.segments) return Array.isArray(val.segments) ? val.segments.join(', ') : String(val.segments);
      return Object.values(val).filter(v => typeof v === 'string').join(', ') || 'N/A';
    }
    return String(val);
  };

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

  const triggerCMOAndCTO = async (ideaId) => {
    setLoading(true);
    setCurrentAgent('CMO & CTO Agents');
    
    try {
      // Trigger CMO Agent
      setAgentActivity(prev => [...prev, { 
        agent: 'CMO Agent', 
        action: 'Developing marketing strategy...', 
        time: new Date().toLocaleTimeString() 
      }]);
      
      const cmoResponse = await fetch(`http://localhost:5001/api/agents/marketing-strategy/${ideaId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const cmoData = await cmoResponse.json();
      
      if (cmoData.success) {
        setMarketingStrategy(cmoData.strategy);
        setAgentActivity(prev => [...prev, { 
          agent: 'CMO Agent', 
          action: `Marketing strategy complete! ${cmoData.strategy.marketing_channels?.length || 0} channels identified`, 
          time: new Date().toLocaleTimeString() 
        }]);
      }
      
      // Trigger CTO Agent
      setAgentActivity(prev => [...prev, { 
        agent: 'CTO Agent', 
        action: 'Developing technical strategy...', 
        time: new Date().toLocaleTimeString() 
      }]);
      
      const ctoResponse = await fetch(`http://localhost:5001/api/agents/technical-strategy/${ideaId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const ctoData = await ctoResponse.json();
      
      if (ctoData.success) {
        setAgentActivity(prev => [...prev, { 
          agent: 'CTO Agent', 
          action: `Technical strategy complete! ${Object.keys(ctoData.strategy.technology_stack || {}).length} tech components planned`, 
          time: new Date().toLocaleTimeString() 
        }]);
        
        // Trigger Head of Engineering after CTO completes
        setTimeout(() => {
          setAgentActivity(prev => [...prev, { 
            agent: '🔄 Data Transfer', 
            action: 'Technical strategy shared with Head of Engineering', 
            time: new Date().toLocaleTimeString() 
          }]);
          setAgentActivity(prev => [...prev, { 
            agent: 'Head of Engineering', 
            action: 'Creating Bolt prompt for website development...', 
            time: new Date().toLocaleTimeString() 
          }]);
          createBoltPrompt(ideaId);
        }, 2000);
      }
      
      setAgentActivity(prev => [...prev, { 
        agent: 'System', 
        action: '🎉 All agents complete! Product ready for development!', 
        time: new Date().toLocaleTimeString() 
      }]);
      
    } catch (error) {
      console.error('Error triggering CMO/CTO agents:', error);
    } finally {
      setLoading(false);
      setCurrentAgent(null);
    }
  };

  const createBoltPrompt = async (ideaId) => {
    try {
      const response = await fetch(`http://localhost:5001/api/agents/bolt-prompt/${ideaId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      
      if (data.success) {
        setBoltPrompt(data.boltPrompt);
        setAgentActivity(prev => [...prev, { 
          agent: 'Head of Engineering', 
          action: `Bolt prompt created! ${data.boltPrompt.pages_required?.length || 0} pages planned for website`, 
          time: new Date().toLocaleTimeString() 
        }]);
        setAgentActivity(prev => [...prev, { 
          agent: '🎯 Final Stage', 
          action: 'Website development prompt ready! Ready to build with Bolt!', 
          time: new Date().toLocaleTimeString() 
        }]);
        
        // Automatically open Developer Agent (Bolt) in a new tab now that prompt is ready
        try {
          openBoltNewTab();
          setAgentActivity(prev => [...prev, { 
            agent: '🚀 System', 
            action: 'Opening Developer Agent in a new tab with website prompt...', 
            time: new Date().toLocaleTimeString() 
          }]);
        } catch (e) {
          setAgentActivity(prev => [...prev, { 
            agent: '🚀 System', 
            action: 'Popup blocked. Click "Open in Developer Agent" to continue.', 
            time: new Date().toLocaleTimeString() 
          }]);
        }
      }
    } catch (error) {
      console.error('Error creating Bolt prompt:', error);
      setAgentActivity(prev => [...prev, { 
        agent: 'Head of Engineering', 
        action: 'Error creating Bolt prompt', 
        time: new Date().toLocaleTimeString() 
      }]);
    }
  };

  const getBoltUrl = () => {
    const promptText = boltPrompt?.bolt_prompt ||
      'Build a modern, responsive website. Include homepage, features, pricing, about, contact pages.';
    const params = new URLSearchParams({
      prompt: promptText,
      autostart: '1',
    });
    return `http://localhost:5173/?${params.toString()}`;
  };

  const openBoltNewTab = () => {
    const url = getBoltUrl();
    // If we pre-opened a placeholder window, navigate it; else open a fresh tab
    if (boltWindowRef.current && !boltWindowRef.current.closed) {
      try {
        boltWindowRef.current.location.href = url;
        return;
      } catch (_) {
        // Fallback to opening a new tab
      }
    }
    window.open(url, '_blank', 'noopener');
  };

  const openBoltWithPrompt = () => {
    // If no boltPrompt exists, create a fallback one
    if (!boltPrompt) {
      const fallbackPrompt = {
        website_title: "AI Health Guardian Website",
        website_description: "A modern, responsive website for the AI Health Guardian platform",
        bolt_prompt: "Build a modern, responsive healthcare website for AI Health Guardian - a personalized AI health monitoring system. Include homepage, features page, pricing, about us, and contact pages. Use a clean, medical-themed design with blue and green colors. Include sections for: hero banner, features showcase, testimonials, pricing plans, and contact form. Make it mobile-responsive and professional."
      };
      setBoltPrompt(fallbackPrompt);
    }
    
    // Prefer opening a new tab for Developer Agent to avoid cross-origin isolation issues
    openBoltNewTab();
    setAgentActivity(prev => [...prev, { 
      agent: '🚀 System', 
      action: 'Opening Developer Agent (new tab) with website prompt...', 
      time: new Date().toLocaleTimeString() 
    }]);
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
          
          // Auto-trigger CMO and CTO agents after product approval
          setTimeout(() => {
            triggerCMOAndCTO(itemId);
          }, 3000);
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
          <button 
            onClick={openBoltWithPrompt}
            className="test-bolt-btn"
          >
            🚀 Test Bolt Integration
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

              {idea.research && !idea.product && (
                <div className="research-section">
                  <h4>📊 Research Agent Status:</h4>
                  <div className="research-status">
                    <span className="status-badge">✅ Research Complete - Data Shared with Product Agent</span>
                  </div>
                </div>
              )}

              {idea.product && (
                <div className="product-section">
                  <h4>🚀 Complete Product Concept (CEO Approved):</h4>
                  <div className="product-details">
                    <div className="product-header">
                      <h5>🎯 {idea.product.product_name}</h5>
                      <div className="ceo-approval-badge">
                        <span>✅ CEO Agent Approved</span>
                      </div>
                    </div>
                    
                    <div className="product-description">
                      <h6>📝 Product Description:</h6>
                      <p>{idea.product.product_description}</p>
                    </div>
                    
                    <div className="product-features">
                      <h6>⚡ Core Features ({idea.product.features?.length || 0}):</h6>
                      <ul className="features-list">
                        {idea.product.features?.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                    
        <div className="product-market">
          <h6>🎯 Target Market:</h6>
          <div className="market-details">
            {typeof idea.product.target_market === 'object' ? (
              <>
                <p><strong>Primary:</strong> {formatSegment(idea.product.target_market.primary)}</p>
                <p><strong>Secondary:</strong> {formatSegment(idea.product.target_market.secondary)}</p>
              </>
            ) : (
              <p>{formatSegment(idea.product.target_market)}</p>
            )}
          </div>
        </div>
                    
                    {idea.product.value_proposition && (
                      <div className="product-value">
                        <h6>💎 Value Proposition:</h6>
                        <p>{idea.product.value_proposition}</p>
                      </div>
                    )}
                    
                    {idea.product.revenue_model && (
                      <div className="product-revenue">
                        <h6>💰 Revenue Model:</h6>
                        <p>{idea.product.revenue_model}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Marketing Strategy Section */}
              {marketingStrategy && (
                <div className="marketing-strategy-section">
                  <h4>📢 Marketing Strategy (CMO Agent):</h4>
                  <div className="marketing-details">
                    <div className="marketing-positioning">
                      <h6>🎯 Brand Positioning:</h6>
                      <p>{marketingStrategy.brand_positioning}</p>
                    </div>
                    
                    {marketingStrategy.key_messages && (
                      <div className="marketing-messages">
                        <h6>💬 Key Messages:</h6>
                        <ul>
                          {marketingStrategy.key_messages.map((message, index) => (
                            <li key={index}>{message}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {marketingStrategy.marketing_channels && (
                      <div className="marketing-channels">
                        <h6>📺 Marketing Channels:</h6>
                        <ul>
                          {marketingStrategy.marketing_channels.map((channel, index) => (
                            <li key={index}>
                              <strong>{channel.channel}:</strong> {channel.strategy} ({channel.budget_allocation})
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {marketingStrategy.budget_recommendations && (
                      <div className="marketing-budget">
                        <h6>💰 Budget Recommendations:</h6>
                        <p><strong>Total Budget:</strong> {marketingStrategy.budget_recommendations.total_budget}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Bolt Prompt Section */}
              {boltPrompt && (
                <div className="bolt-prompt-section">
                  <h4>🏗️ Website Development Prompt (Head of Engineering):</h4>
                  <div className="bolt-details">
                    <div className="bolt-header">
                      <h6>📋 Website: {boltPrompt.website_title}</h6>
                      <p>{boltPrompt.website_description}</p>
                    </div>
                    
                    {boltPrompt.pages_required && (
                      <div className="bolt-pages">
                        <h6>📄 Pages Required:</h6>
                        <ul>
                          {boltPrompt.pages_required.map((page, index) => (
                            <li key={index}>{page}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {boltPrompt.functional_requirements && (
                      <div className="bolt-features">
                        <h6>⚙️ Functional Requirements:</h6>
                        <ul>
                          {boltPrompt.functional_requirements.map((feature, index) => (
                            <li key={index}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="bolt-prompt">
                      <h6>🚀 Bolt Prompt:</h6>
                      <div className="prompt-text">
                        {boltPrompt.bolt_prompt}
                      </div>
                    </div>
                  </div>
                  
                  {/* Build Website Button */}
                  <div className="build-website-section">
                    <button 
                      className="build-website-btn"
                      onClick={openBoltWithPrompt}
                    >
                      🚀 Build Website with Developer Agent
                    </button>
                    <p className="build-website-desc">
                      Click to open the Developer Agent (Bolt) with this prompt and start building your website!
                    </p>
                  </div>
                  
                  {/* Inline Bolt Development Section */}
                  {showBoltModal && boltPrompt && (
                    <div className="bolt-development-section">
                      <div className="bolt-section-header">
                        <h4>🚀 Developer Agent - Website Development</h4>
                        <button 
                          className="close-bolt-btn"
                          onClick={() => setShowBoltModal(false)}
                        >
                          ✕ Close
                        </button>
                      </div>
                      
                      <div className="bolt-section-content">
                        <div className="bolt-prompt-info">
                          <h5>📋 Building: {boltPrompt.website_title}</h5>
                          <p>{boltPrompt.website_description}</p>
                          <div className="bolt-prompt-display">
                            <strong>Prompt sent to Developer Agent:</strong>
                            <div className="prompt-box">
                              {boltPrompt.bolt_prompt}
                            </div>
                          </div>
                        </div>
                        
                        <div className="bolt-iframe-container">
                          <iframe
                            src={`http://localhost:5173/?prompt=${encodeURIComponent(boltPrompt.bolt_prompt)}`}
                            title="Developer Agent - Bolt.diy"
                            className="bolt-iframe"
                            allow="clipboard-read; clipboard-write; cross-origin-isolated; shared-array-buffer"
                            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
                          />
                        </div>
                      </div>
                    </div>
                  )}
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