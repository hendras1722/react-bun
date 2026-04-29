export default function About() {
  return (
    <div className="about-page">
      <h1>About This Project</h1>
      <p>
        This is a simple React application running on Bun, demonstrating routing capabilities.
      </p>
      <div className="card">
        <h3>Tech Stack</h3>
        <ul>
          <li>Bun (Runtime & Bundler)</li>
          <li>React 19</li>
          <li>React Router 7</li>
          <li>TypeScript</li>
        </ul>
      </div>
    </div>
  );
}
