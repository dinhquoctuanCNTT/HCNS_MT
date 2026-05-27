/**
 * Định dạng tiền tệ VNĐ (ví dụ: 15,000,000 ₫)
 * @param amount Số tiền cần định dạng
 */
export const formatVND = (amount: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

/**
 * Tạo số chứng từ tự động chuyên nghiệp theo chuẩn kế toán (ví dụ: HDBH-2605-001)
 * @param prefix Tiền tố loại chứng từ (HDBH, HDMH, PC, PT...)
 * @param sequence Số thứ tự chứng từ
 * @param date Ngày tạo chứng từ (mặc định hiện tại)
 */
export const formatDocNumber = (
  prefix: string,
  sequence: number,
  date: Date = new Date()
): string => {
  const year = date.getFullYear().toString().slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const seq = String(sequence).padStart(4, "0");
  return `${prefix}-${year}${month}-${seq}`;
};

/**
 * Định dạng ngày tháng hiển thị dạng DD/MM/YYYY
 * @param date Dữ liệu ngày cần định dạng
 */
export const formatDisplayDate = (date: Date | string): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "";
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * Định dạng tỷ lệ phần trăm (ví dụ: 10%)
 * @param value Giá trị phần trăm dạng số (ví dụ: 0.1 đại diện cho 10%)
 */
export const formatPercent = (value: number): string => {
  return `${(value * 100).toFixed(0)}%`;
};
