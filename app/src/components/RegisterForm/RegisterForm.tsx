import { useState } from "react";

type Props = {
  onRegister: (userID: string, name: string) => void;
};

const RegisterForm = ({ onRegister }: Props) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const register = async () => {
    if (!name) return;
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        throw new Error("登録失敗");
      }

      const data = await res.json();
      onRegister(data.userID, data.name);
    } catch (e) {
      alert("登録に失敗しました" + e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>プレイヤー登録</h2>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="名前を入力"
        disabled={loading}
      />
      <button onClick={register} disabled={loading || !name}>
        登録
      </button>
    </div>
  );
};

export default RegisterForm;
