import { useState } from "react";

// const API_BASE = "http://127.0.0.1:8000";
const API_BASE = "https://nexory.onrender.com";

function NexoryLogo() {
  return (
    <div style={styles.logoWrap}>
      <svg width="42" height="42" viewBox="0 0 100 100" fill="none">
        <path
          d="M15 72 C25 55, 25 25, 42 36 C58 48, 42 72, 35 50 C28 30, 55 10, 72 28 C90 48, 62 72, 56 48 C52 33, 77 40, 88 42"
          stroke="url(#grad)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <defs>
          <linearGradient id="grad" x1="10" y1="80" x2="90" y2="20">
            <stop stopColor="#4F46E5" />
            <stop offset="0.55" stopColor="#7C3AED" />
            <stop offset="1" stopColor="#22D3EE" />
          </linearGradient>
        </defs>
      </svg>

      <div>
        <h2 style={styles.logoText}>NEXORY</h2>
        <p style={styles.logoTag}>Remember. Retrieve. Reclaim.</p>
      </div>
    </div>
  );
}

const isMobile = window.innerWidth < 768;
function App() {
  const [file, setFile] = useState(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [screen, setScreen] = useState("home");

  const uploadFile = async () => {
    if (!file) {
      alert("Please select an image first");
      return;
    }

    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${API_BASE}/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Upload failed");
      }

      setMessage("Memory saved successfully ✨");
    } catch (error) {
      setMessage("Upload failed. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const searchMemories = async () => {
    if (!query.trim()) {
      alert("Type something you want to remember");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/search?q=${query}`);
      const data = await response.json();

      setResults(data);
      setScreen("results");
    } catch (error) {
      console.error(error);
      alert("Search failed. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.glowOne}></div>
      <div style={styles.glowTwo}></div>

      <nav style={styles.nav}>
        <NexoryLogo />

        {!isMobile && (
          <div style={styles.navLinks}>
          <span>Home</span>
          <span>Memories</span>
          <span>About</span>
        </div>
        )}
      </nav>

      {screen === "home" && (
        <main style={styles.heroScreen}>
          <div style={styles.badge}>AI MEMORY RETRIEVAL</div>

          <h1 style={styles.heroTitle}>
            What are you trying to{" "}
            <span style={styles.gradientText}>remember?</span>
          </h1>

          <p style={styles.heroSubtitle}>
            Nexory helps you save, understand, and retrieve your important
            screenshots and digital memories.
          </p>

          <div style={styles.searchBar}>
            <span style={styles.searchIcon}>⌕</span>
            <input
              style={styles.searchInput}
              type="text"
              placeholder="Search your memories..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && searchMemories()}
            />
            <button style={styles.arrowButton} onClick={searchMemories}>
              →
            </button>
          </div>

          <div style={styles.actionGrid}>
            <div style={styles.actionCard}>
              <div style={styles.iconBox}>☁</div>
              <h3>Upload Memory</h3>
              <p>Save screenshots and let Nexory read it.</p>

              <input
                style={styles.fileInput}
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
              />

              <button style={styles.uploadBtn} onClick={uploadFile}>
                {loading ? "Processing..." : "Upload"}
              </button>

              {message && <p style={styles.success}>{message}</p>}
            </div>

            <div style={styles.actionCard}>
              <div style={styles.iconBox}>⌕</div>
              <h3>Search Memory</h3>
              <p>Find anything from your saved memories.</p>

              <button style={styles.secondaryBtn} onClick={searchMemories}>
                {loading ? "Searching..." : "Search Now"}
              </button>
            </div>
          </div>

          <p style={styles.footerText}>Nexory remembers for you.</p>
        </main>
      )}

      {screen === "results" && (
        <main style={styles.resultsScreen}>
          <button style={styles.backBtn} onClick={() => setScreen("home")}>
            ← Back
          </button>

          <div style={styles.resultsTop}>
            <div style={styles.resultSearchBar}>
              <span style={styles.searchIcon}>⌕</span>
              <input
                style={styles.searchInput}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search again..."
              />
              <button style={styles.filterBtn} onClick={searchMemories}>
                Search
              </button>
            </div>
          </div>

          <p style={styles.foundText}>{results.length} memories found</p>

          <div style={styles.resultsList}>
            {results.length === 0 ? (
              <div style={styles.emptyBox}>
                <h2>No memory found</h2>
                <p>Try another word from your uploaded screenshot.</p>
              </div>
            ) : (
              results.map((item) => (
                <div key={item.id} style={styles.memoryCard}>
                  <img
                    src={`${API_BASE}${item.image_url}`}
                    alt="Saved memory"
                    style={styles.memoryImage}
                  />

                  <div style={styles.memoryContent}>
                    <h3>Retrieved Memory</h3>
                    <p style={styles.label}>Extracted text</p>
                    <p style={styles.memoryText}>{item.extracted_text}</p>
                  </div>

                  <span style={styles.dots}>⋮</span>
                </div>
              ))
            )}
          </div>
        </main>
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    width: "100%",
    background:
      "radial-gradient(circle at top left, rgba(124,58,237,0.35), transparent 30%), linear-gradient(135deg, #0F172A 0%, #111827 45%, #1E1B4B 100%)",
    color: "#E2E8F0",
    fontFamily: "'Poppins', Arial, sans-serif",
    position: "relative",
    overflow: "hidden",
    padding: "26px 5vw",
  },

  glowOne: {
    position: "absolute",
    width: "420px",
    height: "420px",
    background: "rgba(79,70,229,0.25)",
    filter: "blur(120px)",
    top: "-80px",
    left: "-80px",
  },

  glowTwo: {
    position: "absolute",
    width: "450px",
    height: "450px",
    background: "rgba(34,211,238,0.14)",
    filter: "blur(140px)",
    bottom: "-120px",
    right: "-80px",
  },

  nav: {
    maxWidth: "1100px",
    margin: "0 auto",
    height: "70px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "relative",
    zIndex: 2,
    flexwrap: "wrap",
    gap: "20px",
  },

  logoWrap: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
  },

  logoText: {
    margin: 0,
    color: "#FFFFFF",
    letterSpacing: "8px",
    fontSize: "18px",
  },

  logoTag: {
    margin: 0,
    color: "#8B5CF6",
    fontSize: "8px",
    letterSpacing: "2px",
    textTransform: "uppercase",
  },

  navLinks: {
    display: "flex",
    gap: "34px",
    fontSize: "14px",
    color: "#CBD5E1",
  },

  heroScreen: {
    maxWidth: "900px",
    margin: isMobile ? "60px auto 0" : "95px auto 0",
    textAlign: "center",
    position: "relative",
    zIndex: 2,
  },

  badge: {
    display: "inline-block",
    padding: "9px 18px",
    borderRadius: "999px",
    background: "rgba(124,58,237,0.18)",
    color: "#A78BFA",
    fontSize: "12px",
    letterSpacing: "1px",
    marginBottom: "26px",
  },

  heroTitle: {
    fontSize: "clamp(2.5rem, 8vw, 58px)",
    lineHeight: "1.05",
    margin: "0 auto",
    maxWidth: "760px",
    color: "#F8FAFC",
  },

  gradientText: {
    background: "linear-gradient(90deg, #8B5CF6, #22D3EE)",
    WebkitBackgroundClip: "text",
    color: "transparent",
  },

  heroSubtitle: {
    fontSize: "17px",
    lineHeight: "1.7",
    color: "#CBD5E1",
    maxWidth: "560px",
    margin: "22px auto 34px",
  },

  searchBar: {
    maxWidth: "680px",
    minHeight: "64px",
    width: "100%",
    margin: "0 auto",
    borderRadius: "999px",
    border: "1px solid rgba(139,92,246,0.7)",
    background: "rgba(15,23,42,0.75)",
    display: "flex",
    alignItems: "center",
    padding: "0 10px 0 24px",
    boxShadow: "0 0 40px rgba(124,58,237,0.45)",
  },

  searchIcon: {
    fontSize: "28px",
    color: "#94A3B8",
    marginRight: "12px",
  },

  searchInput: {
    flex: 1,
    height: "100%",
    background: "transparent",
    border: "none",
    outline: "none",
    color: "#F8FAFC",
    fontSize: "15px",
  },

  arrowButton: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    border: "none",
    background: "linear-gradient(135deg, #7C3AED, #22D3EE)",
    color: "white",
    fontSize: "28px",
    cursor: "pointer",
  },

  actionGrid: {
    margin: "55px auto 0",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "24px",
    maxWidth: "680px",
  },

  actionCard: {
    background: "rgba(15,23,42,0.8)",
    border: "1px solid rgba(148,163,184,0.18)",
    borderRadius: "24px",
    padding: "25px",
    textAlign: "left",
    boxShadow: "0 20px 70px rgba(0,0,0,0.35)",
  },

  iconBox: {
    width: "46px",
    height: "46px",
    borderRadius: "14px",
    background: "rgba(79,70,229,0.16)",
    color: "#60A5FA",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "26px",
    marginBottom: "14px",
  },

  fileInput: {
    marginTop: "14px",
    color: "#CBD5E1",
  },

  uploadBtn: {
    marginTop: "14px",
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: "14px",
    background: "#4F46E5",
    color: "white",
    cursor: "pointer",
    fontWeight: "700",
  },

  secondaryBtn: {
    marginTop: "24px",
    width: "100%",
    padding: "12px",
    border: "1px solid rgba(139,92,246,0.6)",
    borderRadius: "14px",
    background: "transparent",
    color: "#A78BFA",
    cursor: "pointer",
    fontWeight: "700",
  },

  success: {
    color: "#22D3EE",
    marginTop: "12px",
    fontSize: "13px",
  },

  footerText: {
    marginTop: "45px",
    color: "#A78BFA",
  },

  resultsScreen: {
    maxWidth: "900px",
    margin: "60px auto",
    position: "relative",
    zIndex: 2,
  },

  backBtn: {
    background: "transparent",
    color: "#CBD5E1",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    marginBottom: "20px",
  },

  resultSearchBar: {
    height: "58px",
    borderRadius: "16px",
    background: "rgba(15,23,42,0.85)",
    border: "1px solid rgba(148,163,184,0.18)",
    display: "flex",
    alignItems: "center",
    padding: "0 12px 0 18px",
  },

  filterBtn: {
    padding: "11px 18px",
    borderRadius: "12px",
    border: "none",
    background: "#4F46E5",
    color: "white",
    cursor: "pointer",
    fontWeight: "700",
  },

  foundText: {
    marginTop: "24px",
    color: "#CBD5E1",
  },

  resultsList: {
    marginTop: "18px",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },

  memoryCard: {
    display: "flex",
    gap: "18px",
    alignItems: "flex-start",
    background: "rgba(15,23,42,0.86)",
    border: "1px solid rgba(148,163,184,0.15)",
    borderRadius: "22px",
    padding: "18px",
    position: "relative",
    flexwrap: "wrap",
  },

  memoryImage: {
    width: "100%",
    maxWidth: "220px",
    height: "auto",
    objectFit: "cover",
    borderRadius: "15px",
  },

  memoryContent: {
    flex: 1,
  },

  label: {
    color: "#64748B",
    fontSize: "13px",
  },

  memoryText: {
    color: "#CBD5E1",
    lineHeight: "1.6",
    maxHeight: "100px",
    overflow: "hidden",
    whiteSpace: "pre-wrap",
  },

  dots: {
    color: "#94A3B8",
    fontSize: "24px",
  },

  emptyBox: {
    padding: "40px",
    borderRadius: "20px",
    background: "rgba(15,23,42,0.75)",
    border: "1px solid rgba(148,163,184,0.18)",
    textAlign: "center",
  },
};

export default App;