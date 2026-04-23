import fs from "fs";
const img = fs.readFileSync("test.jpg");
const base64 = "data:image/jpeg;base64," + img.toString("base64");
console.log(base64.substring(0, 100)); // in 100 ký tự đầu
fs.writeFileSync("test_base64.txt", base64); // lưu ra file
