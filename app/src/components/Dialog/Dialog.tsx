import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

type DialogProps = {
  isOpen: boolean;
  result: string;            // 勝ち負け引き分けのメッセージ
  onClose: () => void;
  closeMessage?: string;     // 閉じる際の補足メッセージ（任意）
};

export const ResultDialog: React.FC<DialogProps> = ({
  isOpen,
  result,
  onClose,
  closeMessage = '画面を閉じて退出してください', // デフォルト値
}) => {
  return (
    <Dialog
      open={isOpen}
      onClose={(event, reason) => {
        if (reason === "backdropClick" || reason === "escapeKeyDown") return;
        onClose();
      }}
      disableEscapeKeyDown
      PaperProps={{
        sx: {
          padding: 4,
          borderRadius: '24px',
          textAlign: 'center',
          width: '60vw',
          height: '35vh',
        },
      }}
    >
      <DialogTitle
        sx={{
          fontSize: '4rem',
          fontWeight: 'bold',
          textAlign: 'center',
          marginTop: 5,
        }}
      >
        <Typography variant="h2" component="div" align="center" color="textSecondary">
            {result}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography variant="h6">
          {closeMessage}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', paddingBottom: 3 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            fontSize: '1.2rem',
            paddingX: 20,
            paddingY: 1,
            borderRadius: '12px',
            textTransform: 'none',
            border: "2px solid black",
            color: "black",
          }}
        >
          閉じる
        </Button>
      </DialogActions>
    </Dialog>
  );
};export default ResultDialog;
