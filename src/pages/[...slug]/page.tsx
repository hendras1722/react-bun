import { useParams } from "react-router-dom";

export default function CatchAllPage() {
  const params = useParams();
  const slug = params["*"]; // Catch-all value is stored in "*"
  
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Catch-all Page</h1>
      <p>Path yang kamu akses: <strong>{slug}</strong></p>
    </div>
  );
}
