import React, { useEffect, useState } from 'react'
import './birthdayWish.css'
import gift_cover from '../icons/others/gift_cover2.png'
import gift_container from '../icons/others/gift_container2.png'
import cake from '../icons/others/cake_image.png'
import { XmarkCircle } from 'iconoir-react'


export default function BirthdayWish(props) {
  const [wish, setWish] = useState("");
  const [typer_end, setTyperEnd] = useState(false);
  const [gift_opened, setGiftOpened] = useState(false);
  const [running_interval, setRunningInterval] = useState(false);

  const typeWish = () => {
    const wish = `Wishing you a day filled with happiness, success, and everything you enjoy most.
            Thank you for being a part of this journey with me. Your support truly means a lot, and I’m excited about what the future holds—for both of us.
            Have an amazing birthday and a fantastic year ahead!
            Warm wishes,\n`
    let i = 0;
    let interv = setInterval(() => {
      setWish(wish.slice(0, i + 1) + (i % 4 === 0 ? "|" : ""));
      i++;
      if (i === wish.length) {
        clearInterval(interv);
        setTyperEnd(true);
        return;
      }
    }, 50);
    setRunningInterval(interv);
  }

  const openGift = () => {
    setGiftOpened(true);
  }

  const getRandomGift = () => {
    const bday_emojies = [
      "🎉", "🥳", "🎊", "🎈", "✨", "🌟", "🎂", "🍰", "🎁",
      "🍬", "🍭", "🍫", "🕯️", "🪔", "🔥", "👑", "💫", "💖", "😄",
      "🥰", "🤗", "👏", "🤩", "🙌", "💎", "🍉", "🎩", "👒", "⚽",
      "🥎", "🏀", "💍", "🏆"
    ];
    let emoji_idx = Math.floor(Math.random() * (bday_emojies.length - 1));
    return bday_emojies[emoji_idx];
  }

  useEffect(() => {
    typeWish();
  }, []);

  const on_close = ()=>{
    clearInterval(running_interval);
    props.on_close_();
  }

  let { device_width, name } = props;
  return (
    <div className='bday_wish_main_body'>
      <div className='bday_content' style={{ width: device_width < 450 ? "100%" : "80%", height: device_width < 450 ? "100%" : "80%", flexDirection: device_width < 800 ? "column" : "row" }}>
        <XmarkCircle width={35} height={35} className='close_btn' onClick={on_close} />
        {device_width < 800 ?
          <img src={cake} alt="cake" className='cake' draggable="false" style={{ marginLeft: "" }} />
          : null}
        <div className='interactable'>
          <p className='wish'>
            <span style={{ fontSize: "1.7rem", color: "cyan" }}>🎉 Happy Birthday, {name}! 🎉</span><br />
            {wish}
            {typer_end ?
              <span style={{ color: "lime" }}>━ By : Team Scihack</span>
              : null}
          </p>

          {typer_end ?
            <div className='gift_box' onClick={gift_opened ? () => { } : openGift}>
              <img src={gift_cover} alt="gift cover" className='gift-cover' style={gift_opened ? { animation: "gift_open 2s forwards" } : {}} />
              <span className='gift_item' style={gift_opened ? { animation: "show_gift_item 2s forwards" } : {}}>{getRandomGift()}</span>
              <img src={gift_container} alt="gift container" className='gift-container' />
            </div>
            : null}
        </div>

        {device_width > 800 ?
          <img src={cake} alt="cake" className='cake' draggable="false" style={{ marginLeft: "auto" }} />
          : null}
      </div>


    </div>
  )
}
