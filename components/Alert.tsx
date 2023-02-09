import React from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import {
  ALERT_BUTTON_CANCEL,
  ALERT_BUTTON_CONTENT,
  ALERT_BUTTON_HEADER,
  ALERT_BUTTON_OK,
} from "@/utils/lang";

type Props = {
  open: boolean;
  onCancel: () => void;
  onAction: () => void;
  content: {
    header: string;
    content: string;
    cancel: string;
    ok: string;
  };
};
const Alert = ({ open, onCancel, onAction, content }: Props) => {
  return (
    <AlertDialog.Root open={open}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="AlertDialogOverlay" />
        <AlertDialog.Content className="AlertDialogContent">
          <AlertDialog.Title className="AlertDialogTitle">
            {content.header}
          </AlertDialog.Title>
          <AlertDialog.Description className="AlertDialogDescription">{content.content}</AlertDialog.Description>
          <div
            style={{
              display: "flex",
              gap: 25,
              justifyContent: "flex-end",
            }}
          >
            <AlertDialog.Cancel asChild onClick={onCancel}>
              <button className="Button mauve">{content.cancel}</button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild onClick={onAction}>
              <button className="Button red">{content.ok}</button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};
export default Alert;
