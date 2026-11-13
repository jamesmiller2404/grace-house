export default function GraceHouseAdminLogo() {
  return (
    <div
      style={{
        alignItems: "center",
        display: "flex",
        flexWrap: "wrap",
        gap: "1rem",
        justifyContent: "center",
        margin: "0 auto",
        maxWidth: "100%",
      }}
    >
      <img
        src="/images/crown.png"
        alt="Grace House"
        style={{ display: "block", height: "auto", maxHeight: "78px", maxWidth: "217px", objectFit: "contain", width: "auto" }}
      />
      <span
        style={{
          color: "var(--theme-text)",
          fontSize: "clamp(1.1rem, 3vw, 1.5rem)",
          fontWeight: 600,
          lineHeight: 1.2,
          textAlign: "center",
        }}
      >
        Grace House Administration Panel
      </span>
    </div>
  );
}
