export default function GraceHouseAdminIcon() {
  return (
    <div
      style={{
        alignItems: "center",
        display: "flex",
        gap: "0.65rem",
        minWidth: 0,
        padding: "0.5rem 0",
      }}
    >
      <img
        src="/images/crown.png"
        alt="Grace House"
        style={{ display: "block", flex: "0 0 auto", height: "45px", objectFit: "contain", width: "auto" }}
      />
      <span
        style={{
          color: "var(--theme-text)",
          fontSize: "0.78rem",
          fontWeight: 600,
          lineHeight: 1.25,
          maxWidth: "150px",
        }}
      >
        Grace House Administration Panel
      </span>
    </div>
  );
}
