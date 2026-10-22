export default function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert" style={{ textAlign: "center", marginTop: 80 }}>
      <h2>Something went wrong 😕</h2>
      <pre style={{ color: "red" }}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}