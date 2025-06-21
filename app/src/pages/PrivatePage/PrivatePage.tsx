import React, { type ComponentType, useEffect } from "react";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useNavigate } from "react-router-dom";

export type privatePageProps = {
  Component: ComponentType<any>;
};

const PrivatePage: React.FC<privatePageProps> = ({ Component }) => {
  const player = useAppSelector((state) => state.player);
  const navigate = useNavigate();

  // 未ログインならトップページにリダイレクト
  useEffect(() => {
    if (!player) {
      navigate("/");
    }
  }, [player]);

  // プレイヤー情報がない間は何も表示しない（リダイレクトの間）
  if (!player) return null;

  return <Component />;
};

export default PrivatePage;
