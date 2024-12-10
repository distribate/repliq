"use client"

import Image from "next/image"

export const Preloader = () => {
  const gifs_arr = [
    "https://cdn.discordapp.com/attachments/904344676587417621/1199803880951775242/minecraft-fox-jump.webp?ex=65c3df70&is=65b16a70&hm=6e502ed4fbb365d0304d0d5dab3d1eb3b25af7b74f5ca6665efbfaa843aa891c&", 
    "https://cdn.discordapp.com/attachments/904344676587417621/1199803903286452296/moose-moosecraft.webp?ex=65c3df75&is=65b16a75&hm=76669b4d15af3f9ad78443cb62999a9c4081e42bbe1015a24b5fc0e3d38b1260&", 
    "https://cdn.discordapp.com/attachments/904344676587417621/1199803904217583626/zombieonchicken.webp?ex=65c3df76&is=65b16a76&hm=dc6fc724a4a9f21c2278ae6ef0f2e843a86209673a66abb1ef4b0943a8b417f6&", 
    "https://cdn.discordapp.com/attachments/904344676587417621/1199803881941631016/minecraft-silverfish.webp?ex=65c3df70&is=65b16a70&hm=090642baffc1f09dfef2412d1fe1dfa8dbdc3da8b0512a0774c1300a8ebbe795&", 
    "https://cdn.discordapp.com/attachments/904344676587417621/1199803877436956702/buildtheearth-minecraft.webp?ex=65c3df6f&is=65b16a6f&hm=260934a308712f82f6c24639ce76bfa1ce3df187731abe65e80bef098155ed4d&", 
    "https://cdn.discordapp.com/attachments/904344676587417621/1199803903798169681/warden.gif?ex=65c3df75&is=65b16a75&hm=be5b2e61ea53e537d02993cdd81947a3f6c2771196a4d148b274c93d39cbce21&", 
    "https://cdn.discordapp.com/attachments/904344676587417621/1199803879303422042/ghast.gif?ex=65c3df70&is=65b16a70&hm=906383802dbcfe3a8f4f76cd35d9ea9dbef6dee03ee549ce1836cc11a21d3c97&", 
  ];

  const randomGif = (array: string[]) => {
    if (array.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * array.length);
    
    return array[randomIndex];
  }

  const gifs = randomGif(gifs_arr);

  return (
    <div className="flex min-h-screen bg-[#0e0e12] justify-center items-center">
      <Image
        width={256}
        height={256}
        src={`${gifs}`}
        draggable="false"
        alt="Подождите... идёт загрузка."
      />
    </div>
  );
};