import { NextResponse } from "next/server";

// Biến toàn cục lưu số lượng request (sẽ reset khi server khởi động lại)
let requestCount = 0;

// Lấy ngẫu nhiên một ngưỡng crash từ 50 đến 100
let crashThreshold = Math.floor(Math.random() * (100 - 50 + 1)) + 50;

export async function GET() {
  requestCount++;

  // Nếu số request vượt quá ngưỡng, đánh sập server
  if (requestCount >= crashThreshold) {
    console.error(`[CRASH] Server quá tải! Đã nhận ${requestCount} requests (Ngưỡng: ${crashThreshold}). Đang sập...`);
    
    // Thoát tiến trình ngay lập tức với mã lỗi 1. PM2 sẽ bắt được lỗi này.
    process.exit(1);
  }

  // Nếu chưa đạt ngưỡng, trả về OK bình thường
  return NextResponse.json({ 
    status: "ok", 
    timestamp: Date.now(),
    current_requests: requestCount,
    threshold: crashThreshold
  });
}
