"use client";
import { Button } from "@mui/material";
import { useSnackbar } from "notistack";
import { useConfirm } from "material-ui-confirm";

const HomeComp = () => {
  const { enqueueSnackbar } = useSnackbar();
  const confirm = useConfirm();

  const handleOpen = () => {
    enqueueSnackbar("This is a success message!", { variant: "error" });
  };
  const handleClick = () => {
    confirm({
      description: "This action is permanent!",
      title: "this is title",
      allowClose: false,
      dialogProps: {
        maxWidth: "xs",
      },
      confirmationButtonProps: {
        variant: "contained",
        color: "primary",
      },
      cancellationButtonProps: {
        color: "inherit",
        sx: {
          textTransform: "capitalize",
        },
      },
    })
      .then(() => {
        /* ... */
      })
      .catch(() => {
        /* ... */
      });
  };
  return (
    <>
      <Button onClick={handleClick}>Confirm Modal</Button>
      <Button onClick={handleOpen}>Toast</Button>
    </>
  );
};
export default HomeComp;
