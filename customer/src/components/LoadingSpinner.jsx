import './LoadingSpinner.css';

export default function LoadingSpinner({ message = "Loading...", fullPage = false }) {
  const className = fullPage ? "loading-spinner-fullpage" : "loading-spinner-inline";
  
  return (
    <div className={className}>
      <div className="spinner-container">
        <div className="spinner"></div>
        <p className="spinner-message">{message}</p>
      </div>
    </div>
  );
}
