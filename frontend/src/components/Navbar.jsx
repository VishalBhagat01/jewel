export default function Navbar() {
  return (
    <header className="navbar">
      <div>
        <span className="eyebrow">MOHIT ATELIER</span>
        <h1>Good morning, Admin</h1>
      </div>
      <button
        onClick={() => {
          localStorage.clear();
          location.href = "/login";
        }}
      >
        Sign out
      </button>
    </header>
  );
}
