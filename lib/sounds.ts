// lib/sounds.ts

export const playSuccessSound = () => {
  const audio = new Audio('/sounds/success.mp3');
  audio.volume = 0.5;
  audio.play().catch((e) => console.log("Audio play failed", e));
};

export const playWrong = () => {
  const audio = new Audio('/sounds/wrong.mp3'); // تأكد إن ملف الصوت ده موجود
  audio.volume = 0.5;
  audio.play().catch((e) => console.log("Audio play failed", e));
};

// هذا السطر مهم عشان لو في ملفات تانية بتنادي عليها بالاسم القديم
export const playWrongSound = playWrong;