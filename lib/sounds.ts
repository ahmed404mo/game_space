// lib/sounds.ts

export const playSuccessSound = () => {
  const audio = new Audio('/sounds/success.mp3');
  audio.volume = 0.5;
  audio.play().catch((e) => console.log("Audio play failed", e));
};

export const playWrong = () => {
  const audio = new Audio('/sounds/wrong.mp3');
  audio.volume = 0.5;
  audio.play().catch((e) => console.log("Audio play failed", e));
};

// عشان لو حد نادى عليها بالاسم ده
export const playWrongSound = playWrong;

// الدوال الجديدة الناقصة
export const playButtonClick = () => {
  const audio = new Audio('/sounds/click.mp3');
  audio.volume = 0.5;
  audio.play().catch((e) => console.log("Audio play failed", e));
};

export const playRocketSound = () => {
  const audio = new Audio('/sounds/rocket.mp3');
  audio.volume = 0.5;
  audio.play().catch((e) => console.log("Audio play failed", e));
};