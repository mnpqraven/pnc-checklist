import React from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import Button from "./Button";

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
          <AlertDialog.Description className="AlertDialogDescription">
            {content.content}
          </AlertDialog.Description>
          <div
            style={{
              display: "flex",
              gap: 25,
              justifyContent: "flex-end",
            }}
          >
            <AlertDialog.Cancel asChild onClick={onCancel}>
              <Button className="mauve" label={content.cancel} />
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild onClick={onAction}>
              <Button className="red" label={content.ok} />
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};
export default Alert;
