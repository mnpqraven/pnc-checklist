import {
  Provider,
  Root,
  Title,
  Description,
  Action,
  Viewport,
  Close,
} from "@radix-ui/react-toast";
import { ReactNode } from "react";
import { Cross2Icon } from "@radix-ui/react-icons";

type Props = {
  open: boolean;
  setOpen: (e: boolean) => void;
  optionalAction?: ReactNode;
  header: string;
  content: string;
};
const Toast = ({ content, header, open, setOpen, optionalAction }: Props) => {
  return (
    <Provider>
      <Root className="ToastRoot" open={open} onOpenChange={setOpen}>
        <Title className="ToastTitle">{header}</Title>
        <Description asChild>
          <span className="ToastDescription">{content}</span>
        </Description>
        <Action className="ToastAction" asChild altText="Action">
          {optionalAction}
        </Action>
        <Close>
          <Cross2Icon />
        </Close>
      </Root>
      <Viewport className="ToastViewport" />
    </Provider>
  );
};
export default Toast;
