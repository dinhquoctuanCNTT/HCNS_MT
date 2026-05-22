type Props = { title: string };

export default function KeToanPage({ title }: Props) {
  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{title}</h2>
      <p style={{ color: "#6b7280", fontSize: 14 }}>Tính năng đang được phát triển.</p>
    </div>
  );
}
