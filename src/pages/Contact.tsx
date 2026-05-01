export const getServerSide = async () => {
  return {
    message: "This data came from the server!",
    timestamp: "2024-01-01T00:00:00.000Z" // Use a constant for now to avoid hydration mismatch
  };
};

export default function Contact({ globalData, serverData }: any) {
  return (
    <div style={{ background: '#000', color: '#fff', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <h1>Contact</h1>
      <p>Global Data: {JSON.stringify(globalData)}</p>
      <p>Server Data: {JSON.stringify(serverData)}</p>
      <p>Halaman ini tidak menggunakan layout sama sekali.</p>
      <a href="/" style={{ color: 'cyan', marginTop: '1rem' }}>Kembali ke Beranda</a>
    </div>
  );
}
