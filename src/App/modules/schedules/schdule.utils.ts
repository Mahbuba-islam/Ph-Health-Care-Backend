export const convertDateTime = async (date : Date) =>{
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() + offset);
}


/*
এখানে তিনটা জিনিস হচ্ছে:
- local timezone offset বের করা
- offset কে milliseconds এ convert করা
- local time + offset = UTC time বানানো
এখন প্রশ্ন:

🎯 কেন convertDateTime এর ভেতরে এই কাজগুলো করা হয়?
কারণ:
👉 JavaScript সবসময় local time ধরে
👉 কিন্তু database (PostgreSQL + Prisma) সবসময় UTC time চায়
👉 তাই তোমাকে local → UTC convert করতে হবে
👉 আর সেটা করার জন্য offset যোগ করতে হয়
এটাই convertDateTime এর কাজ।

🧠 Step‑by‑Step (Super Clear)
1️⃣ date.getTimezoneOffset()
এটা বলে:
“তোমার local timezone UTC থেকে কত মিনিট পিছিয়ে?”

New York (EST) হলে:
300 minutes (5 hours)



2️⃣ × 60000
কারণ JS Date milliseconds এ কাজ করে।
300 × 60000 = 18,000,000 ms


এটাই offset।

3️⃣ date.getTime()
এটা তোমার date এর milliseconds timestamp।
Example:
2025-02-10 09:30 local
→ 1739189400000 ms

*/