import React, { useState, useRef } from 'react';
import './FileUploadAI.css';

const FileUploadAI = ({ onAnalysisComplete, language = 'en' }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const translations = {
    en: {
      title: "📁 Smart File Analysis",
      subtitle: "Upload images or documents for AI analysis",
      dragText: "Drag & drop files here, or click to select",
      supportedFormats: "Supported: JPG, PNG, PDF, TXT, DOC",
      maxSize: "Max size: 10MB",
      analyzeButton: "Analyze with AI",
      analyzing: "Analyzing...",
      uploadSuccess: "File uploaded successfully",
      uploadError: "Upload failed",
      analysisComplete: "Analysis complete"
    },
    ar: {
      title: "📁 تحليل الملفات الذكي",
      subtitle: "ارفع الصور أو المستندات للتحليل بالذكاء الاصطناعي",
      dragText: "اسحب الملفات هنا، أو انقر للاختيار",
      supportedFormats: "المدعومة: JPG, PNG, PDF, TXT, DOC",
      maxSize: "الحد الأقصى: 10 ميجابايت",
      analyzeButton: "تحليل بالذكاء الاصطناعي",
      analyzing: "جاري التحليل...",
      uploadSuccess: "تم رفع الملف بنجاح",
      uploadError: "فشل في رفع الملف",
      analysisComplete: "اكتمل التحليل"
    }
  };

  const t = translations[language] || translations.en;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file) => {
    setError(null);
    setUploadedFile(file);
    setAnalysisResult(null);
    
    // Validate file size
    if (file.size > 10 * 1024 * 1024) {
      setError(t.maxSize + " exceeded");
      return;
    }
    
    // Validate file type
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf', 'text/plain', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      setError("Unsupported file type");
      return;
    }
  };

  const analyzeFile = async () => {
    if (!uploadedFile) return;
    
    setUploading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('file', uploadedFile);
      
      const response = await fetch('http://localhost:8000/api/ai/analyze-file/', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (data.success) {
        setAnalysisResult(data.analysis);
        if (onAnalysisComplete) {
          onAnalysisComplete(data.analysis);
        }
      } else {
        setError(data.message || 'Analysis failed');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const resetUpload = () => {
    setUploadedFile(null);
    setAnalysisResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return '🖼️';
    if (fileType === 'application/pdf') return '📄';
    if (fileType.includes('word')) return '📝';
    if (fileType === 'text/plain') return '📃';
    return '📁';
  };

  return (
    <div className="file-upload-ai">
      <div className="upload-header">
        <h3>{t.title}</h3>
        <p>{t.subtitle}</p>
      </div>

      {!uploadedFile ? (
        <div
          className={`upload-area ${dragActive ? 'drag-active' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="upload-content">
            <div className="upload-icon">📁</div>
            <p className="upload-text">{t.dragText}</p>
            <p className="upload-formats">{t.supportedFormats}</p>
            <p className="upload-size">{t.maxSize}</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileInput}
            accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,.txt,.doc,.docx"
            style={{ display: 'none' }}
          />
        </div>
      ) : (
        <div className="file-preview">
          <div className="file-info">
            <span className="file-icon">{getFileIcon(uploadedFile.type)}</span>
            <div className="file-details">
              <p className="file-name">{uploadedFile.name}</p>
              <p className="file-size">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <button onClick={resetUpload} className="remove-file">×</button>
          </div>
          
          <button
            onClick={analyzeFile}
            disabled={uploading}
            className="analyze-button"
          >
            {uploading ? t.analyzing : t.analyzeButton}
          </button>
        </div>
      )}

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      {analysisResult && (
        <div className="analysis-result">
          <h4>{t.analysisComplete}</h4>
          <div className="result-grid">
            <div className="result-item">
              <label>Product Type:</label>
              <span>{analysisResult.product_type || 'Not detected'}</span>
            </div>
            <div className="result-item">
              <label>Quantity:</label>
              <span>{analysisResult.quantity || 1}</span>
            </div>
            <div className="result-item">
              <label>Urgency:</label>
              <span className={`urgency-badge ${analysisResult.urgency}`}>
                {analysisResult.urgency || 'medium'}
              </span>
            </div>
            <div className="result-item">
              <label>Sentiment:</label>
              <span className={`sentiment-badge ${analysisResult.sentiment}`}>
                {analysisResult.sentiment || 'neutral'}
              </span>
            </div>
            <div className="result-item">
              <label>Confidence:</label>
              <span>{Math.round((analysisResult.confidence || 0) * 100)}%</span>
            </div>
            {analysisResult.image_analysis && (
              <div className="result-item full-width">
                <label>Image Analysis:</label>
                <span>{analysisResult.image_analysis}</span>
              </div>
            )}
            {analysisResult.extracted_text && (
              <div className="result-item full-width">
                <label>Extracted Text:</label>
                <span>{analysisResult.extracted_text}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploadAI;



