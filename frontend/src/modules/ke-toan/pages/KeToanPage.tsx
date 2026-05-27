type Props = { title: string };

export default function KeToanPage({ title }: Props) {
  return (
    <div
      style={{
        padding: 48,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 320,
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: "#f1f5f9",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 28,
          marginBottom: 20,
        }}
      >
        🚧
      </div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1e293b", margin: "0 0 8px" }}>
        {title}
      </h2>
      <p style={{ color: "#94a3b8", fontSize: 14, margin: 0 }}>
        Trang này chưa được phát triển
      </p>
    </div>
  );
}
