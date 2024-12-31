"use client";
import { SnackbarProvider } from "notistack";
import { ConfirmProvider } from "material-ui-confirm";

const ClientLayouts = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <ConfirmProvider>
      <SnackbarProvider
        autoHideDuration={1000}
        maxSnack={2}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {children}
      </SnackbarProvider>
    </ConfirmProvider>
  );
};

export default ClientLayouts;
