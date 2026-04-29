import { useParams } from "react-router-dom";

export default function Page() {
  const { id } = useParams();

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Dynamic Page</h1>
      <p>ID dari URL adalah: <strong>{id}</strong></p>
    </div>
  );
}