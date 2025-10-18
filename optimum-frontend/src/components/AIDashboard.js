import React, { useState, useEffect } from 'react';
import './AIDashboard.css';
import FileUploadAI from './FileUploadAI';
import LanguageSwitcher from './LanguageSwitcher';
import { getTranslation, getCurrentLanguage } from '../utils/translations';

const AIDashboard = () => {
  const [aiData, setAiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderText, setOrderText] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [language, setLanguage] = useState(getCurrentLanguage());

  useEffect(() => {
    fetchAIDashboardData();
  }, []);

  const fetchAIDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/ai/dashboard-data/');
      if (response.ok) {
        const data = await response.json();
        setAiData(data.dashboard_data);
      } else {
        throw new Error('Failed to fetch AI data');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const analyzeOrderText = async () => {
    if (!orderText.trim()) return;
    
    try {
      setAnalyzing(true);
      const response = await fetch('/api/ai/analyze/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: orderText }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setAnalysisResult(data.analysis);
      } else {
        throw new Error('Failed to analyze order text');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return '#10B981';
      case 'negative': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      default: return '#10B981';
    }
  };

  if (loading) {
    return (
      <div className="ai-dashboard">
        <div className="loading">Loading AI Dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ai-dashboard">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="ai-dashboard">
      <div className="ai-header">
        <div className="header-content">
          <div className="header-text">
            <div className="ai-header-logo">
              <img src="/logo.png" alt="Optimum Smart System Logo" className="ai-logo-image" />
              <div className="ai-header-text">
                <h1>🤖 {getTranslation('aiPoweredInsights', language)}</h1>
                <p>{getTranslation('intelligentAnalysis', language)}</p>
              </div>
            </div>
          </div>
          <LanguageSwitcher onLanguageChange={setLanguage} />
        </div>
      </div>

      {/* File Upload AI */}
      <div className="ai-section">
        <FileUploadAI 
          onAnalysisComplete={setAnalysisResult}
          language={language}
        />
      </div>

      {/* Order Text Analysis */}
      <div className="ai-section">
        <h2>📝 Smart Order Analysis</h2>
        <div className="order-analysis">
          <textarea
            value={orderText}
            onChange={(e) => setOrderText(e.target.value)}
            placeholder="Enter order text to analyze (e.g., 'I need 2 laptops urgently for next week')"
            className="order-text-input"
          />
          <button 
            onClick={analyzeOrderText} 
            disabled={analyzing || !orderText.trim()}
            className="analyze-btn"
          >
            {analyzing ? 'Analyzing...' : 'Analyze with AI'}
          </button>
        </div>

        {analysisResult && (
          <div className="analysis-result">
            <h3>AI Analysis Results</h3>
            <div className="analysis-grid">
              <div className="analysis-card">
                <label>Product Type:</label>
                <span>{analysisResult.product_type || 'Not detected'}</span>
              </div>
              <div className="analysis-card">
                <label>Quantity:</label>
                <span>{analysisResult.quantity || 1}</span>
              </div>
              <div className="analysis-card">
                <label>Urgency:</label>
                <span 
                  className="urgency-badge"
                  style={{ backgroundColor: getUrgencyColor(analysisResult.urgency) }}
                >
                  {analysisResult.urgency || 'medium'}
                </span>
              </div>
              <div className="analysis-card">
                <label>Sentiment:</label>
                <span 
                  className="sentiment-badge"
                  style={{ backgroundColor: getSentimentColor(analysisResult.sentiment) }}
                >
                  {analysisResult.sentiment || 'neutral'}
                </span>
              </div>
              <div className="analysis-card">
                <label>Suggested Supplier:</label>
                <span>{analysisResult.suggested_supplier || 'Tech Solutions Ltd'}</span>
              </div>
              <div className="analysis-card">
                <label>Confidence:</label>
                <span>{Math.round((analysisResult.confidence || 0) * 100)}%</span>
              </div>
            </div>
            {analysisResult.notes && (
              <div className="analysis-notes">
                <strong>AI Notes:</strong> {analysisResult.notes}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Business Insights */}
      {aiData?.business_insights && (
        <div className="ai-section">
          <h2>📊 Business Intelligence</h2>
          <div className="insights-grid">
            <div className="insight-card">
              <h3>Key Insights</h3>
              <ul>
                {aiData.business_insights.insights?.map((insight, index) => (
                  <li key={index}>{insight}</li>
                ))}
              </ul>
            </div>
            <div className="insight-card">
              <h3>Recommendations</h3>
              <ul>
                {aiData.business_insights.recommendations?.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Demand Predictions */}
      {aiData?.demand_predictions && (
        <div className="ai-section">
          <h2>🔮 Demand Predictions</h2>
          <div className="predictions-grid">
            <div className="prediction-card">
              <h3>Top Products</h3>
              {aiData.demand_predictions.top_products?.map(([product, count], index) => (
                <div key={index} className="product-item">
                  <span className="product-name">{product}</span>
                  <span className="product-count">{count} orders</span>
                </div>
              ))}
            </div>
            <div className="prediction-card">
              <h3>Demand Trend</h3>
              <div className="trend-indicator">
                <span className={`trend-badge ${aiData.demand_predictions.predicted_demand}`}>
                  {aiData.demand_predictions.predicted_demand}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sentiment Analysis */}
      {aiData?.sentiment_summary && (
        <div className="ai-section">
          <h2>😊 Customer Sentiment</h2>
          <div className="sentiment-grid">
            {Object.entries(aiData.sentiment_summary).map(([sentiment, count]) => (
              <div key={sentiment} className="sentiment-card">
                <div 
                  className="sentiment-indicator"
                  style={{ backgroundColor: getSentimentColor(sentiment) }}
                ></div>
                <span className="sentiment-label">{sentiment}</span>
                <span className="sentiment-count">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Metrics */}
      {aiData?.ai_metrics && (
        <div className="ai-section">
          <h2>📈 AI Performance</h2>
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-value">{aiData.ai_metrics.total_analyses}</div>
              <div className="metric-label">Total Analyses</div>
            </div>
            <div className="metric-card">
              <div className="metric-value">{aiData.ai_metrics.total_sentiment_analyses}</div>
              <div className="metric-label">Sentiment Analyses</div>
            </div>
            <div className="metric-card">
              <div className="metric-value">{aiData.ai_metrics.total_predictions}</div>
              <div className="metric-label">Demand Predictions</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIDashboard;
