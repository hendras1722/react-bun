export const getServerSide = async () => {
  return {
    message: "This data came from the server!",
    timestamp: new Date().toISOString()
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
