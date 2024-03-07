import {useEffect, useState} from "react";
import {Text} from "../entity/Text.ts";

export function TextForm({onTextChange}: {onTextChange: (text: Text) => void}) {
  const [text, setText] = useState("");
  const [color, setColor] = useState("#FFFFFF");
  const [font, setFont] = useState("Arial");
  const [fontSize, setFontSize] = useState(64);

  useEffect(() => {
    if (text === "") return;

    let textObject = new Text(text, font, color, fontSize);

    onTextChange(textObject);
  }, [text, color, font, fontSize]);

  return (
    <>
      <div>
        <label htmlFor="text" className="label">
          <span className="label-text">Votre message</span>
        </label>
        <textarea
          id="text"
          className="textarea textarea-bordered h-12 w-full"
          placeholder="Votre message"
          onChange={e => setText(e.target.value)}
        ></textarea>
      </div>

      <div>
        <label htmlFor="color" className="label">
          <span className="label-text">Couleur</span>
        </label>
        <input
          id="color"
          type="color"
          placeholder="Couleur de texte"
          className="input input-bordered w-full max-w-xs"
          onChange={e => {
            setColor(e.target.value);
          }}
        />
      </div>

      <div>
        <label htmlFor="font" className="label">
          <span className="label-text">Police d'écriture</span>
        </label>
        <input
          id="font"
          type="text"
          placeholder="Police d'écriture"
          className="input input-bordered w-full max-w-xs"
          onBlur={e => setFont(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="fontSize" className="label">
          <span className="label-text">Taille</span>
        </label>
        <input
          id="fontSize"
          type="number"
          placeholder="Taille de la police"
          className="input input-bordered w-full max-w-xs"
          onChange={e => setFontSize(Number(e.target.value))}
        />
      </div>
    </>
  );
}
